/**
 * Property-based tests for token expiration classification.
 * Feature: persistent-login, Property 4: Token expiration classification
 *
 * **Validates: Requirements 4.1, 4.3, 4.5**
 */

import * as fc from "fast-check";
import { validateToken } from "../../lib/auth/tokenValidation";

// --- Helpers ---

/**
 * Encodes a string to base64url format (no padding).
 */
function base64url(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Builds a JWT string with a given payload object.
 * Uses a fixed header and dummy signature (jwt-decode only decodes, no verification).
 */
function buildJwt(payload: Record<string, unknown>): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(payload));
  const signature = base64url("fake-signature");
  return `${header}.${body}.${signature}`;
}

// --- Generators ---

/**
 * Generates an exp timestamp that is strictly in the future (valid token).
 */
const futureExpArb = fc.integer({ min: 1, max: 100_000_000 }).map((offset) => {
  const now = Math.floor(Date.now() / 1000);
  return now + offset;
});

/**
 * Generates an exp timestamp that is in the past or exactly now (expired token).
 */
const pastOrNowExpArb = fc.integer({ min: 1, max: 100_000_000 }).map((offset) => {
  const now = Math.floor(Date.now() / 1000);
  return now - offset;
});

/**
 * Generates arbitrary non-JWT strings that should be classified as "invalid".
 * Excludes strings that happen to have valid JWT structure with a numeric exp.
 */
const nonJwtStringArb = fc.oneof(
  // Empty string
  fc.constant(""),
  // Random strings without dots
  fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes(".")),
  // Strings with wrong number of dot-segments
  fc.string({ minLength: 1, maxLength: 20 }).map((s) => `${s}.${s}`),
  // Strings with 3 segments but non-base64 content
  fc.tuple(
    fc.string({ minLength: 1, maxLength: 10 }),
    fc.string({ minLength: 1, maxLength: 10 }),
    fc.string({ minLength: 1, maxLength: 10 })
  ).map(([a, b, c]) => `${a}.${b}.${c}`),
  // Whitespace
  fc.integer({ min: 1, max: 10 }).map((len) => " ".repeat(len)),
  // Special characters
  fc.constantFrom("null", "undefined", "true", "false", "123", "{}", "[]")
);

// --- Property 4: Token expiration classification ---

describe("Feature: persistent-login, Property 4: Token expiration classification", () => {
  /**
   * **Validates: Requirements 4.1, 4.3, 4.5**
   *
   * For any JWT with an `exp` claim:
   * - "valid" when exp is in the future
   * - "expired" when exp is in the past or equal to now
   * For any non-JWT string (malformed): "invalid"
   */

  it("classifies a JWT with a future exp as 'valid'", () => {
    fc.assert(
      fc.property(futureExpArb, (exp) => {
        const token = buildJwt({ exp, sub: "user-123", iat: exp - 3600 });
        const result = validateToken(token);
        expect(result).toBe("valid");
      }),
      { numRuns: 100 }
    );
  });

  it("classifies a JWT with a past exp as 'expired'", () => {
    fc.assert(
      fc.property(pastOrNowExpArb, (exp) => {
        const token = buildJwt({ exp, sub: "user-123", iat: exp - 3600 });
        const result = validateToken(token);
        expect(result).toBe("expired");
      }),
      { numRuns: 100 }
    );
  });

  it("classifies arbitrary non-JWT strings as 'invalid'", () => {
    fc.assert(
      fc.property(nonJwtStringArb, (input) => {
        const result = validateToken(input);
        expect(result).toBe("invalid");
      }),
      { numRuns: 100 }
    );
  });

  it("classifies a JWT without an exp claim as 'invalid'", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        (sub) => {
          // JWT payload without exp field
          const token = buildJwt({ sub, iat: Math.floor(Date.now() / 1000) });
          const result = validateToken(token);
          expect(result).toBe("invalid");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("classifies a JWT with non-numeric exp as 'invalid'", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 10 }),
          fc.constant(null),
          fc.constant(true),
          fc.array(fc.integer(), { maxLength: 3 })
        ),
        (invalidExp) => {
          const token = buildJwt({ exp: invalidExp, sub: "user-123" });
          const result = validateToken(token);
          expect(result).toBe("invalid");
        }
      ),
      { numRuns: 100 }
    );
  });
});
