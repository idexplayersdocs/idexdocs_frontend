/**
 * Unit tests for AuthService.
 * Feature: persistent-login
 *
 * Tests login flow, logout, session validation, storage failures,
 * and logout during pending refresh.
 *
 * Requirements: 1.5, 4.4, 4.5, 5.4, 5.5
 */

import type { TokenStorageService, RefreshService } from "../../lib/auth/types";

// --- Global window mock for node test environment ---

(globalThis as any).window = { location: { href: "" } };

// --- Mock modules ---

const mockPost = jest.fn();
const mockAxiosClient = {
  post: mockPost,
  defaults: {
    headers: {
      common: {} as Record<string, string>,
    },
  },
};

jest.mock("../../lib/axiosClient", () => ({
  axiosClient: mockAxiosClient,
}));

const mockCreateTokenStorage = jest.fn();
const mockDetectStoragePreference = jest.fn();

jest.mock("../../lib/auth/tokenStorage", () => ({
  createTokenStorage: (...args: unknown[]) => mockCreateTokenStorage(...args),
  detectStoragePreference: () => mockDetectStoragePreference(),
}));

const mockValidateToken = jest.fn();

jest.mock("../../lib/auth/tokenValidation", () => ({
  validateToken: (token: string) => mockValidateToken(token),
}));

const mockCreateRefreshService = jest.fn();

jest.mock("../../lib/auth/refreshService", () => ({
  createRefreshService: (...args: unknown[]) => mockCreateRefreshService(...args),
}));

// --- Import after mocks ---

import { createAuthService } from "../../lib/auth/authService";

// --- Helpers ---

function createMockTokenStorage(overrides: Partial<TokenStorageService> = {}): TokenStorageService {
  return {
    getAccessToken: jest.fn().mockReturnValue("stored-access-token"),
    getRefreshToken: jest.fn().mockReturnValue("stored-refresh-token"),
    setTokens: jest.fn(),
    clearTokens: jest.fn(),
    getStorageType: jest.fn().mockReturnValue("local"),
    ...overrides,
  };
}

function createMockRefreshService(overrides: Partial<RefreshService> = {}): RefreshService {
  return {
    refreshToken: jest.fn().mockResolvedValue("new-access-token"),
    isRefreshing: jest.fn().mockReturnValue(false),
    enqueueRequest: jest.fn(),
    ...overrides,
  };
}

