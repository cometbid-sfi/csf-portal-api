# Authentication API Documentation

## Overview

This documentation covers the core authentication endpoints for user sign-in, sign-out, and token refresh operations. All endpoints implement comprehensive security measures including rate limiting, idempotency, and consistent timing protection.

## Base URL

```
https://api.yourapp.com/v1/auth
```

## Common Headers

```http
Content-Type: application/json
Accept: application/json
User-Agent: YourApp/1.0
X-Correlation-ID: <optional-correlation-id>
```

---

## 1. Sign In

Authenticate users with email and password credentials.

### Endpoint

```http
POST /sign-in
```

### Authentication

**Not Required** - This is the authentication endpoint

### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "staySignedIn": false
}
```

### Request Examples

**Basic Sign-In (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/sign-in" \
  -H "Content-Type: application/json" \
  -H "User-Agent: WebApp/1.0" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "staySignedIn": false
  }'
```

**Stay Signed In (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/sign-in" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: req-12345" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "staySignedIn": true
  }'
```

**Postman Setup:**

```
Method: POST
URL: https://api.yourapp.com/v1/auth/sign-in
Headers:
  - Content-Type: application/json
  - User-Agent: Postman/10.0
  - X-Correlation-ID: req-12345

Body (raw/JSON):
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "staySignedIn": false
}
```

### Response Examples

**Success (200) - Complete Authentication:**

```json
{
  "code": "SIGNIN_SUCCESS",
  "message": "Sign-in successful",
  "userSessionId": "sess_abc123",
  "tokens": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi...",
    "idToken": "eyJhbGciOiJSUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "user": {
    "email": "u***@example.com",
    "emailVerified": true,
    "mfaEnabled": false
  },
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Success (200) - MFA Required:**

