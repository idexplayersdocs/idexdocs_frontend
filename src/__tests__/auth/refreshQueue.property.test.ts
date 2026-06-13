/**
 * Property-based tests for RefreshService queue behavior.
 * Feature: persistent-login
 */

import * as fc from "fast-check";
import axios from "axios";
import { createRefreshService } from "../../lib/auth/refreshService";
import type { TokenStorageService } from "../../lib/auth/types";

// --- Mock axios ---

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// --- Helpers ---

/**
 * Creates a minimal mock TokenStorageService that returns a fixed refresh token.
 */
function createMockTokenStorage(refreshToken: string | null = "mock-refresh-token"): TokenStorageService {
  let storedAccess: string | null = null;
  let storedRefresh: string | null = refreshToken;

  return {
    getAccessToken: () => storedAccess,
    getRefreshToken: () => storedRefresh,
    setTokens: (access: string, refresh?: string) => {
      storedAccess = access;
      if (refresh !== undefined) {
        storedRefresh = refresh;
      }
    },
    clearTokens: () => {
      storedAccess = null;
      storedRefresh = null;
    },
    getStorageType: () => "local",
  };
}

// --- Property 8: Refresh failure rejects all queued requests ---

/**
 * Property 8: Refresh failure rejects all queued requests
 * **Validates: Requirements 6.3, 2.4**
 *
 * For any positive number N of requests queued during a token refresh,
 * if the refresh fails, all N queued requests should be rejected (not left pending).
 */
describe("Feature: persistent-login, Property 8: Refresh failure rejects all queued requests", () => {
  it("when refresh fails, all N queued requests are rejected with the same error", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 50 }),
        fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
        async (numQueued, errorMessage) => {
          // Create a deferred promise to control when the POST resolves/rejects
          let postReject!: (reason: unknown) => void;
          const mockPost = jest.fn().mockImplementation(() => {
            return new Promise((_resolve, reject) => {
              postReject = reject;
            });
          });

          mockedAxios.create.mockReturnValue({ post: mockPost } as any);

          const tokenStorage = createMockTokenStorage("valid-refresh-token");
          const refreshService = createRefreshService(tokenStorage);

          // First call initiates the refresh (sets refreshing = true)
          const firstCallPromise = refreshService.refreshToken();

          // Subsequent N calls get enqueued because refresh is already in-flight
          const queuedPromises: Promise<string>[] = [];
          for (let i = 0; i < numQueued; i++) {
            queuedPromises.push(refreshService.refreshToken());
          }

          // Reject the refresh POST with an error
          const refreshError = new Error(errorMessage);
          postReject(refreshError);

          // The first call should reject
          await expect(firstCallPromise).rejects.toThrow(errorMessage);

          // ALL queued requests should be rejected with the same error
          const results = await Promise.allSettled(queuedPromises);

          for (const result of results) {
            expect(result.status).toBe("rejected");
            if (result.status === "rejected") {
              expect(result.reason).toBe(refreshError);
            }
          }

          // Verify exactly 1 refresh API call was made
          expect(mockPost).toHaveBeenCalledTimes(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("no queued request is left pending after refresh failure", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 30 }),
        async (numQueued) => {
          // Create a deferred promise to control when the POST resolves/rejects
          let postReject!: (reason: unknown) => void;
          const mockPost = jest.fn().mockImplementation(() => {
            return new Promise((_resolve, reject) => {
              postReject = reject;
            });
          });

          mockedAxios.create.mockReturnValue({ post: mockPost } as any);

          const tokenStorage = createMockTokenStorage("valid-refresh-token");
          const refreshService = createRefreshService(tokenStorage);

          // First call initiates the refresh
          const firstCallPromise = refreshService.refreshToken();

          // N subsequent calls get enqueued
          const queuedPromises: Promise<string>[] = [];
          for (let i = 0; i < numQueued; i++) {
            queuedPromises.push(refreshService.refreshToken());
          }

          // All promises (first + queued)
          const allPromises = [firstCallPromise, ...queuedPromises];

          // Reject the refresh
          postReject(new Error("Network error"));

          // Wait for all to settle — none should remain pending
          const settled = await Promise.allSettled(allPromises);

          // All should be settled (rejected), none pending
          expect(settled.length).toBe(numQueued + 1);
          for (const result of settled) {
            expect(result.status).toBe("rejected");
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
