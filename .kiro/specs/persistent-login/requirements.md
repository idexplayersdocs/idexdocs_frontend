# Requirements Document

## Introduction

This feature adds persistent login capabilities to the IdexDocs frontend application. Currently, users are authenticated via a JWT access token stored in localStorage, but there is no mechanism to automatically refresh expired tokens or keep users logged in across browser sessions. This feature introduces refresh token handling, automatic token renewal, and a "remember me" option so users are not forced to re-enter credentials every time their access token expires or they reopen the browser.

## Glossary

- **Auth_Module**: The frontend authentication module responsible for login, token storage, token refresh, and session management.
- **Access_Token**: A short-lived JWT token used to authenticate API requests.
- **Refresh_Token**: A long-lived token used to obtain a new Access_Token without requiring the user to re-enter credentials.
- **Token_Storage**: The browser storage mechanism (localStorage or sessionStorage) where tokens are persisted.
- **Session**: The period during which a user remains authenticated in the application.
- **Axios_Client**: The centralized HTTP client (axios instance) used for all API communication.
- **Login_Page**: The public login page at `/public/login` where users enter credentials.

## Requirements

### Requirement 1: Refresh Token Storage on Login

**User Story:** As a user, I want the system to store a refresh token when I log in, so that my session can be renewed without re-entering my credentials.

#### Acceptance Criteria

1. WHEN the Auth_Module receives a successful login response containing a refresh token, THE Auth_Module SHALL store the Refresh_Token in Token_Storage within 1 second of receiving the response.
2. WHEN the Auth_Module receives a successful login response, THE Auth_Module SHALL store the Access_Token in Token_Storage within 1 second of receiving the response.
3. IF the login response does not contain a refresh token, THEN THE Auth_Module SHALL store only the Access_Token and SHALL NOT attempt automatic token renewal when the Access_Token expires.
4. IF the login response contains an empty or whitespace-only token value, THEN THE Auth_Module SHALL treat it as absent and SHALL NOT store it in Token_Storage.
5. IF the Auth_Module fails to write tokens to Token_Storage, THEN THE Auth_Module SHALL display an error message indicating that login cannot be completed and SHALL NOT proceed to an authenticated state.

### Requirement 2: Automatic Token Refresh

**User Story:** As a user, I want my session to be automatically renewed before my access token expires, so that I can use the application without interruption.

#### Acceptance Criteria

1. WHEN the Axios_Client receives a 401 Unauthorized response from any API endpoint other than the token refresh endpoint, THE Auth_Module SHALL attempt to obtain a new Access_Token using the stored Refresh_Token.
2. WHEN the Auth_Module successfully obtains a new Access_Token, THE Auth_Module SHALL retry the original failed request exactly once with the new Access_Token.
3. WHEN the Auth_Module successfully obtains a new Access_Token, THE Auth_Module SHALL update the stored Access_Token in Token_Storage.
4. IF the refresh token request fails due to an expired Refresh_Token, an invalid Refresh_Token, or a network error, THEN THE Auth_Module SHALL clear all stored tokens and redirect the user to the Login_Page.
5. WHILE a token refresh request is in progress, THE Auth_Module SHALL queue subsequent API requests that receive a 401 response and resolve them with the new Access_Token after the refresh completes successfully.
6. IF no Refresh_Token exists in Token_Storage when a 401 response is received, THEN THE Auth_Module SHALL redirect the user to the Login_Page without attempting a refresh.

### Requirement 3: Remember Me Option

**User Story:** As a user, I want to choose whether my login persists across browser sessions, so that I can control my security preferences.

#### Acceptance Criteria

1. THE Login_Page SHALL display a "Remember me" checkbox option with an accessible label associated to the checkbox input.
2. THE Login_Page SHALL display the checkbox label text according to the application's active locale: "Manter logado" for Portuguese, "Mantener sesión" for Spanish, and "Keep logged in" for English.
3. WHEN the user checks "Remember me" and logs in successfully, THE Auth_Module SHALL store the Access_Token and Refresh_Token in localStorage and SHALL persist the storage preference so that subsequent token refresh operations use the same storage mechanism.
4. WHEN the user does not check "Remember me" and logs in successfully, THE Auth_Module SHALL store the Access_Token and Refresh_Token in sessionStorage and SHALL persist the storage preference so that subsequent token refresh operations use the same storage mechanism.
5. THE Login_Page SHALL default the "Remember me" checkbox to unchecked.
6. WHEN the application loads, THE Auth_Module SHALL check both localStorage and sessionStorage to locate existing tokens for session validation.

