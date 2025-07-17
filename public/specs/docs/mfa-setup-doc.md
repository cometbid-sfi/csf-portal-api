# MFA Endpoints API Documentation

## Overview

This documentation covers three MFA (Multi-Factor Authentication) endpoints for setting up, completing, and checking MFA status. All endpoints require proper authentication and session management.

## Base URL

https://api.example.com/v1/auth/mfa


Common Headers

All requests should include these headers:

Content-Type: application/json
Authorization: Bearer <access_token>
Accept: application/json
Accept-Encoding: gzip, deflate
User-Agent: YourApp/1.0
X-Correlation-ID: <optional-correlation-id>
X-Idempotency-Key: <optional-idempotency-key>


## 1. MFA Setup Endpoint

**POST /auth/mfa/setup**

Initiates MFA setup by generating a QR code for authenticator apps.

Query Parameters
 - userSessionId (required): User session ID from login
 - user-session-id (alternative): Alternative parameter name

Request Body

```json
{
  "email": "user@example.com",
  "mfaType": "GOOGLE_AUTHENTICATOR",
  "deviceName": "iPhone 12"
}
```

Supported MFA Types

  - GOOGLE_AUTHENTICATOR
  - MICROSOFT_AUTHENTICATOR
  - DUO_MOBILE
  - AUTHY
  - TWO_FA_AUTHENTICATOR
  - LASTPASS_AUTHENTICATOR


cURL Examples

Basic Setup Request

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/setup?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept-Encoding: gzip" \
  -d '{
    "email": "user@example.com",
    "mfaType": "GOOGLE_AUTHENTICATOR",
    "deviceName": "iPhone 12"
  }'
```

With Idempotency Key

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/setup?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "X-Idempotency-Key: setup-12345-67890" \
  -H "Accept-Encoding: gzip" \
  -d '{
    "email": "user@example.com",
    "mfaType": "MICROSOFT_AUTHENTICATOR",
    "deviceName": "Android Phone"
  }'
```

Postman Setup

1. Method: POST

2. URL: https://api.example.com/v1/auth/mfa/setup?userSessionId=550e8400-e29b-41d4-a716-446655440000

3. Headers:

Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept-Encoding: gzip
X-Idempotency-Key: setup-12345-67890

4. Body (raw JSON):

```json
{
  "email": "user@example.com",
  "mfaType": "GOOGLE_AUTHENTICATOR",
  "deviceName": "iPhone 12"
}
```

Success Response (200 OK)

