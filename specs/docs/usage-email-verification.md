# Email Verification API Documentation

This document provides detailed examples of how to use the Email Verification APIs, including requesting verification emails and verifying email addresses.

## Table of Contents

1. [Request Email Verification API](#request-email-verification-api)
   - [Endpoint](#request-email-verification-endpoint)
   - [Request Body](#request-email-verification-request-body)
   - [Query Parameters](#request-email-verification-query-parameters)
   - [cURL Example](#request-email-verification-curl-example)
   - [Postman Example](#request-email-verification-postman-example)
   - [Response](#request-email-verification-response)
   - [Error Responses](#request-email-verification-error-responses)

2. [Verify Email API](#verify-email-api)
   - [Endpoint](#verify-email-endpoint)
   - [Verification Methods](#verification-methods)
   - [Code Verification](#code-verification)
   - [Link Verification](#link-verification)
   - [cURL Examples](#verify-email-curl-examples)
   - [Postman Examples](#verify-email-postman-examples)
   - [Response](#verify-email-response)
   - [Error Responses](#verify-email-error-responses)

3. [CSRF Protection](#csrf-protection)
   - [Overview](#overview)
   - [Implementation](#csrf-implementation)

4. [Complete Email Verification Flow](#complete-email-verification-flow)
   - [Step-by-Step Guide](#step-by-step-guide)
   - [Troubleshooting](#troubleshooting)

---

## Request Email Verification API

The Request Email Verification API allows users to request a verification email containing either a verification code or a verification link.

### Request Email Verification Endpoint

POST /email-verification

### Request Email Verification Request Body

```json
{
  "email": "user@example.com",
  "vMode": "CODE",
  "csrfToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Optional, required if sessionId is provided
}

```

Parameters:

- email (required): The email address to verify
- vMode (optional): Verification mode, either "CODE" or "LINK" (defaults to system setting)
- csrfToken (optional): CSRF token from previous requests, required if sessionId is provided


Request Email Verification Query Parameters

- userSessionId: User session ID for authentication context (required)

Request Email Verification cURL Example

```bash
curl -X POST "https://api.example.com/email/verification?userSessionId=SESSION_ID" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "email": "user@example.com",
    "vMode": "CODE"
  }'

```

Request Email Verification Postman Example

1. Create a new POST request to https://api.example.com/email/verification?userSessionId=SESSION_ID
2. Set body type to "raw" and format to "JSON"
3. Add header: X-CSRF-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
4. Add the following JSON body:

```json
{
  "email": "user@example.com",
  "vMode": "CODE"
}
```
4. Click "Send"

Request Email Verification Response:

Successful Response (200 OK)

```json
{
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000,
  "message": "Verification code sent to your email address",
  "sessionId": "abcdef-1234-5678-90ab-cdef12345678",
  "email": "u***r@e***e.com",
  "csrfToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New field for CSRF protection
}
```

Request Email Verification Error Responses:

User Not Found (404 Not Found)

```json
{
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000,
  "message": "User not found",
  "code": "USER_NOT_FOUND"
}
```

Missing Session ID (400 Bad Request)

```json
{
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000,
  "message": "Missing required parameter: userSessionId",
  "code": "MISSING_SESSION_ID"
}
```

Invalid CSRF Token (400 Bad Request)

```json
{
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000,
  "message": "Invalid verification link",
  "code": "INVALID_VERIFICATION_LINK"
}
```

Rate Limiting (429 Too Many Requests)

```json
{
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000,
  "message": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

Server Error (500 Internal Server Error)

```json
{
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000,
  "message": "An error occurred while sending verification email",
  "code": "EMAIL_VERIFICATION_SEND_ERROR"
}
```

## Verify Email API

The Verify Email API allows users to verify their email address using either a verification code or a verification link.

Verify Email Endpoint

POST /account/email/verify
GET /account/email/verify (for link verification)


### Verification Methods

The system supports two verification methods:

1. Code Verification: User receives a numeric code via email and submits it through the API
2. Link Verification: User receives a link via email and clicks it to verify their account


Code Verification

Request Body

```json
{
  "email": "user@example.com",
  "verificationCode": "123456",
  "csrfToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Required CSRF token
}

```

Query Parameters

- userSessionId: The session ID received during the email verification request (required)

Link Verification

Query Parameters
- token: The verification token from the email link
- userSessionId: The session ID received during the email verification request (required)

Verify Email cURL Examples

Code Verification

```bash
curl -X POST "https://api.example.com/verify-email?userSessionId=SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "verificationCode": "123456",
    "csrfToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'

```

Link Verification

```bash
curl -X GET "https://api.example.com/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&userSessionId=SESSION_ID"

```

Verify Email Postman Examples

Code Verification

1. Create a new POST request to https://api.example.com/email/verify?userSessionId=SESSION_ID
2. Set body type to "raw" and format to "JSON"
3. Add the following JSON body:

```json
{
  "email": "user@example.com",
  "verificationCode": "123456",
  "csrfToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```
4. Click "Send"

Link Verification

1. Create a new GET request to https://api.example.com/email/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&userSessionId=SESSION_ID

2. Click "Send"


### Verify Email Response

Successful Response (200 OK)

```json
{
  "message": "Email verification completed successfully",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}
```

Verify Email Error Responses

Invalid Verification Code (400 Bad Request)

```json
{
  "message": "Invalid verification code",
  "code": "NOT_AUTHORIZED",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}
```

Invalid CSRF Token (400 Bad Request)

```json
{
  "message": "Invalid verification code",
  "code": "INVALID_VERIFICATION_CODE",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}

```

Invalid Verification Link (405 Method Not Allowed)

```json
{
  "message": "Invalid verification link",
  "code": "EMAIL_VERIFICATION_FAILED",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}
```

Already Verified (200 OK)

```json
{
  "message": "Email address is already verified",
  "code": "EMAIL_ALREADY_VERIFIED",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}

```

Missing Session ID (400 Bad Request)

```json
{
  "message": "Missing required parameter: userSessionId",
  "code": "MISSING_SESSION_ID",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}
```

Email Not Found or Expired (404 Not Found)

```json
{
  "message": "Email verification failed",
  "code": "EMAIL_VERIFICATION_FAILED",
  "correlationId": "12345678-1234-1234-1234-123456789012",
  "timestamp": 1623456789000
}
```


### Compression Support

1. Client Indication: Clients can indicate support for compression by including the Accept-Encoding header:

Accept-Encoding: gzip, deflate

2. Server Response: When compression is supported, the server will:
    
   - Compress the response body using gzip
   - Set the response as base64-encoded
   - Include appropriate headers

**Compressed Response Headers**

When a response is compressed, these additional headers will be present:

Content-Encoding: gzip
Content-Type: text/html; charset=UTF-8  (for HTML responses)
isBase64Encoded: true

**HTML Response Compression**

HTML responses for email verification links are automatically compressed when the client supports it:


## Example request with compression support

```bash
curl -X GET "https://api.example.com/v1/account/email/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \

  -H "Accept-Encoding: gzip"
```

**Client Implementation Notes**

1. Handling Compressed Responses: Clients should check for the Content-Encoding: gzip header and decompress accordingly

2. Base64 Decoding: When isBase64Encoded is true, the response body should be base64-decoded before decompression

3. Automatic Handling: Most HTTP client libraries handle decompression automatically when the appropriate headers are present

**Compression Benefits**

- Reduced Bandwidth: Compressed responses can be 70-90% smaller
- Faster Load Times: Especially beneficial for users on slower connections
- Lower Data Usage: Important for mobile users with limited data plans

This compression is particularly useful for HTML responses in the confirmation flow, which may contain formatted content and styling information.


## CSRF Protection

### CSRF Overview

Cross-Site Request Forgery (CSRF) protection has been implemented to enhance security during the signup and verification process. This prevents attackers from forcing users to execute unwanted actions on a web application in which they're authenticated.

### CSRF Implementation

1. Token Generation: A CSRF token is generated during sign-up and included in the response
2. Token Storage: The token is stored with the user's session in the backend
3. Token Validation: All confirmation requests must include the valid CSRF token
4. Token Transmission Methods:
   - For code verification: Include the CSRF token in the request body or as an X-CSRF-Token header
   - For link verification: The CSRF token is embedded in the verification link

Headers that may contain the CSRF token:

- X-CSRF-Token
- X-Session-ID


## Complete Email Verification Flow

**Step-by-Step Guide**

1. Request Verification Email:

- Send a POST request to /email-verification with the user's email
- Receive a 200 OK response with a sessionId
- User receives a verification code or link via email

2. Verify Email:

- Using Code: Send a POST request to /verify-email with the verification code and session ID
- Using Link: Click the verification link in the email or send a GET request with the token and session ID
- Receive a 200 OK response confirming successful verification

3. Confirmation:

- After successful verification, the user receives a confirmation email
- The user's email is now marked as verified in the system

**Troubleshooting**

Common Issues

1. CSRF Token Invalid or Missing:

- Ensure you're including the exact CSRF token received during sign-up
- Check that the token is being sent in the correct format (body, header, or query parameter)
- CSRF tokens are tied to sessions and cannot be reused across different sessions

2. Verification Code Not Received:

- Check spam/junk folder
- Ensure the email address was entered correctly during sign-up
- Request a new verification code if needed

3. Invalid Verification Code:

- Ensure you're using the most recent code sent
- Codes expire after a certain period (typically 15-30 minutes)
- Check for typos when entering the code

4. Account Already Exists:

- If you receive a 409 Conflict response, try logging in instead
- Use the password recovery feature if you've forgotten your password

5. Rate Limiting:

- If you receive a 429 Too Many Requests response, wait before trying again
- Multiple failed attempts may temporarily lock your account


**Support**

If you continue to experience issues, please contact support with your correlationId for faster assistance.