/**
 * AuthService implementation for persistent login.
 * Coordinates login, logout, session validation, and token management.
 *
 * Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5
 */

import type { AuthService, RefreshService, TokenStorageService } from "./types";
import { createTokenStorage, detectStoragePreference } from "./tokenStorage";
import { validateToken } from "./tokenValidation";
import { createRefreshService } from "./refreshService";
import { axiosClient } from "../axiosClient";
import type { LoginResponseDTO } from "../http-service/tokenService/dto";

/** Login endpoint path (same as existing LoginUser uses). */
const LOGIN_ENDPOINT = "/auth/token";

/** Login page route for redirect. */
const LOGIN_ROUTE = "/public/login";

/**
 * Creates an AuthService instance that manages the full authentication lifecycle.
 *
 * The service:
 * - Calls the login API, stores tokens with the correct storage preference
 * - Validates sessions on app load (checks token expiry, refreshes if needed)
 * - Provides logout that clears all state and redirects
 * - Exposes convenience methods for checking auth status
 */
export function createAuthService(): AuthService {
  let tokenStorage: TokenStorageService | null = null;
  let refreshService: RefreshService | null = null;
  let authenticated = false;

  /**
   * Sets the Authorization header on the shared axios client.
   */
  function setAuthorizationHeader(token: string): void {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Clears the Authorization header from the shared axios client.
   */
  function clearAuthorizationHeader(): void {
    delete axiosClient.defaults.headers.common["Authorization"];
  }

  /**
   * Redirects the user to the login page.
   */
  function redirectToLogin(): void {
    if (typeof window !== "undefined") {
      window.location.href = LOGIN_ROUTE;
    }
  }

  return {
    /**
     * Authenticates the user by calling the login API, then stores tokens
     * in the correct storage mechanism based on the rememberMe preference.
     *
     * Requirements: 1.1, 1.2, 1.3, 1.5
     *
     * @param email - User's email address
     * @param password - User's password
     * @param rememberMe - If true, tokens stored in localStorage; otherwise sessionStorage
     */
    async login(email: string, password: string, rememberMe: boolean): Promise<void> {
      // Call the existing login API endpoint
      const { data } = await axiosClient.post<LoginResponseDTO>(LOGIN_ENDPOINT, {
        email,
        password,
      });

      // Determine storage based on rememberMe preference (Req 3.3, 3.4)
      const storagePreference = rememberMe ? "local" : "session";
      tokenStorage = createTokenStorage(storagePreference);

      // Attempt to store tokens — handle write failures (Req 1.5)
      try {
        tokenStorage.setTokens(data.access_token, data.refresh_token);

        // Verify the token was actually stored (catches silent storage failures)
        const storedToken = tokenStorage.getAccessToken();
        if (!storedToken) {
          throw new Error("Token storage write verification failed");
        }
      } catch (storageError) {
        // Storage write failed — do not proceed to authenticated state (Req 1.5)
        authenticated = false;
        tokenStorage = null;
        throw new Error("Unable to complete login");
      }

      // Set Authorization header on the shared axios client (Req 1.1, 1.2)
      setAuthorizationHeader(data.access_token);

      // Create refresh service for this session
      refreshService = createRefreshService(tokenStorage);

      authenticated = true;
    },

    /**
     * Logs out the user by clearing all tokens, headers, and redirecting to login.
     *
     * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
     */
    logout(): void {
      // Cancel pending refresh and reject queued requests (Req 5.4)
      refreshService = null;

      // If tokenStorage wasn't initialized (fresh instance), detect and create it
      // so we can clear tokens properly
      if (!tokenStorage) {
        const storagePreference = detectStoragePreference();
        tokenStorage = createTokenStorage(storagePreference);
      }

      // Clear stored tokens (Req 5.1, 5.2)
      // If clearing fails, we still proceed with header clear and redirect (Req 5.5)
      try {
        tokenStorage.clearTokens();
      } catch {
        // Best-effort: proceed with logout even if storage clear fails (Req 5.5)
      }

      // Clear Authorization header (Req 5.3)
      clearAuthorizationHeader();

      authenticated = false;
      tokenStorage = null;

      // Redirect to login page (Req 5.3)
      redirectToLogin();
    },

    /**
     * Clears all tokens and headers without redirecting.
     * Use when the caller handles navigation (e.g., via Next.js router).
     */
    logoutWithoutRedirect(): void {
      refreshService = null;

      if (!tokenStorage) {
        const storagePreference = detectStoragePreference();
        tokenStorage = createTokenStorage(storagePreference);
      }

      try {
        tokenStorage.clearTokens();
      } catch {
        // Best-effort
      }

      clearAuthorizationHeader();
      authenticated = false;
      tokenStorage = null;
    },

    /**
     * Validates the current session by checking stored tokens.
     * - If access token is valid: sets header and returns true
     * - If access token is expired and refresh token exists: attempts refresh
     * - If no tokens or invalid: clears state and redirects to login
     *
     * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
     *
     * @returns true if session is valid, false otherwise
     */
    async validateSession(): Promise<boolean> {
      // Detect where tokens are stored (Req 3.6)
      const storagePreference = detectStoragePreference();
      tokenStorage = createTokenStorage(storagePreference);

      const accessToken = tokenStorage.getAccessToken();

      // No tokens found — redirect to login (Req 4.4)
      if (!accessToken) {
        authenticated = false;
        tokenStorage = null;
        return false;
      }

      // Validate the access token (Req 4.1)
      const tokenStatus = validateToken(accessToken);

      if (tokenStatus === "valid") {
        // Token is valid — set header and proceed (Req 4.3)
        setAuthorizationHeader(accessToken);
        refreshService = createRefreshService(tokenStorage);
        authenticated = true;
        return true;
      }

      if (tokenStatus === "invalid") {
        // Malformed token — clear and redirect (Req 4.5)
        try {
          tokenStorage.clearTokens();
        } catch {
          // Best-effort clear
        }
        clearAuthorizationHeader();
        authenticated = false;
        tokenStorage = null;
        return false;
      }

      // Token is expired — attempt refresh if refresh token exists (Req 4.2)
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token — cannot renew, clear and redirect (Req 4.6)
        try {
          tokenStorage.clearTokens();
        } catch {
          // Best-effort clear
        }
        clearAuthorizationHeader();
        authenticated = false;
        tokenStorage = null;
        return false;
      }

      // Attempt to refresh the token (Req 4.2)
      refreshService = createRefreshService(tokenStorage);

      try {
        const newAccessToken = await refreshService.refreshToken();
        // Refresh succeeded — set header and proceed (Req 4.2)
        setAuthorizationHeader(newAccessToken);
        authenticated = true;
        return true;
      } catch {
        // Refresh failed — clear tokens and redirect (Req 4.6)
        try {
          tokenStorage.clearTokens();
        } catch {
          // Best-effort clear
        }
        clearAuthorizationHeader();
        authenticated = false;
        refreshService = null;
        tokenStorage = null;
        return false;
      }
    },

    /**
     * Returns the current access token from storage, or null if not available.
     */
    getAccessToken(): string | null {
      if (!tokenStorage) {
        return null;
      }
      return tokenStorage.getAccessToken();
    },

    /**
     * Returns whether the user is currently authenticated.
     */
    isAuthenticated(): boolean {
      return authenticated;
    },
  };
}