### Requirement 4: Session Validation on Application Load

**User Story:** As a user, I want the application to validate my session when I return to the site, so that I am seamlessly authenticated if my session is still valid.

#### Acceptance Criteria

1. WHEN the application loads and a stored Access_Token exists, THE Auth_Module SHALL decode the Access_Token and check its expiration time within 3 seconds of page load.
2. WHEN the stored Access_Token is expired and a Refresh_Token exists, THE Auth_Module SHALL attempt to refresh the Access_Token and, upon success, store the new Access_Token in Token_Storage, set the Authorization header on the Axios_Client, and allow the user to proceed to the requested route without redirecting to the Login_Page.
3. WHEN the stored Access_Token is valid (not expired), THE Auth_Module SHALL set the Authorization header on the Axios_Client with the Access_Token and allow the user to proceed to the requested route.
4. IF no tokens are found in Token_Storage, THEN THE Auth_Module SHALL redirect the user to the Login_Page.
5. IF the stored Access_Token cannot be decoded (malformed or corrupted), THEN THE Auth_Module SHALL clear all stored tokens from Token_Storage and redirect the user to the Login_Page.
6. IF the Access_Token is expired and the refresh attempt fails, THEN THE Auth_Module SHALL clear all stored tokens from Token_Storage and redirect the user to the Login_Page.

### Requirement 5: Secure Logout

**User Story:** As a user, I want to log out and have all my session data removed, so that my account is protected on shared devices.

#### Acceptance Criteria

1. WHEN the user triggers a logout action, THE Auth_Module SHALL remove the Access_Token from Token_Storage.
2. WHEN the user triggers a logout action, THE Auth_Module SHALL remove the Refresh_Token from Token_Storage.
3. WHEN the user triggers a logout action, THE Auth_Module SHALL clear the Authorization header from the Axios_Client and then redirect the user to the Login_Page.
4. IF a token refresh request is in progress when the user triggers a logout action, THEN THE Auth_Module SHALL cancel the pending refresh request, reject all queued requests, and proceed with the logout sequence.
5. IF clearing Token_Storage fails during logout, THEN THE Auth_Module SHALL still clear the Authorization header from the Axios_Client and redirect the user to the Login_Page.

### Requirement 6: Concurrent Request Handling During Refresh

**User Story:** As a user, I want all my pending requests to succeed after a token refresh, so that I don't experience data loss or errors during session renewal.

#### Acceptance Criteria

1. WHILE a token refresh is in progress, THE Auth_Module SHALL prevent additional refresh token requests from being sent (only one refresh request at a time).
2. WHEN the token refresh completes successfully, THE Auth_Module SHALL resolve all queued requests with the new Access_Token.
3. IF the token refresh fails, THEN THE Auth_Module SHALL reject all queued requests and redirect the user to the Login_Page.

### Requirement 7: Token Refresh API Integration

**User Story:** As a developer, I want a dedicated service function to call the refresh token endpoint, so that token renewal logic is centralized and reusable.

#### Acceptance Criteria

1. THE Auth_Module SHALL provide a function that sends the Refresh_Token to the backend refresh endpoint and returns the new Access_Token to the caller upon a successful response.
2. WHEN the refresh endpoint returns a new Refresh_Token alongside the Access_Token, THE Auth_Module SHALL update the stored Refresh_Token in Token_Storage.
3. THE Auth_Module SHALL send the refresh request using a separate Axios instance (or equivalent mechanism) that does not include the Access_Token in the Authorization header, to avoid circular 401 errors.
4. IF the refresh endpoint returns a non-success HTTP response or the request fails due to a network error, THEN THE Auth_Module SHALL reject the call (throw an error) so that the caller can handle the failure (e.g., clear tokens and redirect to Login_Page).
5. THE Auth_Module SHALL apply a timeout of no more than 10 seconds to the refresh request, treating a timeout as a failed refresh attempt.
