/**
 * Property-based tests for TokenStorageService.
 * Feature: persistent-login
 */

import * as fc from "fast-check";
import { createTokenStorage, detectStoragePreference } from "../../lib/auth/tokenStorage";

// --- Storage mock setup ---

function createMockStorage(): Storage {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
  };
}

let mockLocalStorage: Storage;
let mockSessionStorage: Storage;

beforeEach(() => {
  mockLocalStorage = createMockStorage();
  mockSessionStorage = createMockStorage();

  Object.defineProperty(global, "localStorage", { value: mockLocalStorage, writable: true });
  Object.defineProperty(global, "sessionStorage", { value: mockSessionStorage, writable: true });
});

afterEach(() => {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
});

// --- Generators ---

/**
 * Generates a valid non-empty, non-whitespace-only token string.
 */
const validTokenArb = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);

// --- Property 1: Token storage round-trip ---

/**
 * Property 1: Token storage round-trip
 * **Validates: Requirements 1.1, 1.2, 2.3, 7.2**
 *
 * For any valid non-empty, non-whitespace token string (access or refresh),
 * storing it via TokenStorageService and then retrieving it should return the
 * exact same string value.
 */
describe("Feature: persistent-login, Property 1: Token storage round-trip", () => {
  it("setTokens then getAccessToken returns the same access token value", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        fc.constantFrom("local" as const, "session" as const),
        (accessToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken);

          const retrieved = storage.getAccessToken();
          expect(retrieved).toBe(accessToken);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setTokens then getRefreshToken returns the same refresh token value", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        validTokenArb,
        fc.constantFrom("local" as const, "session" as const),
        (accessToken, refreshToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken, refreshToken);

          const retrievedRefresh = storage.getRefreshToken();
          expect(retrievedRefresh).toBe(refreshToken);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setTokens stores both access and refresh tokens retrievable in the same call", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        validTokenArb,
        fc.constantFrom("local" as const, "session" as const),
        (accessToken, refreshToken, preference) => {
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken, refreshToken);

          expect(storage.getAccessToken()).toBe(accessToken);
          expect(storage.getRefreshToken()).toBe(refreshToken);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 3: Storage mechanism selection based on rememberMe ---

describe("Feature: persistent-login, Property 3: Storage mechanism selection based on rememberMe", () => {
  /**
   * **Validates: Requirements 3.3, 3.4, 3.6**
   *
   * For any valid token pair and boolean rememberMe value:
   * - rememberMe=true → tokens stored in localStorage (not sessionStorage)
   * - rememberMe=false → tokens stored in sessionStorage (not localStorage)
   */

  it("should store tokens in localStorage when rememberMe is true and not in sessionStorage", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        validTokenArb,
        (accessToken, refreshToken) => {
          // Clear storages
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          // rememberMe=true → "local" storage
          const storage = createTokenStorage("local");
          storage.setTokens(accessToken, refreshToken);

          // Tokens should be in localStorage
          expect(mockLocalStorage.getItem("access_token")).toBe(accessToken);
          expect(mockLocalStorage.getItem("refresh_token")).toBe(refreshToken);

          // Tokens should NOT be in sessionStorage
          expect(mockSessionStorage.getItem("access_token")).toBeNull();
          expect(mockSessionStorage.getItem("refresh_token")).toBeNull();

          // Storage type should report "local"
          expect(storage.getStorageType()).toBe("local");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should store tokens in sessionStorage when rememberMe is false and not in localStorage (except preference key)", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        validTokenArb,
        (accessToken, refreshToken) => {
          // Clear storages
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          // rememberMe=false → "session" storage
          const storage = createTokenStorage("session");
          storage.setTokens(accessToken, refreshToken);

          // Tokens should be in sessionStorage
          expect(mockSessionStorage.getItem("access_token")).toBe(accessToken);
          expect(mockSessionStorage.getItem("refresh_token")).toBe(refreshToken);

          // Token keys should NOT be in localStorage (preference key IS expected in localStorage)
          expect(mockLocalStorage.getItem("access_token")).toBeNull();
          expect(mockLocalStorage.getItem("refresh_token")).toBeNull();

          // Storage type should report "session"
          expect(storage.getStorageType()).toBe("session");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should persist storage_preference in localStorage regardless of rememberMe value", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        fc.boolean(),
        (accessToken, rememberMe) => {
          // Clear storages
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const preference = rememberMe ? "local" : "session";
          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken);

          // storage_preference should always be in localStorage
          expect(mockLocalStorage.getItem("storage_preference")).toBe(preference);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should detect correct storage via detectStoragePreference after tokens are stored", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        validTokenArb,
        fc.boolean(),
        (accessToken, refreshToken, rememberMe) => {
          // Clear storages
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const preference = rememberMe ? "local" : "session";
          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken, refreshToken);

          // detectStoragePreference should return the same preference
          const detected = detectStoragePreference();
          expect(detected).toBe(preference);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 5: Logout clears all tokens ---

/**
 * Property 5: Logout clears all tokens
 * **Validates: Requirements 5.1, 5.2**
 *
 * For arbitrary stored tokens (access and/or refresh, in any storage mechanism),
 * after invoking clearTokens(), neither token should be retrievable from any
 * storage mechanism, and storage_preference should also be removed.
 */
describe("Feature: persistent-login, Property 5: Logout clears all tokens", () => {
  it("clearTokens() removes access_token, refresh_token from selected storage and storage_preference from localStorage", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        validTokenArb,
        fc.constantFrom("local" as const, "session" as const),
        (accessToken, refreshToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          // Arrange: store tokens
          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken, refreshToken);

          // Verify tokens are stored before clearing
          expect(storage.getAccessToken()).toBe(accessToken);
          expect(storage.getRefreshToken()).toBe(refreshToken);
          expect(mockLocalStorage.getItem("storage_preference")).toBe(preference);

          // Act: clear tokens (logout)
          storage.clearTokens();

          // Assert: tokens are removed from selected storage
          expect(storage.getAccessToken()).toBeNull();
          expect(storage.getRefreshToken()).toBeNull();

          // Assert: storage_preference is removed from localStorage
          expect(mockLocalStorage.getItem("storage_preference")).toBeNull();

          // Assert: verify at raw storage level — neither mechanism has tokens
          expect(mockLocalStorage.getItem("access_token")).toBeNull();
          expect(mockLocalStorage.getItem("refresh_token")).toBeNull();
          expect(mockSessionStorage.getItem("access_token")).toBeNull();
          expect(mockSessionStorage.getItem("refresh_token")).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("clearTokens() works even when only access_token was stored (no refresh_token)", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        fc.constantFrom("local" as const, "session" as const),
        (accessToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          // Arrange: store only access token (no refresh token)
          const storage = createTokenStorage(preference);
          storage.setTokens(accessToken);

          // Act: clear tokens
          storage.clearTokens();

          // Assert: everything is cleared
          expect(storage.getAccessToken()).toBeNull();
          expect(storage.getRefreshToken()).toBeNull();
          expect(mockLocalStorage.getItem("storage_preference")).toBeNull();
          expect(mockLocalStorage.getItem("access_token")).toBeNull();
          expect(mockSessionStorage.getItem("access_token")).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 2: Invalid tokens rejected from storage ---

/**
 * Property 2: Invalid tokens rejected from storage
 * **Validates: Requirements 1.4**
 *
 * For any string composed entirely of whitespace characters (including the empty
 * string), attempting to store it as a token value should result in the token not
 * being present in storage.
 */
describe("Feature: persistent-login, Property 2: Invalid tokens rejected from storage", () => {
  /**
   * Arbitrary: whitespace-only strings (including empty string).
   * Generates strings consisting of spaces, tabs, newlines, and other whitespace.
   */
  const whitespaceChars = [" ", "\t", "\n", "\r", "\f", "\v"];
  const whitespaceOnlyArb = fc.oneof(
    fc.constant(""),
    fc.array(fc.constantFrom(...whitespaceChars), { minLength: 1, maxLength: 20 })
      .map((chars) => chars.join(""))
  );

  it("setTokens with a whitespace-only access token does not store the access token", () => {
    fc.assert(
      fc.property(
        whitespaceOnlyArb,
        fc.constantFrom("local" as const, "session" as const),
        (invalidToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const storage = createTokenStorage(preference);

          // Act: attempt to store a whitespace-only access token
          storage.setTokens(invalidToken);

          // Assert: access token should not be stored
          expect(storage.getAccessToken()).toBeNull();

          // Assert: at raw storage level, access_token key should not exist
          expect(mockLocalStorage.getItem("access_token")).toBeNull();
          expect(mockSessionStorage.getItem("access_token")).toBeNull();

          // Assert: storage_preference should not be set (nothing was stored)
          expect(mockLocalStorage.getItem("storage_preference")).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setTokens with a whitespace-only access token does not store a valid refresh token either", () => {
    fc.assert(
      fc.property(
        whitespaceOnlyArb,
        validTokenArb,
        fc.constantFrom("local" as const, "session" as const),
        (invalidAccessToken, validRefreshToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const storage = createTokenStorage(preference);

          // Act: attempt to store with invalid access token but valid refresh token
          storage.setTokens(invalidAccessToken, validRefreshToken);

          // Assert: nothing should be stored because access token is invalid
          expect(storage.getAccessToken()).toBeNull();
          expect(storage.getRefreshToken()).toBeNull();

          // Assert: at raw storage level, neither token key should exist
          expect(mockLocalStorage.getItem("access_token")).toBeNull();
          expect(mockLocalStorage.getItem("refresh_token")).toBeNull();
          expect(mockSessionStorage.getItem("access_token")).toBeNull();
          expect(mockSessionStorage.getItem("refresh_token")).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setTokens with a valid access token but whitespace-only refresh token stores only the access token", () => {
    fc.assert(
      fc.property(
        validTokenArb,
        whitespaceOnlyArb,
        fc.constantFrom("local" as const, "session" as const),
        (validAccessToken, invalidRefreshToken, preference) => {
          // Clear storage before each iteration
          mockLocalStorage.clear();
          mockSessionStorage.clear();

          const storage = createTokenStorage(preference);

          // Act: store valid access token with invalid refresh token
          storage.setTokens(validAccessToken, invalidRefreshToken);

          // Assert: access token should be stored
          expect(storage.getAccessToken()).toBe(validAccessToken);

          // Assert: refresh token should NOT be stored
          expect(storage.getRefreshToken()).toBeNull();

          // Assert: storage_preference should be set (access token was stored)
          expect(mockLocalStorage.getItem("storage_preference")).toBe(preference);
        }
      ),
      { numRuns: 100 }
    );
  });
});
