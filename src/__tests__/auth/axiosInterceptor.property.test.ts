/**
 * Property-based tests for Axios response interceptor retry behavior.
 * Feature: persistent-login
 */

import * as fc from "fast-check";
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { setupResponseInterceptor } from "../../lib/auth/axiosInterceptor";
import type { RefreshService, TokenStorageService } from "../../lib/auth/types";

// --- Helpers ---

/**
 * Creates a minimal mock TokenStorageService with a fixed refresh token.
 */
function createMockTokenStorage(
  refreshToken: string | null = "mock-refresh-token"
): TokenStorageService {
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

/**
 * Creates a mock RefreshService that resolves with the given new token.
 */
function createMockRefreshService(newToken: string): RefreshService & { refreshCallCount: number } {
  const service = {
    refreshCallCount: 0,
    refreshToken: jest.fn(async () => {
      service.refreshCallCount++;
      return newToken;
    }),
    isRefreshing: jest.fn(() => false),
    enqueueRequest: jest.fn(),
  };
  return service;
}

/**
 * Arbitrary for generating API URL paths that do NOT include the refresh endpoint.
 * Generates paths like "/api/users", "/data/items/123", etc.
 */
const arbNonRefreshUrl = fc
  .tuple(
    fc.array(
      fc.stringMatching(/^[a-z][a-z0-9_-]{0,15}$/),
      { minLength: 1, maxLength: 5 }
    ),
    fc.option(fc.stringMatching(/^[a-z0-9]{1,10}$/), { nil: undefined })
  )
  .map(([segments, id]) => {
    const path = "/" + segments.join("/");
    return id ? `${path}/${id}` : path;
  })
  .filter((url) => !url.includes("/auth/refresh"));

/**
 * Arbitrary for generating a new access token string (non-empty).
 */
const arbNewToken = fc.string({ minLength: 10, maxLength: 64 }).filter((s) => s.trim().length > 0);

// --- Property 7: 401 interceptor retry with new token ---

/**
 * Property 7: 401 interceptor retry with new token
 * **Validates: Requirements 2.1, 2.2**
 *
 * For any API request URL (excluding the refresh endpoint) that receives a 401 response
 * when a refresh token exists, the interceptor should retry the original request exactly
 * once with the new access token in the Authorization header.
 */
describe("Feature: persistent-login, Property 7: 401 interceptor retry with new token", () => {
  it("retries the original request exactly once with new token after 401", async () => {
    await fc.assert(
      fc.asyncProperty(arbNonRefreshUrl, arbNewToken, async (url, newToken) => {
        // Track interceptor error handler
        let errorHandler: ((error: AxiosError) => Promise<unknown>) | null = null;

        // Track retried requests
        const retriedRequests: InternalAxiosRequestConfig[] = [];

        // Mock axios instance
        const mockAxiosInstance = jest.fn().mockImplementation((config: InternalAxiosRequestConfig) => {
          retriedRequests.push(config);
          return Promise.resolve({ data: "success", status: 200 });
        }) as unknown as AxiosInstance;

        // Add interceptors.response.use mock
        (mockAxiosInstance as any).interceptors = {
          response: {
            use: (_onFulfilled: any, onRejected: any) => {
              errorHandler = onRejected;
            },
          },
        };

        const tokenStorage = createMockTokenStorage("valid-refresh-token");
        const refreshService = createMockRefreshService(newToken);
        const onAuthFailure = jest.fn();

        // Setup the interceptor
        setupResponseInterceptor(
          mockAxiosInstance,
          refreshService,
          tokenStorage,
          onAuthFailure
        );

        // Create a 401 error with the original request config
        const originalConfig: InternalAxiosRequestConfig = {
          url,
          method: "get",
          headers: {} as any,
        } as InternalAxiosRequestConfig;

        const axiosError = {
          config: originalConfig,
          response: { status: 401 },
          isAxiosError: true,
          message: "Request failed with status code 401",
          name: "AxiosError",
          toJSON: () => ({}),
        } as AxiosError;

        // Invoke the error handler (simulates 401 response)
        expect(errorHandler).not.toBeNull();
        await errorHandler!(axiosError);

        // Verify: refreshToken was called exactly once
        expect(refreshService.refreshToken).toHaveBeenCalledTimes(1);

        // Verify: the original request was retried exactly once
        expect(retriedRequests.length).toBe(1);

        // Verify: the retried request has the new token in Authorization header
        expect(retriedRequests[0].headers.Authorization).toBe(`Bearer ${newToken}`);

        // Verify: the retried request has the same URL
        expect(retriedRequests[0].url).toBe(url);

        // Verify: the request was marked as retried (_retry = true)
        expect((retriedRequests[0] as any)._retry).toBe(true);

        // Verify: onAuthFailure was NOT called (refresh succeeded)
        expect(onAuthFailure).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });

  it("does not retry more than once even if the retried request also fails", async () => {
    await fc.assert(
      fc.asyncProperty(arbNonRefreshUrl, arbNewToken, async (url, newToken) => {
        let errorHandler: ((error: AxiosError) => Promise<unknown>) | null = null;
        let retryCount = 0;

        // Mock axios instance that tracks call count
        const mockAxiosInstance = jest.fn().mockImplementation(() => {
          retryCount++;
          return Promise.resolve({ data: "success", status: 200 });
        }) as unknown as AxiosInstance;

        (mockAxiosInstance as any).interceptors = {
          response: {
            use: (_onFulfilled: any, onRejected: any) => {
              errorHandler = onRejected;
            },
          },
        };

        const tokenStorage = createMockTokenStorage("valid-refresh-token");
        const refreshService = createMockRefreshService(newToken);
        const onAuthFailure = jest.fn();

        setupResponseInterceptor(
          mockAxiosInstance,
          refreshService,
          tokenStorage,
          onAuthFailure
        );

        // First 401 — triggers refresh + retry
        const originalConfig: InternalAxiosRequestConfig = {
          url,
          method: "get",
          headers: {} as any,
        } as InternalAxiosRequestConfig;

        const axiosError = {
          config: originalConfig,
          response: { status: 401 },
          isAxiosError: true,
          message: "Request failed with status code 401",
          name: "AxiosError",
          toJSON: () => ({}),
        } as AxiosError;

        await errorHandler!(axiosError);

        // Now simulate a second 401 on the same request (already retried)
        const retriedConfig = {
          ...originalConfig,
          _retry: true,
          headers: { Authorization: `Bearer ${newToken}` } as any,
        } as InternalAxiosRequestConfig & { _retry: boolean };

        const secondError = {
          config: retriedConfig,
          response: { status: 401 },
          isAxiosError: true,
          message: "Request failed with status code 401",
          name: "AxiosError",
          toJSON: () => ({}),
        } as unknown as AxiosError;

        // Second 401 on already-retried request should trigger onAuthFailure
        await expect(errorHandler!(secondError)).rejects.toBeDefined();

        // Verify: onAuthFailure was called for the second 401
        expect(onAuthFailure).toHaveBeenCalledTimes(1);

        // Verify: only ONE retry was made (from first 401)
        expect(retryCount).toBe(1);
      }),
      { numRuns: 100 }
    );
  });
});
