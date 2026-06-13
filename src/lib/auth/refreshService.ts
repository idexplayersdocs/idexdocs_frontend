/**
 * Refresh service implementation for persistent login.
 * Handles token refresh API calls and concurrent request queuing.
 */

import axios from "axios";
import type { RefreshRequestDTO, RefreshResponseDTO } from "../http-service/tokenService/dto";
import type { RefreshService, TokenStorageService } from "./types";

/** Refresh endpoint path (matches existing auth pattern: /auth/token for login). */
const REFRESH_ENDPOINT = "/auth/refresh";

/** Timeout for refresh requests in milliseconds (Req 7.5). */
const REFRESH_TIMEOUT_MS = 10_000;

/**
 * Queued request entry — stores the resolve/reject callbacks
 * for requests waiting on a token refresh to complete.
 */
interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

/**
 * Creates a RefreshService that:
 * - Uses a separate axios instance without Authorization header (Req 7.3)
 * - POSTs the stored refresh token to the refresh endpoint (Req 7.1)
 * - Applies a 10-second timeout (Req 7.5)
 * - Queues concurrent requests during refresh (Req 6.1, 6.2, 6.3)
 * - Updates stored tokens on success (Req 2.3, 7.2)
 *
 * @param tokenStorage - The TokenStorageService to read/write tokens
 */
export function createRefreshService(
  tokenStorage: TokenStorageService
): RefreshService {
  // Separate axios instance — no Authorization header (Req 7.3)
  const refreshClient = axios.create({
    baseURL: process.env.API_URL,
    timeout: REFRESH_TIMEOUT_MS,
  });

  let refreshing = false;
  let queue: QueuedRequest[] = [];

  /**
   * Processes (resolves or rejects) all queued requests and clears the queue.
   */
  function processQueue(error: Error | null, token: string | null): void {
    const pending = queue;
    queue = [];

    pending.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });
  }

  return {
    /**
     * Attempts to refresh the access token.
     * If a refresh is already in-flight, enqueues the caller and returns
     * a promise that resolves/rejects when the current refresh completes.
     *
     * On success: updates stored tokens and resolves all queued requests.
     * On failure: rejects all queued requests.
     */
    async refreshToken(): Promise<string> {
      // If already refreshing, queue this caller (Req 6.1)
      if (refreshing) {
        return new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject });
        });
      }

      const storedRefreshToken = tokenStorage.getRefreshToken();

      if (!storedRefreshToken) {
        return Promise.reject(
          new Error("No refresh token available")
        );
      }

      refreshing = true;

      try {
        const payload: RefreshRequestDTO = {
          refresh_token: storedRefreshToken,
        };

        const { data } = await refreshClient.post<RefreshResponseDTO>(
          REFRESH_ENDPOINT,
          payload
        );

        const newAccessToken = data.access_token;

        // Update stored tokens (Req 2.3, 7.2)
        tokenStorage.setTokens(newAccessToken, data.refresh_token);

        // Resolve all queued requests with the new token (Req 6.2)
        processQueue(null, newAccessToken);

        return newAccessToken;
      } catch (err: unknown) {
        const error =
          err instanceof Error
            ? err
            : new Error("Token refresh failed");

        // Reject all queued requests (Req 6.3)
        processQueue(error, null);

        throw error;
      } finally {
        refreshing = false;
      }
    },

    /**
     * Returns whether a refresh is currently in progress.
     */
    isRefreshing(): boolean {
      return refreshing;
    },

    /**
     * Enqueues a request to be resolved/rejected when the current
     * refresh operation completes.
     */
    enqueueRequest(
      resolve: (token: string) => void,
      reject: (error: Error) => void
    ): void {
      queue.push({ resolve, reject });
    },
  };
}