```json
{
  "message": "MFA setup initiated successfully",
  "instructions": "Open Google Authenticator, tap + icon, and scan the QR code, then verify with the generated code.",
  "qrCodeUrl": "otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEA...",
  "code": "MFA_SETUP_INITIATED",
  "userSessionId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Error Responses

Missing Access Token (401 Unauthorized)

```json
{
  "message": "Missing access token",
  "code": "MISSING_ACCESS_TOKEN",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Invalid Session (401 Unauthorized)

```json
{
  "message": "Invalid user session",
  "code": "INVALID_USER_SESSION",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Email Mismatch (403 Forbidden)

```json
{
  "message": "Session email mismatch",
  "code": "SESSION_EMAIL_MISMATCH",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Rate Limit Exceeded (429 Too Many Requests)

```json
{
  "message": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

## 2. Complete MFA Setup Endpoint

**POST /auth/mfa/setup/complete**

Completes MFA setup by verifying the TOTP code and generating backup codes.

Query Parameters

  - userSessionId (required): User session ID from setup

Request Body

```json
{
  "email": "user@example.com",
  "code1": "123456",
  "deviceName": "iPhone 12"
}
```

cURL Examples

Basic Completion Request

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/complete-setup?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept-Encoding: gzip" \
  -d '{
    "email": "user@example.com",
    "code1": "123456",
    "deviceName": "iPhone 12"
  }'
```

With Idempotency Key

```bash
curl -X POST "https://api.example.com/v1/auth/mfa/complete-setup?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "X-Idempotency-Key: complete-12345-67890" \
  -H "Accept-Encoding: gzip" \
  -d '{
    "email": "user@example.com",
    "code1": "654321",
    "deviceName": "Android Phone"
  }'
```

Postman Setup

1. Method: PUT
2. URL: https://api.example.com/v1/auth/mfa?userSessionId=550e8400-e29b-41d4-a716-446655440000

3. Headers:

Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept-Encoding: gzip
X-Idempotency-Key: complete-12345-67890

4. Body (raw JSON):

```json
{
  "email": "user@example.com",
  "code1": "123456",
  "deviceName": "iPhone 12"
}
```

### Success Response (200 OK)

```json
{
  "message": "MFA setup completed successfully",
  "backupCodes": [
    "12345678",
    "87654321",
    "11223344",
    "44332211",
    "55667788",
    "88776655",
    "99001122",
    "22110099",
    "33445566",
    "66554433"
  ],
  "instructions": "Store these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.",
  "code": "MFA_SETUP_COMPLETED",
  "userSessionId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "profile": {
    "email": "user@example.com",
    "deviceName": "iPhone 12"
  }
}
```

Error Responses

Invalid TOTP Code (400 Bad Request)

```json
{
  "message": "Invalid TOTP code provided",
  "code": "MFA_INVALID_TOTP_CODE",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

MFA Setup Not Initiated (400 Bad Request)

```json
{
  "message": "MFA setup not initiated",
  "code": "MFA_SETUP_NOT_INITIATED",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

MFA Already Enabled (409 Conflict)

```json
{
  "message": "MFA is already enabled for this user",
  "code": "MFA_ALREADY_ENABLED",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Session Not Found (404 Not Found)

```json
{
  "message": "User session not found",
  "code": "USER_SESSION_NOT_FOUND",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

### 3. Get MFA Status Endpoint

GET /mfa/status
Retrieves the current MFA status for a user.

Query Parameters

  - userSessionId (required): User session ID


cURL Examples

Basic Status Request

```bash
curl -X GET "https://api.example.com/v1/auth/mfa/status?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json" \
  -H "Accept-Encoding: gzip"
  
```

With Idempotency Key

```bash
curl -X GET "https://api.example.com/v1/auth/mfa/status?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "X-Idempotency-Key: status-12345-67890" \
  -H "Accept: application/json" \
  -H "Accept-Encoding: gzip"

```

Postman Setup

1. Method: GET

2. URL: https://api.example.com/v1/auth/mfa/status?userSessionId=550e8400-e29b-41d4-a716-446655440000

3. Headers:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
Accept-Encoding: gzip
X-Idempotency-Key: status-12345-67890


## 4. Idempotency

All MFA endpoints support idempotency to prevent duplicate operations:

- **MFA Setup**: 15-minute idempotency window
- **Complete MFA Setup**: 10-minute idempotency window
- **MFA Status**: Not applicable (GET requests are naturally idempotent)

### Server-Generated Keys
If no `X-Idempotency-Key` is provided, the server automatically generates one for critical operations.

### Cached Responses
Within the idempotency window, identical requests return the same cached response instantly.

**Success Response (200 OK)**

MFA Enabled

```json
{
  "message": "MFA status retrieved successfully",
  "userSessionId": "550e8400-e29b-41d4-a716-446655440000",
  "mfaStatus": {
    "mfaEnabled": true,
    "mfaType": "SOFTWARE_TOKEN_MFA",
    "backupCodesRemaining": 8,
    "lastMfaActivity": 1703120000000,
    "setupDate": "2023-12-20T10:30:00.000Z"
  },
  "deviceInfo": {
    "type": "mobile",
    "lastAccess": 1703123456789
  },
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

MFA Disabled

```json
{
  "message": "MFA status retrieved successfully",
  "userSessionId": "550e8400-e29b-41d4-a716-446655440000",
  "mfaStatus": {
    "mfaEnabled": false,
    "mfaType": null,
    "backupCodesRemaining": null,
    "lastMfaActivity": null,
    "setupDate": null
  },
  "deviceInfo": {
    "type": "desktop",
    "lastAccess": 1703123456789
  },
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Error Responses

User Not Found (404 Not Found)

```json
{
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Invalid Session (401 Unauthorized)

```json
{
  "message": "Invalid user session",
  "code": "INVALID_USER_SESSION",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

## 5. Enhanced Error Responses

Add new validation errors:

### Request Size Exceeded (413 Payload Too Large)

```json
{
  "message": "Request body too large",
  "code": "REQUEST_TOO_LARGE", 
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Invalid Content Type (415 Unsupported Media Type)

```json
{
  "message": "Unsupported content type",
  "code": "UNSUPPORTED_CONTENT_TYPE",
  "timestamp": 1703123456789, 
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

### **6. Update Performance Section**
Add performance benefits:

```markdown
## Performance Optimizations

### Caching
- **MFA Setup**: Results cached for 15 minutes
- **Token Validation**: Cached for 5 minutes  
- **MFA Status**: Cached for 5 minutes

### Idempotency Benefits
- **Setup Retry**: ~5ms vs ~800ms for duplicate requests
- **Complete Retry**: ~5ms vs ~1200ms for duplicate requests
- **Prevents Resource Waste**: Avoids duplicate QR code generation and Cognito calls


### Common Response Headers

All successful responses include these headers:

Content-Type: application/json; charset=utf-8
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-User-Session-ID: 550e8400-e29b-41d4-a716-446655440000
Cache-Control: no-cache, no-store, must-revalidate
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block


### Compression Support

**Client Request**

Include compression support in requests:

Accept-Encoding: gzip, deflate


**Server Response**

When compression is applied:

Content-Encoding: gzip
isBase64Encoded: true


**cURL with Compression**

```bash
curl -X GET "https://api.example.com/v1/auth/mfa/status?userSessionId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept-Encoding: gzip, deflate" \
  --compressed

```

### Error Handling

Common HTTP Status Codes

   - 200 OK: Request successful
   - 400 Bad Request: Invalid request parameters or body
   - 401 Unauthorized: Missing or invalid authentication
   - 403 Forbidden: Access denied (e.g., email mismatch)
   - 404 Not Found: Resource not found
   - 409 Conflict: Resource already exists or conflicting state
   - 429 Too Many Requests: Rate limit exceeded
   - 500 Internal Server Error: Server error

Error Response Format

```json
{
  "message": "Human-readable error message",
  "code": "ERROR_CODE_CONSTANT",
  "timestamp": 1703123456789,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

### Rate Limiting

All endpoints are rate-limited:

  - Setup: 5 requests per minute per user
  - Complete: 10 requests per minute per user
  - Status: 20 requests per minute per user

Rate limit headers in responses:

X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1703123516


### Security Considerations

1. **HTTPS Only:** All requests must use HTTPS
2. **Token Expiry:** Access tokens expire and must be refreshed
3. **Session Management:** User sessions have limited lifetime
4. **Idempotency:** Use idempotency keys for critical operations
5. **CORS:** Proper CORS headers are set for browser requests


### Enhanced Security Features

1. **Request Validation**: Size limits prevent DoS attacks
2. **Content-Type Enforcement**: Only JSON accepted for POST requests
3. **Method Validation**: Only allowed HTTP methods accepted
4. **Idempotency Protection**: Prevents duplicate critical operations
5. **Transaction Safety**: Rollback mechanisms for failed operations



### 1. Request Size Validation

Add to the "Common Headers" section:

## Request Size Limits

All endpoints enforce request size validation:
- MFA Setup: Maximum 2KB request body
- Complete MFA Setup: Maximum 4KB request body  
- MFA Status: Maximum 1KB request body (GET requests)

Requests exceeding these limits will return a 413 Payload Too Large error.


### Complete MFA Setup Flow

Step 1: Initiate Setup

```bash
# Request MFA setup
curl -X POST "https://api.example.com/v1/auth/mfa/setup?userSessionId=SESSION_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"email":"user@example.com","mfaType":"GOOGLE_AUTHENTICATOR"}'

```

Step 2: Scan QR Code 

  - Use the qrCode or qrCodeUrl from the setup response
  - Scan with your authenticator app
  - Generate a TOTP code


Step 3: Complete Setup

```bash
# Complete MFA setup with TOTP code
curl -X POST "https://api.example.com/v1/auth/mfa/complete-setup?userSessionId=SESSION_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"email":"user@example.com","code1":"123456"}'

```

Step 4: Verify Status

```bash
# Check MFA status
curl -X GET "https://api.example.com/v1/auth/mfa/status?userSessionId=SESSION_ID" \
  -H "Authorization: Bearer ACCESS_TOKEN"

```

### Troubleshooting

Common Issues

1. Invalid TOTP Code: Ensure device time is synchronized
2. Session Expired: Refresh your session or re-authenticate
3. Rate Limiting: Wait before retrying requests
4. Email Mismatch: Ensure email in request matches token
5. Missing Headers: Include all required headers


**Support Information**

For additional support, include the correlationId from error responses when contacting support.