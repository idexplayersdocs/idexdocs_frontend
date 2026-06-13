/**
 * Property-based tests for RefreshService API error propagation.
 * Feature: persistent-login
 */

import * as fc from "fast-check";
import type { TokenStorageService } from "../../lib/auth/types";

// Mock axios before importing the module under test
const mockPost = jest.fn();
const mockAxiosInstance = { post: mockPost };

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => mockAxiosInstance),
  },
}));

import { createRefreshService } from "../../lib/auth/refreshService";

// --- Helpers ---

/**
 * Creates a mock TokenStorageService with a stored refresh token.
 */
function createMockTokenStorage(refreshToken: string = "valid-refresh-token"): TokenStorageService {
  let storedAccessToken: string | null = null;
  let storedRefreshToken: string | null = refreshToken;

  return {
    getAccessToken: () => storedAccessToken,
    getRefreshToken: () => storedRefreshToken,
    setTokens: (access: string, refresh?: string) => {
      storedAccessToken = access;
      if (refresh !== undefined) {
        storedRefreshToken = refresh;
      }
    },
    clearTokens: () => {
      storedAccessToken = null;
      storedRefreshToken = null;
    },
    getStorageType: () => "local",
  };
}

// --- Generators ---

/**
 * Generates arbitrary non-success HTTP status codes (4xx and 5xx).
 * Range: 400–599
 */
const nonSuccessStatusCodeArb = fc.integer({ min: 400, max: 599 });

// --- Property 9: Refresh API error propagation ---

/**
 * Property 9: Refresh API error propagation
 * **Validates: Requirements 7.4**
 *
 * For any non-success HTTP status code (4xx or 5xx) returned by the refresh
 * endpoint, the refresh service function should reject with an error, enabling
 * the caller to handle the failure.
 */
describe("Feature: persistent-login, Property 9: Refresh API error propagation", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("refreshToken rejects with an error for any non-success HTTP status code", async () => {
    await fc.assert(
      fc.asyncProperty(nonSuccessStatusCodeArb, async (statusCode) => {
        // Arrange
        mockPost.mockReset();
        const tokenStorage = createMockTokenStorage("my-refresh-token");
        const refreshService = createRefreshService(tokenStorage);

        // Simulate axios throwing an error for non-success status (axios default behavior)
        const axiosError = new Error(`Request failed with status code ${statusCode}`);
        (axiosError as any).response = { status: statusCode, data: {} };
        (axiosError as any).isAxiosError = true;
        mockPost.mockRejectedValueOnce(axiosError);

        // Act & Assert: refreshToken should reject
        await expect(refreshService.refreshToken()).rejects.toThrow();
      }),
      { numRuns: 100 }
    );
  });

  it("refreshToken propagates the error message from the failed HTTP response", async () => {
    await fc.assert(
      fc.asyncProperty(nonSuccessStatusCodeArb, async (statusCode) => {
        // Arrange
        mockPost.mockReset();
        const tokenStorage = createMockTokenStorage("my-refresh-token");
        const refreshService = createRefreshService(tokenStorage);

        const errorMessage = `Request failed with status code ${statusCode}`;
        const axiosError = new Error(errorMessage);
        (axiosError as any).response = { status: statusCode, data: {} };
        (axiosError as any).isAxiosError = true;
        mockPost.mockRejectedValueOnce(axiosError);

        // Act & Assert: error message should be propagated
        await expect(refreshService.refreshToken()).rejects.toThrow(errorMessage);
      }),
      { numRuns: 100 }
    );
  });

  it("refreshToken rejects with an Error instance for network failures", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ERR_NETWORK"),
        async (errorCode) => {
          // Arrange
          mockPost.mockReset();
          const tokenStorage = createMockTokenStorage("my-refresh-token");
          const refreshService = createRefreshService(tokenStorage);

          // Simulate a network error (no response object)
          const networkError = new Error(`Network error: ${errorCode}`);
          (networkError as any).code = errorCode;
          (networkError as any).isAxiosError = true;
          mockPost.mockRejectedValueOnce(networkError);

          // Act & Assert: refreshToken should reject with an Error
          const result = refreshService.refreshToken();
          await expect(result).rejects.toBeInstanceOf(Error);
          await expect(
            refreshService.refreshToken().catch((e) => e)
          ).resolves.toBeInstanceOf(Error);
        }
      ),
      { numRuns: 100 }
    );
  });
});
