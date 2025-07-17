# MFA Lambda Functions Usage Documentation

## Overview

This documentation covers the usage of seven MFA-related Lambda functions that handle multi-factor authentication operations in the system.

## Table of Contents

1. [Generate Temporary Backup Code](#generate-temporary-backup-code)
2. [Verify Temporary Backup Code](#verify-temporary-backup-code)
3. [Reset Backup Codes](#reset-backup-codes)
4. [Verify Backup Code](#verify-backup-code)
5. [Verify TOTP Code](#verify-totp-code)
6. [Get MFA Status](#get-mfa-status)
7. [MFA Toggle](#mfa-toggle)
8. [Common Features](#common-features)
   - [Rate Limiting](#rate-limiting)
   - [Idempotency](#idempotency)
   - [Security Features](#security-features)
   - [Error Handling](#error-handling)
   - [Monitoring and Metrics](#monitoring-and-metrics)


## 1. Generate Temporary Backup Code

Endpoint: POST /v1/auth/mfa/generate-temp-backup-code

**Purpose**

Generates a temporary backup code for users who have lost access to their primary MFA device.

**Request Format**

Query Parameters:

    - sessionId (required): Valid MFA session ID

Headers:

    - Content-Type: application/json
    - X-Request-ID: [optional] Client-generated request identifier
    - User-Agent: Client application identifier

Body: None required

**Response Format**

Success (200):

```json
{
  "message": "Temporary backup code generated successfully",
  "code": "TEMP_BACKUP_CODE_SUCCESS",
  "sessionId": "session-id",
  "expiresAt": "2024-01-01T12:00:00Z",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: session-id
Content-Type: application/json


Error Responses:

 - 401: Invalid MFA session
 - 403: Account locked
 - 400: MFA not enabled or temp backup code already exists
 - 409: Concurrent modification
 - 429: Rate limit exceeded
 - 500: Service error

Use Cases

 1. Emergency Access: User loses primary MFA device
 2. Device Replacement: Temporary access while setting up new device
 3. Travel Scenarios: Backup access when primary device unavailable

Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/generate-temp-backup-code?sessionId=abc123" \
  -H "Content-Type: application/json"
```

Postman:

Method: POST
URL: https://api.example.com/v1/auth/mfa/generate-temp-backup-code?sessionId=abc123
Headers:
  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0


## 2. Verify Temporary Backup Code

Endpoint: POST /v1/auth/mfa/verify-temp-backup-code

**Purpose**

Verifies a temporary backup code and completes user authentication.

**Request Format**

Query Parameters:

 - sessionId (required): Valid MFA session ID

Headers:

  - Content-Type: application/json
  - X-Request-ID: [optional] Client-generated request identifier
  - User-Agent: Client application identifier

Body:

```json
{
  "email": "user@example.com",
  "tempBackupCode": "123456",
  "password": "user-password",
  "staySignedIn": false
}
```

Response Format

Success (200):

```json
{
  "message": "Sign-in successful",
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "idToken": "jwt-id-token",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: session-id
Content-Type: application/json

Error Responses:

 - 400: Invalid backup code, expired code, or validation error
 - 401: Invalid credentials or session
 - 429: Rate limit exceeded
 - 500: Service error

Use Cases

 1. Emergency Authentication: Complete login with temporary code
 2. Account Recovery: Regain access after device loss
 3. One-time Access: Single-use authentication for critical operations

Example Usage

cURL:

```json
curl -X POST "https://api.example.com/v1/auth/mfa/verify-temp-backup-code?sessionId=abc123" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: MobileApp/1.0" \
  -d '{
    "email": "user@example.com",
    "tempBackupCode": "123456",
    "password": "userpassword",
    "staySignedIn": false
  }'
```

Postman:

Method: POST
URL: https://api.example.com/v1/auth/mfa/verify-temp-backup-code?sessionId=abc123
Headers:
  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0
Body (raw/JSON):
{
  "email": "user@example.com",
  "tempBackupCode": "123456",
  "password": "userpassword",
  "staySignedIn": false
}


## 3. Reset Backup Codes

Endpoint: POST /v1/auth/mfa/reset-backup-codes

**Purpose**

Generates a new set of backup codes, invalidating all previous ones.

**Request Format**

Query Parameters:

 - userSessionId (required): Valid user session ID

Headers:

 - Content-Type: application/json
 - Authorization: Bearer {access-token}
 - X-Request-ID: [optional] Client-generated request identifier
 - User-Agent: Client application identifier

Body:

```json
{
  "email": "user@example.com"
}
```

Response Format

Success (200):

```json
{
  "message": "Backup codes reset successfully",
  "backupCodes": [
    "12345678",
    "87654321",
    "11223344",
    "44332211",
    "55667788"
  ],
  "userSessionId": "session-id",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-User-Session-ID: user-session-id
Content-Type: application/json

**Error Responses:**

 - 400: MFA not enabled or validation error
 - 401: Invalid access token
 - 403: Account locked or email mismatch
 - 429: Rate limit exceeded
 - 500: Service error

**Use Cases**

 1. Security Compromise: Reset codes after suspected breach
 2. Periodic Rotation: Regular security maintenance
 3. Code Exhaustion: Generate new codes when running low
 4. Device Migration: Fresh codes for new device setup


Example Usage

cURL:

```bash 
curl -X POST "https://api.example.com/v1/auth/mfa/reset-backup-codes?userSessionId=xyz789" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: WebApp/2.0" \
  -d '{"email": "user@example.com"}'
```

Postman:

Method: POST
URL: https://api.example.com/v1/auth/mfa/reset-backup-codes?userSessionId=xyz789
Headers:
  - Content-Type: application/json
  - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0
Body (raw/JSON):
{
  "email": "user@example.com"
}


## 4. Verify Backup Code

Endpoint: POST /v1/auth/mfa/verify-backup-code

**Purpose**

Verifies a standard backup code and completes user authentication.

**Request Format**

Query Parameters:

 - sessionId (required): Valid MFA session ID

Headers:

 - Content-Type: application/json
 - X-Request-ID: [optional] Client-generated request identifier
 - User-Agent: Client application identifier

Body:

```json
{
  "email": "user@example.com",
  "backupCode": "123456",
  "password": "user-password",
  "staySignedIn": false
}
```

Response Format

Success (200):

```json
{
  "message": "Sign-in successful",
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "idToken": "jwt-id-token",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: session-id
Content-Type: application/json
Cache-Control: no-store, private


Error Responses:

 - 400: Invalid backup code or validation error
 - 401: Invalid credentials or session
 - 429: Rate limit exceeded
 - 500: Service error


Use Cases

 1. Primary MFA Unavailable: Use when TOTP device is inaccessible
 2. Device Malfunction: Backup authentication method
 3. Travel Authentication: Use saved backup codes while traveling
 4. Emergency Access: Critical system access when primary MFA fails


Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/verify-backup-code?sessionId=abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "backupCode": "12345678",
    "password": "userpassword",
    "staySignedIn": false
  }'
```

Postman:

Method: POST
URL: https://api.example.com/v1/auth/mfa/verify-backup-code?sessionId=abc123
Headers:
  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0
Body (raw/JSON):
{
  "email": "user@example.com",
  "backupCode": "12345678",
  "password": "userpassword",
  "staySignedIn": false
}


## 5. Verify TOTP Code

Endpoint: POST /v1/auth/mfa/verify-totp-code


**Purpose**

Verifies a Time-based One-Time Password (TOTP) and completes user authentication.


**Request Format**

Query Parameters:

 - sessionId (required): Valid MFA session ID

Headers:

 - Content-Type: application/json
 - X-Request-ID: [optional] Client-generated request identifier
 - User-Agent: Client application identifier

Body:

```json
{
  "email": "user@example.com",
  "totpCode": "123456",
  "password": "user-password",
  "staySignedIn": false
}
```

**Response Format**

Success (200):

```json
{
  "message": "Sign-in successful",
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "idToken": "jwt-id-token",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-Session-ID: session-id
Content-Type: application/json
Cache-Control: no-store, private


Error Responses:

 - 400: Invalid TOTP code, expired code, or validation error
 - 401: Invalid credentials or session
 - 429: Rate limit exceeded
 - 500: Service error

**Use Cases**

 1. Standard MFA Login: Primary authentication method
 2. Secure Transactions: Additional verification for sensitive operations
 3. Administrative Access: Enhanced security for admin functions
 4. API Authentication: Programmatic access with MFA


Example Usage

cURL:

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/verify-totp-code?sessionId=abc123" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: MobileApp/1.0" \
  -d '{
    "email": "user@example.com",
    "totpCode": "123456",
    "password": "userpassword",
    "staySignedIn": false
  }'

```

Postman:

Method: POST
URL: https://api.example.com/v1/auth/mfa/verify-totp-code?sessionId=abc123
Headers:
  - Content-Type: application/json
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0
Body (raw/JSON):
{
  "email": "user@example.com",
  "totpCode": "123456",
  "password": "userpassword",
  "staySignedIn": false
}


## 6. Get MFA Status

Endpoint: GET /v1/auth/mfa/status

**Purpose**

Retrieves the current MFA configuration and status for a user.

**Request Format**

Query Parameters:

 - sessionId (required): Valid user session ID

Headers:

 - Authorization: Bearer {access-token}
 - X-Request-ID: [optional] Client-generated request identifier
 - User-Agent: Client application identifier


**Response Format**

Success (200):

```json
{
  "message": "MFA status retrieved successfully",
  "userSessionId": "session-id",
  "mfaStatus": {
    "mfaEnabled": true,
    "preferredMfaSetting": "SMS_MFA",
    "userMfaSettingList": ["SMS_MFA", "SOFTWARE_TOKEN_MFA"],
    "tempBackupCode": {
      "enabled": false,
      "expiresAt": null
    }
  },
  "deviceInfo": {
    "type": "desktop",
    "lastAccess": 1704110400000
  },
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-User-Session-ID: user-session-id
Content-Type: application/json


Error Responses:

 - 401: Invalid access token or session
 - 404: User not found
 - 429: Rate limit exceeded
 - 500: Service error

Use Cases

 1. Dashboard Display: Show MFA status in user settings
 2. Security Audit: Check MFA configuration compliance
 3. Conditional Logic: Determine required authentication steps
 4. User Onboarding: Guide users through MFA setup process

Example Usage

cURL:

```bash
curl -X GET "https://api.example.com/v1/auth/mfa/status?sessionId=xyz789" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

Postman:

Method: GET
URL: https://api.example.com/v1/auth/mfa/status?sessionId=xyz789
Headers:
  - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0


## 7. MFA Toggle

Endpoint: POST /v1/auth/mfa/toggle

**Purpose**

Enables or disables MFA for a user account.

**Request Format**

Query Parameters:

 - userSessionId (required): Valid user session ID

Headers:

 - Content-Type: application/json
 - Authorization: Bearer {access-token}
 - X-Request-ID: [optional] Client-generated request identifier
 - User-Agent: Client application identifier


Body for Enable:

```json
{
  "email": "user@example.com",
  "action": "ENABLE",
  "mfaType": "SOFTWARE_TOKEN_MFA",
  "deviceName": "My Authenticator App"
}

```

Body for Disable:

```json
{
  "email": "user@example.com",
  "action": "DISABLE",
  "mfaCode": "123456"
}
```

**Response Format**

Success - Enable (200):

```json
{
  "message": "MFA enabled successfully",
  "detailMessage": "MFA has been enabled for your account",
  "mfaResponse": {
    "secretCode": "base32-secret",
    "qrCodeUrl": "otpauth://totp/...",
    "backupCodes": ["12345678", "87654321"]
  },
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Success - Disable (200):

```json
{
  "message": "MFA disabled successfully",
  "detailMessage": "MFA has been disabled for your account",
  "userSessionId": "session-id",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}
```

Response Headers:

X-Correlation-ID: correlation-id
X-User-Session-ID: user-session-id
Content-Type: application/json


Error Responses:

 - 400: Invalid action, MFA code, or validation error
 - 401: Invalid access token
 - 403: Email mismatch or insufficient permissions
 - 429: Rate limit exceeded
 - 500: Service error

Use Cases

 1. Initial Setup: Enable MFA for new users
 2. Security Enhancement: Upgrade account security
 3. Compliance Requirements: Meet organizational security policies
 4. Account Recovery: Disable MFA during account recovery process
 5. Device Migration: Disable/re-enable during device changes


Example Usage

Enable MFA (cURL):

```json
curl -X POST "https://api.example.com/v1/auth/mfa/toggle?userSessionId=xyz789" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: WebApp/2.0" \
  -d '{
    "email": "user@example.com",
    "action": "ENABLE",
    "mfaType": "SOFTWARE_TOKEN_MFA",
    "deviceName": "My Phone"
  }'

```

Enable MFA (Postman):

Method: POST
URL: https://api.example.com/v1/auth/mfa/toggle?userSessionId=xyz789
Headers:
  - Content-Type: application/json
  - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0

Body (raw/JSON):
{
  "email": "user@example.com",
  "action": "ENABLE",
  "mfaType": "SOFTWARE_TOKEN_MFA",
  "deviceName": "My Phone"
}


Disable MFA (cURL):

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/toggle?userSessionId=xyz789" \
curl -X POST "https://api.example.com/v1/auth/mfa/toggle?userSessionId=xyz789" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "X-Request-ID: req-12345" \
  -H "User-Agent: WebApp/2.0" \
  -d '{
    "email": "user@example.com",
    "action": "DISABLE",
    "mfaCode": "123456"
  }'

```

Disable MFA (Postman):

Method: POST
URL: https://api.example.com/v1/auth/mfa/toggle?userSessionId=xyz789
Headers:
  - Content-Type: application/json
  - Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  - X-Request-ID: req-12345
  - User-Agent: Postman/10.0
Body (raw/JSON):
{
  "email": "user@example.com",
  "action": "DISABLE",
  "mfaCode": "123456"
}


## Common Features

**Rate Limiting**

All endpoints implement rate limiting to prevent abuse:

 - Generate Temp Backup Code: 5 requests per 15 minutes
 - Verify Operations: 10 attempts per 5 minutes
 - Reset Operations: 3 requests per hour
 - Status Check: 60 requests per minute
 - Toggle Operations: 5 requests per hour

When rate limit is exceeded, the API returns a 429 status code with a Retry-After header indicating when the client can retry.


Example rate limit exceeded response:

HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 300
X-Correlation-ID: correlation-id

{
  "message": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id",
  "retryAfter": 300
}


**Idempotency**

Most endpoints support idempotency to prevent duplicate operations:

 - Idempotency keys are generated server-side
 - Results are cached for specified time windows
 - Duplicate requests return cached responses


Example idempotent request/response:

# First request
POST /v1/auth/mfa/reset-backup-codes?userSessionId=xyz789
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{"email": "user@example.com"}

# Response (200 OK)
{
  "message": "Backup codes reset successfully",
  "backupCodes": ["12345678", "87654321", ...],
  "timestamp": 1704110400000
}

# Duplicate request within time window
POST /v1/auth/mfa/reset-backup-codes?userSessionId=xyz789
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{"email": "user@example.com"}

# Response (200 OK) - Same as first request
{
  "message": "Backup codes reset successfully",
  "backupCodes": ["12345678", "87654321", ...],
  "timestamp": 1704110400000
}

**Security Features**

 - Session Validation: All operations validate user sessions
 - Token Verification: Access tokens are verified for authenticity
 - Account Locking: Accounts are locked after repeated failures
 - Audit Logging: All operations are logged for security monitoring
 - Device Tracking: Device information is captured for security analysis


Example security headers in responses:

Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Cache-Control: no-store, private


**Error Handling**

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

Example error responses:

Invalid session:

HTTP/1.1 401 Unauthorized
Content-Type: application/json
X-Correlation-ID: correlation-id

{
  "message": "Invalid or expired session",
  "code": "INVALID_SESSION",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id"
}

Validation error:

HTTP/1.1 400 Bad Request
Content-Type: application/json
X-Correlation-ID: correlation-id

{
  "message": "Invalid request parameters",
  "code": "VALIDATION_ERROR",
  "timestamp": 1704110400000,
  "correlationId": "correlation-id",
  "details": "Email format is invalid"
}


## Monitoring and Metrics

All endpoints emit CloudWatch metrics for:

 - Success/failure rates
 - Response times
 - Error types
 - Usage patterns
 - Performance thresholds


 Example metrics:

 - _MFA.TempBackupCode.Generated_: Count of temporary backup codes generated
 - _MFA.BackupCode.Verified_: Count of successful backup code verifications
 - _MFA.TOTP.VerificationFailure_: Count of failed TOTP verifications
 - _MFA.Toggle.Enable.Latency_: Time taken to enable MFA
 - _MFA.Status.RequestCount_: Number of status check requests