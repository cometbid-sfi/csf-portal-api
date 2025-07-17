# User Management API Documentation

This document provides examples of how to use the User Management API endpoints for toggling user enable/disable status and activation/deactivation status.

This is administrative task and requires user to belong to the Admin group.

## Authentication

All requests require:
- A valid access token in the `Authorization` header (Bearer token)
- A valid user session ID in the `userSessionId` query parameter

## Toggle User Enable/Disable

This endpoint allows administrators to enable or disable a user account.


### Endpoint

POST /admin/users/status

### Request Body

```json
{
  "email": "user@example.com",
  "action": "disable",
  "reason": "Account compromised"
}
```

Parameters:

- email (required): The email address of the user to enable/disable
- action (required): Either "enable" or "disable"
- reason (optional): Reason for the action


## cURL Example

# Disable a user

```bash
curl -X POST https://api.example.com/admin/users/status?userSessionId=SESSION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "action": "disable",
    "reason": "Account compromised"
  }'
  ```

# Enable a user

```bash
curl -X POST https://api.example.com/admin/users/status?userSessionId=SESSION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "action": "enable",
    "reason": "Issue resolved"
  }'
```

## Postman Example

1. Create a new POST request to https://api.example.com/admin/users/status?userSessionId=SESSION_ID
2. Add header: Authorization: Bearer YOUR_ACCESS_TOKEN
3. Set body type to "raw" and format to "JSON"
4. Add the following JSON body:

```json
{
  "email": "user@example.com",
  "action": "disable",
  "reason": "Account compromised"
}
```

5. Click "Send"

Response Headers:

HTTP/1.1 200 OK
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Session-ID: SESSION_ID
userSessionId: SESSION_ID
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate


Response Body:

```json
{
  "message": "User disabled successfully",
  "code": "USER_DISABLED_SUCCESS",
  "action": "disable",
  "email": "user@example.com",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

## Toggle User Activation

This endpoint allows administrators to activate or deactivate a user account.

Endpoint

POST /admin/users/activation

Request Body:

```json
{
  "email": "user@example.com",
  "action": "deactivate",
  "reason": "User requested account deactivation"
}
```

Parameters:

- email (required): The email address of the user to activate/deactivate
- action (required): Either "activate" or "deactivate"
- reason (optional): Reason for the action

## cURL Example

# Deactivate a user

```bash
curl -X POST https://api.example.com/admin/users/activation?userSessionId=SESSION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "action": "deactivate",
    "reason": "User requested account deactivation"
  }'
```

# Activate a user

```bash
curl -X POST https://api.example.com/admin/users/activation?userSessionId=SESSION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "action": "activate",
    "reason": "User requested account reactivation"
  }'
```

Postman Example:

1. Create a new POST request to https://api.example.com/admin/users/activation?userSessionId=SESSION_ID
2. Add header: Authorization: Bearer YOUR_ACCESS_TOKEN
3. Set body type to "raw" and format to "JSON"
4. Add the following JSON body:

```bash
{
  "email": "user@example.com",
  "action": "deactivate",
  "reason": "User requested account deactivation"
}
```

5. Click "Send"

Response Headers:

HTTP/1.1 200 OK
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Session-ID: SESSION_ID
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate


Response Body:

```json
{
  "message": "User deactivated successfully",
  "code": "USER_DEACTIVATED_SUCCESS",
  "action": "deactivate",
  "email": "user@example.com",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Error Responses: 

Authentication Error (401)

Response Headers

HTTP/1.1 401 Unauthorized
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate

Response Body

```json
{
  "message": "Invalid or expired access token",
  "code": "AUTHENTICATION_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Authorization Error (403)

Response Headers

HTTP/1.1 403 Forbidden
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate

Response Body:

```json
{
  "message": "Insufficient permissions to perform this action",
  "code": "AUTHORIZATION_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Invalid Request (400)

Response Headers

HTTP/1.1 400 Bad Request
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate

Response Body

```json
{
  "message": "Invalid request parameters",
  "code": "INVALID_REQUEST",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

User Not Found (404)

Response Headers

HTTP/1.1 404 Not Found
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate


Response Body

```json
{
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

### Response Headers

All API responses include the following headers:

#### Successful Response Headers

HTTP/1.1 200 OK
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Session-ID: SESSION_ID
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0


#### Error Response Headers

HTTP/1.1 401 Unauthorized
Content-Type: application/json
X-Correlation-ID: 12345678-1234-1234-1234-123456789012
X-Request-ID: 98765432-9876-9876-9876-987654321098
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0


### Header Descriptions

- `X-Correlation-ID`: Unique identifier for tracking the request through the system
- `X-Session-ID`: The user session ID used for the request (only included when a valid session ID was provided)
- `X-Request-ID`: Unique identifier for the API Gateway request
- `Cache-Control`, `Pragma`, `Expires`: Headers to prevent caching of sensitive information


Notes:

1. Administrators cannot disable or deactivate their own accounts.
2. Both endpoints update the user's status in both Cognito and DynamoDB.
3. The reason field is optional but recommended for audit purposes.
4. All actions are logged and can be audited.
5. The X-Session-ID header is only included in responses when a valid session ID was provided in the request.