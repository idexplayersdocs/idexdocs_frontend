/**
 * Utility to retrieve the stored access token from the correct storage mechanism.
 * Checks the new auth system keys first, then falls back to the legacy "token" key
 * for backward compatibility.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const preference = localStorage.getItem("storage_preference");

  if (preference === "session") {
    return sessionStorage.getItem("access_token");
  }

  // Check localStorage for new key
  const localToken = localStorage.getItem("access_token");
  if (localToken) {
    return localToken;
  }

  // Check sessionStorage for new key
  const sessionToken = sessionStorage.getItem("access_token");
  if (sessionToken) {
    return sessionToken;
  }

  // Legacy fallback
  return localStorage.getItem("token");
}
