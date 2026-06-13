/**
 * Axios response interceptor for automatic token refresh on 401 responses.
 *
 * Intercepts 401 Unauthorized responses (excluding the refresh endpoint),
 * attempts to refresh the access token, and retries the original request.
 * Queues concurrent 401s while a refresh is in progress.
 *
 * Requirements: 2.1, 2.2, 2.4, 2.5, 2.6
 */

import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import type { RefreshService, TokenStorageService } from "./types";

/** Path of the refresh endpoint — excluded from interception to avoid loops. */
const REFRESH_ENDPOINT = "/auth/refresh";

/**
 * Extended request config with a `_retry` flag to prevent infinite retry loops.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Sets up a response interceptor on the given axios instance that:
 * 1. Intercepts 401 responses (excluding the refresh endpoint)
 * 2. Attempts to refresh the access token if a refresh token exists
 * 3. Retries the original request exactly once with the new token
 * 4. Queues concurrent 401 requests while a refresh is in progress
 * 5. Calls onAuthFailure() when refresh is not possible or fails
 *
 * @param axiosInstance - The axios instance to attach the interceptor to
 * @param refreshService - Service handling token refresh and request queuing
 * @param tokenStorage - Service for reading/writing tokens in storage
 * @param onAuthFailure - Callback invoked when authentication cannot be recovered (e.g., redirect to login)
 */
export function setupResponseInterceptor(
  axiosInstance: AxiosInstance,
  refreshService: RefreshService,
  tokenStorage: TokenStorageService,
  onAuthFailure: () => void
): void {
  axiosInstance.interceptors.response.use(null, async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // If there's no config or the response is not 401, reject immediately
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Skip interception for the refresh endpoint itself (Req 7.3 — avoid circular 401)
    if (originalRequest.url?.includes(REFRESH_ENDPOINT)) {
      return Promise.reject(error);
    }

    // Skip if this request was already retried (prevent infinite loops)
    if (originalRequest._retry) {
      onAuthFailure();
      return Promise.reject(error);
    }

    // If no refresh token exists, redirect to login (Req 2.6)
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      onAuthFailure();
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request (Req 2.5)
    if (refreshService.isRefreshing()) {
      return new Promise<string>((resolve, reject) => {
        refreshService.enqueueRequest(resolve, reject);
      }).then((newToken) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }).catch((refreshError) => {
        onAuthFailure();
        return Promise.reject(refreshError);
      });
    }

    // Mark as retried before initiating refresh
    originalRequest._retry = true;

    try {
      // Attempt to refresh the token (Req 2.1)
      const newAccessToken = await refreshService.refreshToken();

      // Retry the original request with the new token (Req 2.2)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear tokens and redirect (Req 2.4)
      onAuthFailure();
      return Promise.reject(refreshError);
    }
  });
}
