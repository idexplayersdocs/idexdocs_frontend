# Implementation Plan: Persistent Login

## Overview

This plan implements persistent login for the IdexDocs frontend. The approach builds from foundational services (token storage, validation) up through the refresh mechanism and interceptor, then wires into the UI layer. Property-based tests validate each module immediately after implementation to catch errors early.

## Tasks

- [x] 1. Set up auth module structure and core interfaces
  - [x] 1.1 Create directory structure and type definitions
    - Create `src/lib/auth/` directory
    - Create `src/lib/auth/types.ts` with `StorageType`, `TokenStorageService`, `AuthService`, `RefreshService` interfaces
    - Create `src/lib/auth/index.ts` barrel export
    - _Requirements: 1.1, 1.2, 7.1_

  - [x] 1.2 Update Token DTOs
    - Modify `src/lib/http-service/tokenService/dto.ts` to add `LoginResponseDTO.refresh_token`, `RefreshRequestDTO`, and `RefreshResponseDTO` interfaces
    - Ensure backward compatibility with existing `access_token` field
    - _Requirements: 7.1, 7.2_

- [x] 2. Implement TokenStorageService
  - [x] 2.1 Implement `createTokenStorage` factory and `detectStoragePreference`
    - Create `src/lib/auth/tokenStorage.ts`
    - Implement `createTokenStorage(preference: StorageType)` returning a `TokenStorageService` object
    - Implement `detectStoragePreference()` that reads `storage_preference` from localStorage and checks both storage mechanisms
    - Implement `setTokens` to reject empty/whitespace-only tokens (treat as absent)
    - Store `storage_preference` key in localStorage on every write
    - _Requirements: 1.1, 1.2, 1.4, 3.3, 3.4, 3.6_

  - [x] 2.2 Write property tests for token storage round-trip
    - **Property 1: Token storage round-trip**
    - **Validates: Requirements 1.1, 1.2, 2.3, 7.2**
    - Test file: `src/__tests__/auth/tokenStorage.property.test.ts`
    - Generate arbitrary non-empty, non-whitespace strings; verify `setTokens` then `getAccessToken`/`getRefreshToken` returns the same value

  - [x] 2.3 Write property tests for invalid token rejection
    - **Property 2: Invalid tokens rejected from storage**
    - **Validates: Requirements 1.4**
    - Test file: `src/__tests__/auth/tokenStorage.property.test.ts`
    - Generate arbitrary whitespace-only strings (including empty); verify token is not stored

  - [x] 2.4 Write property tests for storage mechanism selection
    - **Property 3: Storage mechanism selection based on rememberMe**
    - **Validates: Requirements 3.3, 3.4, 3.6**
    - Test file: `src/__tests__/auth/tokenStorage.property.test.ts`
    - For arbitrary tokens and boolean `rememberMe`, verify correct storage backend is used

  - [x] 2.5 Write property tests for logout clearing tokens
    - **Property 5: Logout clears all tokens**
    - **Validates: Requirements 5.1, 5.2**
    - Test file: `src/__tests__/auth/tokenStorage.property.test.ts`
    - For arbitrary stored tokens, verify `clearTokens()` removes from both storage mechanisms

- [x] 3. Implement token validation utility
  - [x] 3.1 Create token validation function
    - Create `src/lib/auth/tokenValidation.ts`
    - Implement `validateToken(token: string): "valid" | "expired" | "invalid"` using `jwt-decode`
    - Return `"valid"` if `exp > now`, `"expired"` if `exp <= now`, `"invalid"` for malformed tokens
    - _Requirements: 4.1, 4.3, 4.5_

  - [x] 3.2 Write property tests for token expiration classification
    - **Property 4: Token expiration classification**
    - **Validates: Requirements 4.1, 4.3, 4.5**
    - Test file: `src/__tests__/auth/tokenValidation.property.test.ts`
    - Generate JWTs with arbitrary `exp` claims (past/future); verify classification
    - Generate arbitrary non-JWT strings; verify returns `"invalid"`

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement RefreshService
  - [x] 5.1 Create RefreshService with queue mechanism
    - Create `src/lib/auth/refreshService.ts`
    - Create a separate axios instance (no Authorization header) for refresh calls
    - Implement `refreshToken()` that POSTs to the refresh endpoint with the stored refresh token
    - Apply 10-second timeout to refresh requests
    - Implement promise-based queue: while refreshing, `enqueueRequest` stores resolve/reject callbacks
    - On refresh success, resolve all queued with new token; on failure, reject all queued
    - Update stored tokens (access + refresh if returned) via TokenStorageService
    - _Requirements: 2.1, 2.3, 2.5, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.2 Write property tests for single refresh call on concurrent 401s
    - **Property 6: Single refresh call for concurrent 401s**
    - **Validates: Requirements 6.1, 6.2, 2.5**
    - Test file: `src/__tests__/auth/refreshQueue.property.test.ts`
    - For arbitrary N concurrent 401s, verify exactly one refresh call and all resolve with same token

  - [x] 5.3 Write property tests for refresh failure rejecting all queued
    - **Property 8: Refresh failure rejects all queued requests**
    - **Validates: Requirements 6.3, 2.4**
    - Test file: `src/__tests__/auth/refreshQueue.property.test.ts`
    - For arbitrary N queued requests when refresh fails, verify all are rejected

  - [x] 5.4 Write property tests for refresh API error propagation
    - **Property 9: Refresh API error propagation**
    - **Validates: Requirements 7.4**
    - Test file: `src/__tests__/auth/refreshService.property.test.ts`
    - For arbitrary non-success HTTP status codes, verify refresh rejects with an error

