/**
 * Token storage service implementation for persistent login.
 * Provides factory function and storage preference detection.
 */

import type { StorageType, TokenStorageService } from "./types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const STORAGE_PREFERENCE_KEY = "storage_preference";

/**
 * Returns true if a token value is valid (non-empty, non-whitespace-only).
 */
function isValidToken(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Creates a TokenStorageService that delegates to the correct Storage API
 * based on the given preference.
 *
 * @param preference - "local" for localStorage, "session" for sessionStorage
 */
export function createTokenStorage(preference: StorageType): TokenStorageService {
  const storage: Storage =
    preference === "local" ? localStorage : sessionStorage;

  return {
    getAccessToken(): string | null {
      return storage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
      return storage.getItem(REFRESH_TOKEN_KEY);
    },

    setTokens(accessToken: string, refreshToken?: string): void {
      if (!isValidToken(accessToken)) {
        return;
      }

      storage.setItem(ACCESS_TOKEN_KEY, accessToken);

      if (refreshToken !== undefined && isValidToken(refreshToken)) {
        storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      // Persist storage preference in localStorage so the app knows
      // where to look on next load (Req 3.3, 3.4)
      localStorage.setItem(STORAGE_PREFERENCE_KEY, preference);
    },

    clearTokens(): void {
      storage.removeItem(ACCESS_TOKEN_KEY);
      storage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(STORAGE_PREFERENCE_KEY);
      // Also clear legacy "token" key for backward compatibility
      localStorage.removeItem("token");
      // Clear from both storage mechanisms to be thorough
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    getStorageType(): StorageType {
      return preference;
    },
  };
}

/**
 * Detects where tokens are stored by:
 * 1. Reading `storage_preference` from localStorage
 * 2. Checking both storage mechanisms for existing tokens (Req 3.6)
 *
 * Returns the detected StorageType, defaulting to "session" if no
 * preference or tokens are found.
 */
export function detectStoragePreference(): StorageType {
  // Check persisted preference first
  const persisted = localStorage.getItem(STORAGE_PREFERENCE_KEY);
  if (persisted === "local" || persisted === "session") {
    return persisted;
  }

  // Fallback: check both storage mechanisms for existing tokens
  if (
    localStorage.getItem(ACCESS_TOKEN_KEY) !== null ||
    localStorage.getItem(REFRESH_TOKEN_KEY) !== null
  ) {
    return "local";
  }

  if (
    sessionStorage.getItem(ACCESS_TOKEN_KEY) !== null ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY) !== null
  ) {
    return "session";
  }

  // Default to session (more conservative — tokens cleared on browser close)
  return "session";
}
