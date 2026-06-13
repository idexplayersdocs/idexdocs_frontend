import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  createAuthService,
  createTokenStorage,
  createRefreshService,
  setupResponseInterceptor,
  detectStoragePreference,
} from "@/lib/auth";
import { axiosClient } from "@/lib/axiosClient";

/** Timeout for session validation in milliseconds (Req 4.1). */
const SESSION_VALIDATION_TIMEOUT_MS = 3000;

/** Login page route. */
const LOGIN_ROUTE = "/public/login";

/**
 * Tracks whether the response interceptor has already been set up
 * to avoid registering it multiple times across re-renders.
 */
let interceptorInitialized = false;

/**
 * Tracks whether an auth failure redirect is already in progress
 * to prevent multiple concurrent redirects.
 */
let authFailureInProgress = false;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    const isPublicRoute = router.pathname.startsWith("/public/");

    // Public routes don't require authentication validation
    if (isPublicRoute) {
      setAuthChecked(true);
      authFailureInProgress = false; // Reset on login page
      return;
    }

    let cancelled = false;

    async function validateAuth(): Promise<void> {
      const authService = createAuthService();

      // Race validation against a 3-second timeout (Req 4.1)
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(false), SESSION_VALIDATION_TIMEOUT_MS);
      });

      let isValid: boolean;

      try {
        isValid = await Promise.race([
          authService.validateSession(),
          timeoutPromise,
        ]);
      } catch {
        // Any unexpected error during validation — treat as invalid
        isValid = false;
      }

      if (cancelled) return;

      if (isValid) {
        // Session is valid — proceed (Req 4.3)
        setAuthChecked(true);
      } else {
        // Session invalid/missing/timed out — redirect to login (Req 4.4, 4.5, 4.6)
        router.replace(LOGIN_ROUTE);
      }
    }

    validateAuth();

    return () => {
      cancelled = true;
    };
  }, [router.pathname]);

  // Set up the response interceptor once (Req 2.1)
  React.useEffect(() => {
    if (interceptorInitialized) return;
    interceptorInitialized = true;

    const storagePreference = detectStoragePreference();
    const tokenStorage = createTokenStorage(storagePreference);
    const refreshService = createRefreshService(tokenStorage);

    setupResponseInterceptor(axiosClient, refreshService, tokenStorage, () => {
      // onAuthFailure: clear tokens and redirect to login page
      // Clearing tokens prevents the login page from seeing stale tokens
      // and redirecting back (which would cause an infinite loop).
      if (authFailureInProgress) return;
      authFailureInProgress = true;

      tokenStorage.clearTokens();
      delete axiosClient.defaults.headers.common["Authorization"];
      if (typeof window !== "undefined") {
        window.location.href = LOGIN_ROUTE;
      }
    });
  }, []);

  // For public routes, render immediately. For protected routes, wait for auth check.
  const isPublicRoute = router.pathname.startsWith("/public/");

  if (!isPublicRoute && !authChecked) {
    // Don't render the protected page until auth validation is complete.
    // Return null for a brief moment (max 3s) while validating.
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </I18nextProvider>
  );
}