- [x] 6. Implement Axios Response Interceptor
  - [x] 6.1 Create `setupResponseInterceptor` function
    - Create `src/lib/auth/axiosInterceptor.ts`
    - Intercept 401 responses (excluding refresh endpoint)
    - If refresh token exists: call `refreshService.refreshToken()`, retry original request once with new token
    - If no refresh token or already retried: call `onAuthFailure()` (redirect to login)
    - While refresh in progress: queue subsequent 401 requests via `enqueueRequest`
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

  - [x] 6.2 Write property tests for 401 interceptor retry
    - **Property 7: 401 interceptor retry with new token**
    - **Validates: Requirements 2.1, 2.2**
    - Test file: `src/__tests__/auth/axiosInterceptor.property.test.ts`
    - For arbitrary API URLs (non-refresh), verify retry happens exactly once with new token

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement AuthService
  - [x] 8.1 Create AuthService coordinating login, logout, and session validation
    - Create `src/lib/auth/authService.ts`
    - Implement `login(email, password, rememberMe)`: call login API, create storage with correct preference, store tokens, set axios Authorization header
    - Implement `logout()`: cancel pending refresh, reject queued, clear tokens, clear Authorization header, redirect to login
    - Implement `validateSession()`: detect storage preference, get access token, validate expiry, refresh if expired, set header if valid
    - Implement `isAuthenticated()` and `getAccessToken()` convenience methods
    - Handle storage write failures by showing error and not proceeding to authenticated state
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 8.2 Write unit tests for AuthService
    - Test login flow stores tokens correctly
    - Test logout clears tokens and redirects
    - Test session validation with valid/expired/missing/malformed tokens
    - Test storage write failure shows error
    - Test logout during pending refresh cancels and rejects
    - _Requirements: 1.5, 4.4, 4.5, 5.4, 5.5_

- [x] 9. Add i18n keys and Login Page UI enhancement
  - [x] 9.1 Add i18n translation keys for all locales
    - Add `keepLoggedIn` key to PT locale file: "Manter logado"
    - Add `keepLoggedIn` key to ES locale file: "Mantener sesión"
    - Add `keepLoggedIn` key to EN locale file: "Keep logged in"
    - Add `loginError` key to PT locale file: "Não foi possível completar o login"
    - Add `loginError` key to ES locale file: "No se pudo completar el inicio de sesión"
    - Add `loginError` key to EN locale file: "Unable to complete login"
    - _Requirements: 3.2_

  - [x] 9.2 Add "Remember me" checkbox to Login Page
    - Modify `src/pages/public/login/index.tsx`
    - Add `rememberMe` field to `react-hook-form` schema, default to `false`
    - Add accessible checkbox with i18n label (`keepLoggedIn`) associated via `htmlFor`/`id`
    - Replace direct `LoginUser` + `localStorage.setItem("token", ...)` with `AuthService.login(email, password, rememberMe)`
    - Show i18n error toast (`loginError`) on storage write failure
    - _Requirements: 3.1, 3.2, 3.5, 1.5_

- [x] 10. Wire session validation into application load
  - [x] 10.1 Integrate AuthService into `_app.tsx`
    - Modify `src/pages/_app.tsx`
    - On app mount, call `AuthService.validateSession()`
    - If session valid: set Authorization header and proceed
    - If session invalid/missing: redirect to login page
    - Call `setupResponseInterceptor` on the existing axiosClient instance with `onAuthFailure` redirecting to login
    - Ensure validation completes within 3 seconds (timeout fallback to redirect)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 2.1_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using `fast-check` (already in devDependencies)
- Unit tests validate specific examples and edge cases
- All code is TypeScript, consistent with existing project conventions
- The project uses `jest` as test runner with `ts-jest` for TypeScript support

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "3.2"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "5.4", "6.1"] },
    { "id": 5, "tasks": ["6.2", "8.1"] },
    { "id": 6, "tasks": ["8.2", "9.1"] },
    { "id": 7, "tasks": ["9.2", "10.1"] }
  ]
}
```
