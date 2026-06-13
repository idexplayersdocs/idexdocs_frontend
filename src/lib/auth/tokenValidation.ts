/**
 * Token validation utility for persistent login.
 * Uses jwt-decode to check token expiration without network calls.
 */

import { jwtDecode } from "jwt-decode";

export type TokenStatus = "valid" | "expired" | "invalid";

interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

/**
 * Validates a JWT token by decoding it and checking its expiration claim.
 *
 * @param token - The JWT string to validate
 * @returns "valid" if exp > now, "expired" if exp <= now, "invalid" for malformed tokens
 *
 * Requirements: 4.1, 4.3, 4.5
 */
export function validateToken(token: string): TokenStatus {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (typeof decoded.exp !== "number") {
      return "invalid";
    }

    const now = Math.floor(Date.now() / 1000);

    return decoded.exp > now ? "valid" : "expired";
  } catch {
    return "invalid";
  }
}