// --- Test suite ---

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosClient.defaults.headers.common = {};
    (globalThis as any).window.location.href = "";
  });

  // ─── Login ───────────────────────────────────────────────────────────────

  describe("login", () => {
    it("stores tokens and sets Authorization header on success", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("new-access-token"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);

      const mockRefresh = createMockRefreshService();
      mockCreateRefreshService.mockReturnValue(mockRefresh);

      mockPost.mockResolvedValue({
        data: {
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          token_type: "bearer",
        },
      });

      const authService = createAuthService();
      await authService.login("user@test.com", "password123", true);

      // Verifies API was called correctly
      expect(mockPost).toHaveBeenCalledWith("/auth/token", {
        email: "user@test.com",
        password: "password123",
      });

      // Verifies tokens were stored
      expect(mockStorage.setTokens).toHaveBeenCalledWith(
        "new-access-token",
        "new-refresh-token"
      );

      // Verifies Authorization header was set
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBe(
        "Bearer new-access-token"
      );

      // Verifies authenticated state
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("uses 'local' storage when rememberMe is true", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("token-val"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockCreateRefreshService.mockReturnValue(createMockRefreshService());

      mockPost.mockResolvedValue({
        data: { access_token: "token-val", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();
      await authService.login("user@test.com", "pass", true);

      expect(mockCreateTokenStorage).toHaveBeenCalledWith("local");
    });

    it("uses 'session' storage when rememberMe is false", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("token-val"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockCreateRefreshService.mockReturnValue(createMockRefreshService());

      mockPost.mockResolvedValue({
        data: { access_token: "token-val", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();
      await authService.login("user@test.com", "pass", false);

      expect(mockCreateTokenStorage).toHaveBeenCalledWith("session");
    });

    it("throws 'Unable to complete login' when storage write fails (Req 1.5)", async () => {
      const mockStorage = createMockTokenStorage({
        setTokens: jest.fn().mockImplementation(() => {
          throw new Error("QuotaExceededError");
        }),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);

      mockPost.mockResolvedValue({
        data: { access_token: "at", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();

      await expect(
        authService.login("user@test.com", "pass", true)
      ).rejects.toThrow("Unable to complete login");

      // Should NOT be in authenticated state
      expect(authService.isAuthenticated()).toBe(false);
      // Authorization header should NOT be set
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBeUndefined();
    });

    it("throws 'Unable to complete login' when stored token verification returns null (Req 1.5)", async () => {
      // setTokens succeeds but getAccessToken returns null (silent failure)
      const mockStorage = createMockTokenStorage({
        setTokens: jest.fn(),
        getAccessToken: jest.fn().mockReturnValue(null),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);

      mockPost.mockResolvedValue({
        data: { access_token: "at", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();

      await expect(
        authService.login("user@test.com", "pass", true)
      ).rejects.toThrow("Unable to complete login");

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  // ─── Logout ──────────────────────────────────────────────────────────────

  describe("logout", () => {
    it("clears tokens, clears header, and redirects to /public/login", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("at"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockCreateRefreshService.mockReturnValue(createMockRefreshService());

      mockPost.mockResolvedValue({
        data: { access_token: "at", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();
      await authService.login("user@test.com", "pass", true);

      // Set header manually to confirm it gets cleared
      mockAxiosClient.defaults.headers.common["Authorization"] = "Bearer at";

      authService.logout();

      // Tokens cleared
      expect(mockStorage.clearTokens).toHaveBeenCalled();
      // Header cleared
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBeUndefined();
      // Redirected
      expect(window.location.href).toBe("/public/login");
      // Not authenticated
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("still redirects even if storage clear throws (Req 5.5)", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("at"),
        clearTokens: jest.fn().mockImplementation(() => {
          throw new Error("Storage unavailable");
        }),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockCreateRefreshService.mockReturnValue(createMockRefreshService());

      mockPost.mockResolvedValue({
        data: { access_token: "at", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();
      await authService.login("user@test.com", "pass", true);

      // Should not throw
      expect(() => authService.logout()).not.toThrow();

      // Still redirects despite storage error
      expect(window.location.href).toBe("/public/login");
      // Header still cleared
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBeUndefined();
    });

    it("nullifies refreshService reference, effectively canceling pending refresh (Req 5.4)", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("at"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      const mockRefresh = createMockRefreshService();
      mockCreateRefreshService.mockReturnValue(mockRefresh);

      mockPost.mockResolvedValue({
        data: { access_token: "at", refresh_token: "rt", token_type: "bearer" },
      });

      const authService = createAuthService();
      await authService.login("user@test.com", "pass", true);

      // Logout should proceed without issues even with refresh service active
      authService.logout();

      expect(window.location.href).toBe("/public/login");
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  // ─── validateSession ─────────────────────────────────────────────────────

  describe("validateSession", () => {
    it("returns true and sets header when access token is valid", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("valid-access-token"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockDetectStoragePreference.mockReturnValue("local");
      mockValidateToken.mockReturnValue("valid");
      mockCreateRefreshService.mockReturnValue(createMockRefreshService());

      const authService = createAuthService();
      const result = await authService.validateSession();

      expect(result).toBe(true);
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBe(
        "Bearer valid-access-token"
      );
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("returns true after successful refresh when token is expired + refresh token exists", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("expired-access-token"),
        getRefreshToken: jest.fn().mockReturnValue("valid-refresh-token"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockDetectStoragePreference.mockReturnValue("local");
      mockValidateToken.mockReturnValue("expired");

      const mockRefresh = createMockRefreshService({
        refreshToken: jest.fn().mockResolvedValue("refreshed-access-token"),
      });
      mockCreateRefreshService.mockReturnValue(mockRefresh);

      const authService = createAuthService();
      const result = await authService.validateSession();

      expect(result).toBe(true);
      expect(mockRefresh.refreshToken).toHaveBeenCalled();
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBe(
        "Bearer refreshed-access-token"
      );
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("returns false when no tokens are found (Req 4.4)", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue(null),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockDetectStoragePreference.mockReturnValue("session");

      const authService = createAuthService();
      const result = await authService.validateSession();

      expect(result).toBe(false);
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("returns false and clears tokens when token is malformed/invalid (Req 4.5)", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("not-a-valid-jwt"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockDetectStoragePreference.mockReturnValue("local");
      mockValidateToken.mockReturnValue("invalid");

      const authService = createAuthService();
      const result = await authService.validateSession();

      expect(result).toBe(false);
      expect(mockStorage.clearTokens).toHaveBeenCalled();
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBeUndefined();
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("returns false when token is expired and refresh fails", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("expired-token"),
        getRefreshToken: jest.fn().mockReturnValue("refresh-token"),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockDetectStoragePreference.mockReturnValue("local");
      mockValidateToken.mockReturnValue("expired");

      const mockRefresh = createMockRefreshService({
        refreshToken: jest.fn().mockRejectedValue(new Error("Refresh failed")),
      });
      mockCreateRefreshService.mockReturnValue(mockRefresh);

      const authService = createAuthService();
      const result = await authService.validateSession();

      expect(result).toBe(false);
      expect(mockStorage.clearTokens).toHaveBeenCalled();
      expect(mockAxiosClient.defaults.headers.common["Authorization"]).toBeUndefined();
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("returns false when token is expired and no refresh token exists", async () => {
      const mockStorage = createMockTokenStorage({
        getAccessToken: jest.fn().mockReturnValue("expired-token"),
        getRefreshToken: jest.fn().mockReturnValue(null),
      });
      mockCreateTokenStorage.mockReturnValue(mockStorage);
      mockDetectStoragePreference.mockReturnValue("session");
      mockValidateToken.mockReturnValue("expired");

      const authService = createAuthService();
      const result = await authService.validateSession();

      expect(result).toBe(false);
      expect(mockStorage.clearTokens).toHaveBeenCalled();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
