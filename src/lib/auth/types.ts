/**
 * Auth module type definitions for persistent login feature.
 */

/** Storage mechanism type for token persistence. */
export type StorageType = "local" | "session";

/** Abstracts the storage mechanism (localStorage vs sessionStorage) for tokens. */
export interface TokenStorageService {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearTokens(): void;
  getStorageType(): StorageType;
}

/** Coordinates login, logout, session validation, and token management. */
export interface AuthService {
  login(email: string, password: string, rememberMe: boolean): Promise<void>;
  logout(): void;
  validateSession(): Promise<boolean>;
  getAccessToken(): string | null;
  isAuthenticated(): boolean;
}

/** Handles the token refresh API call and concurrent request queuing. */
export interface RefreshService {
  refreshToken(): Promise<string>;
  isRefreshing(): boolean;
  enqueueRequest(
    resolve: (token: string) => void,
    reject: (error: Error) => void
  ): void;
}