```json
{
  "code": "MFA_REQUIRED",
  "message": "MFA verification required",
  "mfaSession": {
    "sessionId": "mfa_sess_456",
    "expiresAt": "2024-01-01T13:00:00Z"
  },
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Error (401) - Invalid Credentials:**

```json
{
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS",
  "remainingAttempts": 4,
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Error (423) - Account Locked:**

```json
{
  "message": "Account is locked due to too many failed attempts. Please try again after 2024-01-01T14:00:00Z.",
  "code": "ACCOUNT_LOCKED",
  "cooldownEndTime": "1704117600000",
  "remainingAttempts": "0",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Error (403) - Email Not Verified:**

```json
{
  "message": "Email address not verified",
  "code": "EMAIL_NOT_VERIFIED",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

---

## 2. Sign Out

Sign out users and invalidate their tokens.

### Endpoint

```http
POST /sign-out
```

### Authentication

**Optional** - Access token can be provided for additional security

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `globalSignout` | boolean | No | Sign out from all devices |
| `user-session-id` | string | No | User session identifier |


### Request Body

```json
{
  "email": "user@example.com",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi...",
  "globalSignout": false
}
```


### Request Examples

**Basic Sign-Out (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/sign-out" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  -d '{
    "email": "user@example.com",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi..."
  }'
```

**Global Sign-Out (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/sign-out?globalSignout=true&user-session-id=sess_abc123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  -d '{
    "email": "user@example.com",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi...",
    "globalSignout": true
  }'
```

**Sign-Out with Cookie (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/sign-out" \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=eyJjdHkiOiJKV1QiLCJlbmMi..." \
  -d '{
    "email": "user@example.com"
  }'
```

**Postman Setup:**

```
Method: POST
URL: https://api.yourapp.com/v1/auth/sign-out?globalSignout=false&user-session-id=sess_abc123
Headers:
  - Content-Type: application/json
  - Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
  - User-Agent: Postman/10.0
Body (raw/JSON):
{
  "email": "user@example.com",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi...",
  "globalSignout": false
}
```

### Response Examples

**Success (200) - Local Sign-Out:**

```json
{
  "code": "SIGNOUT_SUCCESS",
  "message": "Sign-out successful",
  "globalSignout": false,
  "userSessionId": "sess_abc123",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Success (200) - Global Sign-Out:**

```json
{
  "code": "SIGNOUT_SUCCESS",
  "message": "Sign-out successful",
  "globalSignout": true,
  "userSessionId": "sess_abc123",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Error (400) - Invalid Refresh Token:**

```json
{
  "message": "Invalid refresh token format",
  "code": "INVALID_REFRESH_TOKEN",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

---

## 3. Refresh Token

Refresh access tokens using a valid refresh token.

### Endpoint

```http
POST /refresh-token
```

### Authentication

**Not Required** - Uses refresh token for authentication

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user-session-id` | string | Yes | User session identifier |

### Request Body

```json
{
  "email": "user@example.com",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi..."
}
```

### Request Examples

**Basic Token Refresh (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/refresh-token?user-session-id=sess_abc123" \
  -H "Content-Type: application/json" \
  -H "User-Agent: WebApp/1.0" \
  -d '{
    "email": "user@example.com",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi..."
  }'
```

**Token Refresh with Cookie (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/refresh-token?user-session-id=sess_abc123" \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=eyJjdHkiOiJKV1QiLCJlbmMi..." \
  -d '{
    "email": "user@example.com"
  }'
```

**Token Refresh with Header (cURL):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/refresh-token?user-session-id=sess_abc123" \
  -H "Content-Type: application/json" \
  -H "X-Refresh-Token: eyJjdHkiOiJKV1QiLCJlbmMi..." \
  -d '{
    "email": "user@example.com"
  }'
```

**Postman Setup:**

```
Method: POST
URL: https://api.yourapp.com/v1/auth/refresh-token?user-session-id=sess_abc123
Headers:
  - Content-Type: application/json
  - User-Agent: Postman/10.0
  - X-Correlation-ID: req-12345
Body (raw/JSON):
{
  "email": "user@example.com",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi..."
}
```

### Response Examples

**Success (200):**

```json
{
  "code": "REFRESH_TOKEN_SUCCESS",
  "message": "Token refreshed successfully",
  "userSessionId": "sess_abc123",
  "tokens": {
    "accessToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi...",
    "idToken": "eyJhbGciOiJSUzI1NiIs...",
    "tokenType": "Bearer",
    "expiresIn": 3600
  },
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Error (401) - Invalid Refresh Token:**

```json
{
  "message": "Invalid or expired refresh token",
  "code": "INVALID_REFRESH_TOKEN",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

**Error (403) - Token Ownership Mismatch:**

```json
{
  "message": "Refresh token does not belong to this user",
  "code": "TOKEN_OWNERSHIP_MISMATCH",
  "timestamp": 1704110400000,
  "correlationId": "req-12345"
}
```

---

## Authentication Flow Examples

### Complete Authentication Flow

**1. Initial Sign-In:**

```bash
# Step 1: Sign in with credentials
curl -X POST "https://api.yourapp.com/v1/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "staySignedIn": true
  }'

# Response: Tokens + userSessionId
```

**2. Using Access Token:**

```bash
# Step 2: Use access token for API calls
curl -X GET "https://api.yourapp.com/v1/user/profile" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  -H "X-User-Session-ID: sess_abc123"
```

**3. Token Refresh:**

```bash
# Step 3: Refresh tokens when access token expires
curl -X POST "https://api.yourapp.com/v1/auth/refresh-token?user-session-id=sess_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi..."
  }'
```

**4. Sign Out:**

```bash
# Step 4: Sign out when done
curl -X POST "https://api.yourapp.com/v1/auth/sign-out" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..." \
  -d '{
    "email": "user@example.com",
    "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMi..."
  }'
```

### MFA Authentication Flow

**1. Initial Sign-In (MFA Required):**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "staySignedIn": false
  }'

# Response: MFA_REQUIRED with sessionId
```

**2. Complete MFA Verification:**

```bash
curl -X POST "https://api.yourapp.com/v1/auth/mfa/verify-totp-code?sessionId=mfa_sess_456" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "totpCode": "123456",
    "password": "SecurePassword123!",
    "staySignedIn": false
  }'

# Response: Complete authentication with tokens
```

---

## Security Features

### Rate Limiting

All endpoints implement rate limiting:
- **Sign-In**: 10 attempts per 5 minutes per IP
- **Sign-Out**: 20 requests per minute per user
- **Refresh Token**: 30 requests per minute per user

### Idempotency

All endpoints support idempotency:
- **Sign-In**: 2-minute window
- **Sign-Out**: 5-minute window  
- **Refresh Token**: 5-minute window

### Token Security

- **Access Token**: Short-lived (1 hour), used for API authentication
- **Refresh Token**: Long-lived (30 days), used for token renewal
- **ID Token**: Contains user identity information
- **Secure Storage**: Tokens can be stored in HTTP-only cookies

### Account Protection

- **Account Lockout**: After 5 failed sign-in attempts
- **Email Verification**: Required before sign-in
- **Session Validation**: User sessions are validated and tracked
- **Device Tracking**: Device information captured for security

---

## Error Codes Reference

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `SIGNIN_SUCCESS` | Sign-in completed successfully | 200 |
| `MFA_REQUIRED` | MFA verification required | 200 |
| `SIGNOUT_SUCCESS` | Sign-out completed successfully | 200 |
| `REFRESH_TOKEN_SUCCESS` | Token refresh successful | 200 |
| `INVALID_CREDENTIALS` | Invalid email or password | 401 |
| `ACCOUNT_LOCKED` | Account locked due to failed attempts | 423 |
| `EMAIL_NOT_VERIFIED` | Email address not verified | 403 |
| `ACCOUNT_DISABLED` | User account is disabled | 403 |
| `INVALID_REFRESH_TOKEN` | Invalid or expired refresh token | 401 |
| `MISSING_REFRESH_TOKEN` | Refresh token not provided | 400 |
| `TOKEN_OWNERSHIP_MISMATCH` | Token doesn't belong to user | 403 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `VALIDATION_ERROR` | Request validation failed | 400 |

---

## Testing Scenarios

### Successful Authentication Test

```bash
# Test complete authentication flow
EMAIL="test@example.com"
PASSWORD="TestPassword123!"

# 1. Sign in
SIGNIN_RESPONSE=$(curl -s -X POST "https://api.yourapp.com/v1/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"staySignedIn\":true}")

# Extract tokens and session ID
ACCESS_TOKEN=$(echo $SIGNIN_RESPONSE | jq -r '.tokens.accessToken')
REFRESH_TOKEN=$(echo $SIGNIN_RESPONSE | jq -r '.tokens.refreshToken')
USER_SESSION_ID=$(echo $SIGNIN_RESPONSE | jq -r '.userSessionId')

# 2. Test API call with access token
curl -X GET "https://api.yourapp.com/v1/user/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "X-User-Session-ID: $USER_SESSION_ID"

# 3. Refresh tokens
curl -X POST "https://api.yourapp.com/v1/auth/refresh-token?user-session-id=$USER_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"refreshToken\":\"$REFRESH_TOKEN\"}"

# 4. Sign out
curl -X POST "https://api.yourapp.com/v1/auth/sign-out" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{\"email\":\"$EMAIL\",\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

### Error Handling Test

```bash
# Test invalid credentials
curl -X POST "https://api.yourapp.com/v1/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'

# Test invalid refresh token
curl -X POST "https://api.yourapp.com/v1/auth/refresh-token?user-session-id=invalid" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "refreshToken": "invalid_token"
  }'
```

### Rate Limiting Test

```bash
# Test rate limiting (should fail after multiple attempts)
for i in {1..15}; do
  curl -X POST "https://api.yourapp.com/v1/auth/sign-in" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "WrongPassword"
    }'
  echo "Attempt $i completed"
done
```

---

## Best Practices

### Client Implementation

1. **Store tokens securely** - Use HTTP-only cookies or secure storage
2. **Handle token expiration** - Implement automatic token refresh
3. **Implement proper error handling** - Handle all error scenarios
4. **Use HTTPS only** - Never send credentials over HTTP
5. **Implement logout** - Always provide sign-out functionality


### Security Considerations

1. **Validate all inputs** - Client-side and server-side validation
2. **Monitor failed attempts** - Track and alert on suspicious activity
3. **Use strong passwords** - Enforce password complexity requirements
4. **Enable MFA** - Require multi-factor authentication for sensitive accounts
5. **Regular token rotation** - Refresh tokens regularly


### Performance Optimization

1. **Cache tokens appropriately** - Balance security and performance
2. **Implement connection pooling** - Reuse HTTP connections
3. **Use compression** - Enable gzip compression for responses
4. **Monitor metrics** - Track authentication performance and errors