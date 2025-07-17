# Password Management API Documentation

## Overview

This documentation covers the password management endpoints for user authentication and password reset functionality. All endpoints require proper authentication and follow security best practices.

## Base URL

https://api.yourapp.com/v1/auth/password

## Common Headers

Content-Type: application/json
Authorization: Bearer <access_token>  # Required for change-password only


## Table of Contents

1. [Change Password](#change-password)
2. [Forgot Password](#forgot-password)
3. [Verify Reset Code](#verify-reset-code)
4. [Resend Reset Code](#resend-reset-code)
5. [Confirm Password Reset](#confirm-password-reset)
6. [Common Features](#common-features)
   - [Password Requirements](#password-requirements)
   - [Rate Limiting](#rate-limiting)
   - [Idempotency](#idempotency)
   - [Security Features](#security-features)
   - [Error Handling](#error-handling)
   - [Monitoring and Metrics](#monitoring-and-metrics)


## 1. Change Password

Endpoint: 

POST /v1/auth/password/change-password


**Purpose**

Changes the password for an authenticated user with current password verification.


**Request Format**

Query Parameters:

  - user-session-id (required): Valid user session ID

Headers:

  - Content-Type: application/json
  - Authorization: Bearer {access-token}
  - X-Request-ID: [optional] Client-generated request identifier
  - User-Agent: Client application identifier


Request Body:

```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```

Response Format

Success (200):

```json
{
  "message": "Password changed successfully",
  "code": "CHANGE_PASSWORD_SUCCESS",
  "userSessionId": "session-id",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-User-Session-ID: user-session-id
Content-Type: application/json
Cache-Control: no-store, private

Error Responses:

  - 400: Same password as current, validation error
  - 401: Invalid current password, invalid access token
  - 403: Account disabled or locked
  - 429: Rate limit exceeded
  - 500: Service error

Use Cases
  1. Security Update: Regular password changes for security
  2. Compliance: Meeting organizational password policies
  3. Compromise Response: Changing password after suspected breach
  4. User Preference: User-initiated password updates


Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/password/change-password?user-session-id=sess_123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: WebApp/2.0" \
  -d '{
    "currentPassword": "CurrentPassword123!",
    "newPassword": "NewSecurePassword456!"
  }'
```

**Postman:**

Method: POST

URL: https://api.example.com/v1/auth/password/change-password?user-session-id=sess_123


Headers:

  - Content-Type: application/json
  - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0 Body (raw/JSON): { "currentPassword": "CurrentPassword123!", "newPassword": "NewSecurePassword456!" }

```json
 {
    "currentPassword": "CurrentPassword123!",
    "newPassword": "NewSecurePassword456!"
  }
```

Response

Success (200)

```json
{
  "message": "Password changed successfully",
  "code": "CHANGE_PASSWORD_SUCCESS",
  "userSessionId": "sess_123",
  "timestamp": 1640995200000,
  "correlationId": "req_abc123"
}
```

Error (401) - Invalid Current Password

```json
{
  "message": "Current password is incorrect",
  "code": "INCORRECT_PASSWORD",
  "remainingAttempts": 4,
  "timestamp": 1640995200000,
  "correlationId": "req_abc123"
}
```

## 2. Forgot Password

Endpoint: 

POST /v1/auth/password/forgot-password


**Purpose**

Initiates password reset process by sending a reset code to user's email.

**Request Format**

Query Parameters:

  - session-id (optional): Existing session ID if available

Headers:

  - Content-Type: application/json
  - X-Request-ID: [optional] Client-generated request identifier
  - User-Agent: Client application identifier


Request Body:

```json
{
  "email": "user@example.com"
}
```

Response Format

Success (200):

```json
{
  "message": "Password reset code sent successfully",
  "sessionId": "reset_sess_456",
  "expiresIn": 1800,
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Error (429) - Rate Limited

```json
{
  "message": "Password reset already requested. Please check your email or try again in 45 minutes.",
  "sessionId": "reset_sess_456",
  "retryAfterMinutes": 45,
  "timestamp": 1640995200000,
  "correlationId": "req_def456",
  "cached": true
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: reset_sess_456
Content-Type: application/json

Error Responses:

  - 403: Email not verified, account disabled, account recovery required
  - 404: User not found
  - 429: Rate limit exceeded (1 request per hour)
  - 500: Service error

Use Cases

  1. Password Recovery: User forgot their password
  2. Account Access: Regaining access to locked account
  3. Security Reset: Proactive password reset for security
  4. Device Loss: Reset after losing access to MFA device


Example Usage

cURL: 

```bash
curl -X POST "https://api.example.com/v1/auth/password/forgot-password" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: MobileApp/1.0" \
  -d '{
    "email": "user@example.com"
  }'
```

With existing session:

```bash
curl -X POST "https://api.example.com/v1/auth/password/forgot-password?session-id=existing_sess_789" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: MobileApp/1.0" \
  -d '{
    "email": "user@example.com"
  }'
```

Postman:

Method: POST

URL: https://api.example.com/v1/auth/password/forgot-password

Headers:

  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0 Body (raw/JSON): { "email": "mailto:user@example.com" }


## 3. Verify Reset Code

Endpoint: 

POST /v1/auth/password/verify-reset-code


**Purpose**

Verifies the password reset code received via email and marks session as verified.


**Request Format**

Query Parameters:

  - session-id (required): Reset session ID from forgot-password

Headers:

  - ontent-Type: application/json
  - X-Request-ID: [optional] Client-generated request identifier
  - User-Agent: Client application identifier


Request Body:

```json
{
  "code": "123456"
}
```

Response Format

Success (200):

```json
{
  "message": "Reset code verified successfully",
  "email": "u***@example.com",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Error (400) - Invalid Code

```json
{
  "message": "Invalid verification code",
  "code": "INVALID_VERIFICATION_CODE",
  "remainingAttempts": "2",
  "correlationId": "req_ghi789",
  "timestamp": 1640995200000
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: reset_sess_456
Content-Type: application/json


Error Responses:

  - 400: Invalid code, expired session, already verified
  - 404: Session not found
  - 429: Rate limit exceeded (5 attempts per session)
  - 500: Service error

Use Cases

  1. Code Verification: Verify reset code from email
  2. Security Check: Confirm user has access to email
  3. Reset Authorization: Authorize password reset process
  4. Multi-step Authentication: Part of secure reset flow

Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/password/verify-reset-code?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: WebApp/2.0" \
  -d '{
    "code": "123456"
  }'
```

Postman:

Method: POST

URL: https://api.example.com/v1/auth/password/verify-reset-code?session-id=reset_sess_456

Headers:

  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0 Body (raw/JSON): { "code": "123456" }


## 4. Resend Reset Code

Endpoint: 

POST /v1/auth/password/resend-reset-code

**Purpose**

Resends password reset code to user's email using existing session.

**Request Format**

Query Parameters:

  - session-id (required): Reset session ID

Headers:

  - Content-Type: application/json
  - X-Request-ID: [optional] Client-generated request identifier
  - User-Agent: Client application identifier

Request Body:

```json
{
  "email": "user@example.com"
}
```

Response Format

Success (200):

```json
{
  "message": "Reset code sent successfully",
  "sessionId": "reset_sess_456",
  "expiresIn": 1650,
  "remainingAttempts": 4,
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: reset_sess_456
Content-Type: application/json

Error Responses:

  - 400: Invalid session, already verified, expired session
  - 404: User not found, session not found
  - 429: Rate limit exceeded (follows forgot-password limits)
  - 500: Service error

Use Cases

  1. Code Not Received: User didn't receive original code
  2. Code Expired: Original code expired before use
  3. Email Issues: Resend due to email delivery problems
  4. User Request: User-initiated code resend

Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/password/resend-reset-code?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: MobileApp/1.0" \
  -d '{
    "email": "user@example.com"
  }'
```

Postman:

Method: POST

URL: https://api.example.com/v1/auth/password/resend-reset-code?session-id=reset_sess_456

Headers:

  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0 Body (raw/JSON): { "email": "mailto:user@example.com" }


## 5. Confirm Password Reset

Endpoint: 

POST /v1/auth/password/confirm-password-reset


**Purpose**

Completes password reset process with new password after code verification.

**Request Format**

Query Parameters:

  - session-id (required): Verified reset session ID

Headers:

  - Content-Type: application/json
  - X-Request-ID: [optional] Client-generated request identifier
  - User-Agent: Client application identifier


Request Body:

```json
{
  "email": "user@example.com",
  "newPassword": "NewSecurePassword789!"
}
```

Request Example

```bash
curl -X POST "https://api.yourapp.com/v1/auth/password/confirm-password-reset?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "newPassword": "NewSecurePassword789!"
  }'
```

Response Format

Success (200):

```json
{
  "message": "Password reset completed successfully",
  "email": "u***@example.com",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: reset_sess_456
Content-Type: application/json
Cache-Control: no-store, private

Error Responses:

  - 400: Invalid session, not verified, already completed, email mismatch
  - 404: Session not found
  - 429: Rate limit exceeded (3 attempts per session)
  - 500: Service error

Use Cases

  1. Password Reset: Complete the reset process
  2. Account Recovery: Regain access with new password
  3. Security Update: Set new secure password
  4. Final Step: Complete multi-step reset flow

Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/password/confirm-password-reset?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: WebApp/2.0" \
  -d '{
    "email": "user@example.com",
    "newPassword": "NewSecurePassword789!"
  }'
```

Postman:

Method: POST

URL: https://api.example.com/v1/auth/password/confirm-password-reset?session-id=reset_sess_456

Headers:

  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0 Body (raw/JSON): { "email": "mailto:user@example.com", "newPassword": "NewSecurePassword789!" }


### Common Features

Password Requirements

  - All new passwords must meet these security criteria:
  - Minimum 8 characters length
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)
  - Cannot be the same as current password
  - Cannot be a commonly used password
  - Cannot contain user's email or name


Example password validation error:

```json
{
  "message": "Password does not meet security requirements",
  "code": "VALIDATION_ERROR",
  "details": "Password must contain at least one uppercase letter",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

### Rate Limiting

All endpoints implement rate limiting to prevent abuse:

  - Change Password: 5 attempts per day per user
  - Forgot Password: 1 request per hour per email
  - Verify Reset Code: 5 attempts per session
  - Resend Reset Code: Follows forgot-password limits
  - Confirm Password Reset: 3 attempts per session

When rate limit is exceeded, the API returns a 429 status code with retry information.

Example rate limit exceeded response:

HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600
X-Correlation-ID: correlation-id

```json
{
  "message": "Password reset already requested. Please check your email or try again in 45 minutes.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfterMinutes": 45,
  "timestamp": 1704110400000,
  "correlationId": "correlation-id",
  "cached": true
}
```

Idempotency

Most endpoints support idempotency to prevent duplicate operations:

  - Change Password: 5-minute window for security
  - Forgot Password: 1-hour window to prevent spam
  - Verify Reset Code: Not applicable (verification is one-time)
  - Resend Reset Code: Follows forgot-password idempotency
  - Confirm Password Reset: 15-minute window


Example idempotent request/response:

### First request

POST /v1/auth/password/forgot-password
Content-Type: application/json

```json
{"email": "user@example.com"}
```

### Response (200 OK)

```json
{
  "message": "Password reset code sent successfully",
  "sessionId": "reset_sess_456",
  "expiresIn": 1800,
  "timestamp": 1704110400000
}
```

### Duplicate request within 1 hour

POST /v1/auth/password/forgot-password
Content-Type: application/json

```json
{"email": "user@example.com"}
```

### Response (429 Too Many Requests)

```json
{
  "message": "Password reset already requested. Please check your email or try again in 45 minutes.",
  "sessionId": "reset_sess_456",
  "retryAfterMinutes": 45,
  "timestamp": 1704110400000,
  "cached": true
}
```

Security Features

  - Session Validation: All operations validate user sessions
  - Token Verification: Access tokens are verified for authenticity
  - Email Verification: Only verified emails can reset passwords
  - Account Status Check: Disabled accounts cannot reset passwords
  - Audit Logging: All operations are logged for security monitoring
  - Device Tracking: Device information is captured for security analysis
  - Consistent Timing: Prevents timing attacks
  - Input Sanitization: All inputs are validated and sanitized


Example security headers in responses:

Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Cache-Control: no-store, private


Error Handling

Consistent error response format across all endpoints:

```json
{
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id",
  "details": "Additional error context (optional)"
}
```

Common error codes:

  - INCORRECT_PASSWORD: Current password is incorrect
  - INVALID_VERIFICATION_CODE: Reset code is invalid
  - RESET_PASSWORD_SESSION_EXPIRED: Reset session has expired
  - MAX_ATTEMPTS_EXCEEDED: Too many failed attempts
  - RATE_LIMIT_EXCEEDED: Rate limit exceeded
  - EMAIL_NOT_VERIFIED: Email address not verified
  - ACCOUNT_DISABLED: User account is disabled
  - SESSION_EMAIL_MISMATCH: Email doesn't match session
  - PASSWD_RESET_ALREADY_COMPLETED: Reset already completed


Example error responses:

Invalid current password:

HTTP/1.1 401 Unauthorized
Content-Type: application/json
X-Correlation-ID: correlation-id

```json
{
  "message": "Current password is incorrect",
  "code": "INCORRECT_PASSWORD",
  "remainingAttempts": 4,
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Session expired:

HTTP/1.1 400 Bad Request
Content-Type: application/json
X-Correlation-ID: correlation-id

```json
{
  "message": "Reset session has expired",
  "code": "RESET_PASSWORD_SESSION_EXPIRED",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

## Monitoring and Metrics

All endpoints emit CloudWatch metrics for:

  - Success/failure rates
  - Response times
  - Error types
  - Usage patterns
  - Security events

Example metrics:

  - Password.Change.Success: Count of successful password changes
  - Password.Reset.Initiated: Count of password reset requests
  - Password.Reset.Completed: Count of completed password resets
  - Password.Reset.CodeVerified: Count of verified reset codes
  - Password.Reset.CodeResent: Count of resent reset codes
  - Password.Change.Latency: Time taken to change password
  - Password.Reset.InvalidCode: Count of invalid reset codes
  - Password.Reset.SessionExpired: Count of expired reset sessions


## Password Reset Flow

Complete password reset process:

  1. Forgot Password → Creates reset session, sends code via email
  2. Verify Reset Code → Validates code, marks session as verified
  3. Confirm Password Reset → Completes reset with new password, invalidates session

Alternative: Resend Reset Code can be used between steps 1-2 if the user doesn't receive the code.


## Testing Scenarios

Successful Password Change:

### 1. Change password with valid credentials

```bash
curl -X POST "https://api.example.com/v1/auth/password/change-password?user-session-id=sess_123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid_token" \
  -d '{"currentPassword": "OldPass123!", "newPassword": "NewPass456!"}'
```

Complete Password Reset Flow:

### 1. Initiate reset

```bash
curl -X POST "https://api.example.com/v1/auth/password/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 2. Verify code (use sessionId from step 1)

```bash
curl -X POST "https://api.example.com/v1/auth/password/verify-reset-code?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'
```

### 3. Complete reset

```bash
curl -X POST "https://api.example.com/v1/auth/password/confirm-password-reset?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "newPassword": "NewSecurePass789!"}'
```

Error Testing:

### Test rate limiting

```bash
for i in {1..3}; do
  curl -X POST "https://api.example.com/v1/auth/password/forgot-password" \
    -H "Content-Type: application/json" \
    -d '{"email": "user@example.com"}'
done
```

### Test invalid code

```bash
curl -X POST "https://api.example.com/v1/auth/password/verify-reset-code?session-id=reset_sess_456" \
  -H "Content-Type: application/json" \
  -d '{"code": "000000"}'
```
