# User Management API Documentation

This document provides detailed examples of how to use the User Management APIs, including searching for users, retrieving user profiles, and updating user profiles.

### Base URL
`https://api.example.com/v1/users`


### Authentication
Bearer Token Authentication required

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| userSessionId | Yes | Session identifier for tracking user activity |
| includeFullProfile | No | Set to "true" to return the complete updated profile in the response |
| requestedCategories | No | Comma-separated list of categories to include in the response (e.g., "basic,professional") |
| noLinks | No | Set to "true" to exclude HATEOAS links from the response |

### Request Body Fields

The request body can include any of the following fields that you want to update:

#### Basic Information
- `firstName`: User's first name
- `lastName`: User's last name
- `gender`: User's gender (e.g., "male", "female", "other", "prefer_not_to_say")
- `dateOfBirth`: Object with day, month, and year
- `profileImageUrl`: URL to user's profile image
- `phoneNumber`: User's phone number

#### Professional Information
- `jobTitle`: User's job title
- `companyName`: User's company name
- `selfEmployed`: Boolean indicating if user is self-employed
- `yearsOfExperience`: Number of years of professional experience
- `professionalBio`: Professional biography text

#### Location Information
- `streetAddress`: User's street address
- `city`: User's city
- `state`: User's state or province
- `country`: User's country
- `postalCode`: User's postal code

#### Preferences
- `preferredLanguage`: User's preferred language code
- `theme`: User interface theme preference (e.g., "light", "dark", "system")
- `timezone`: User's timezone
- `skills`: Array of professional skills
- `interests`: Array of personal/professional interests

#### Social Profiles
- `socialProfiles`: Object containing social media profile URLs


## Table of Contents

1. [Search Users API](#search-users-api)
   - [Endpoint](#search-users-endpoint)
   - [Query Parameters](#search-users-query-parameters)
   - [cURL Example](#search-users-curl-example)
   - [Postman Example](#search-users-postman-example)
   - [Response](#search-users-response)
   - [Error Responses](#search-users-error-responses)

2. [Get User Profile API](#get-user-profile-api)
   - [Endpoint](#get-user-profile-endpoint)
   - [Query Parameters](#get-user-profile-query-parameters)
   - [cURL Example](#get-user-profile-curl-example)
   - [Postman Example](#get-user-profile-postman-example)
   - [Response](#get-user-profile-response)
   - [Error Responses](#get-user-profile-error-responses)

3. [Update User Profile API](#update-user-profile-api)
   - [Endpoint](#update-user-profile-endpoint)
   - [Request Body](#update-user-profile-request-body)
   - [Query Parameters](#update-user-profile-query-parameters)
   - [cURL Example](#update-user-profile-curl-example)
   - [Postman Example](#update-user-profile-postman-example)
   - [Response](#update-user-profile-response)
   - [Error Responses](#update-user-profile-error-responses)

---

## 1. Search Users API

The Search Users API allows you to search for users based on various criteria with pagination support.

### Search Users Endpoint

GET /users/search


### Search Users Query Parameters

#### Search Criteria:
- `email`: Filter by email address
- `membershipName`: Filter by membership name
- `role`: Filter by user role (e.g., "MEMBER", "ADMIN")
- `status`: Filter by user status (e.g., "ACTIVE", "INACTIVE")
- `membershipPlan`: Filter by membership plan (e.g., "INDIVIDUAL", "GROUP", "ORGANIZATION")
- `membershipTier`: Filter by membership tier
- `city`: Filter by city
- `state`: Filter by state/province
- `country`: Filter by country

#### Pagination:
- `page`: Page number (default: 1)
- `pageSize`: Number of results per page (default: 20, max: 50)
- `sortBy`: Field to sort by (default: "createdAt")
- `sortOrder`: Sort direction, "asc" or "desc" (default: "desc")
- `nextPageToken`: Token for retrieving the next page (alternative to page number)

#### Response Customization:
- `categories`: Comma-separated list of profile categories to include (default: "basic")

### Search Users cURL Example

```bash
# Basic search with default pagination
curl -X GET "https://api.example.com/v1/users/search" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Search with criteria and pagination
curl -X GET "https://api.example.com/v1/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&page=2&pageSize=10&sortBy=lastName&sortOrder=asc&categories=basic,membership" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Search using next page token
curl -X GET "https://api.example.com/v1/users/search?nextPageToken=eyJsYXN0RXZhbHVhdGVkS2V5Ijp7fX0=" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

```

**Search Users Postman Example**

1. Create a new GET request to https://api.example.com/v1/users/search
2. Add header: Authorization: Bearer YOUR_ACCESS_TOKEN
3. Add query parameters:
    - membershipPlan: "INDIVIDUAL"
    - status: "ACTIVE"
    - page: 2
    - pageSize: 10
    - sortBy: "lastName"
    - sortOrder: "asc"
    - categories: "basic,membership"

4. Click "Send"

```json
{
  "message": "Users found successfully",
  "code": "SEARCH_USERS_SUCCESS",
  "users": [
    {
      "basic": {
        "userId": "12345",
        "email": "j***e@e***e.com",
        "firstName": "John",
        "lastName": "Doe",
        "membershipName": "johndoe123"
      },
      "membership": {
        "membershipPlan": "INDIVIDUAL",
        "membershipStatus": "ACTIVE"
      }
    },
    {
      "basic": {
        "userId": "67890",
        "email": "j***h@e***e.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "membershipName": "janesmith456"
      },
      "membership": {
        "membershipPlan": "INDIVIDUAL",
        "membershipStatus": "ACTIVE"
      }
    }
  ],
  "pagination": {
    "page": 2,
    "pageSize": 10,
    "totalItems": 45,
    "totalPages": 5,
    "nextPageToken": "eyJsYXN0RXZhbHVhdGVkS2V5Ijp7fX0="
  },
  "_links": {
    "first": "/users/search?page=1&pageSize=10&sortBy=lastName&sortOrder=asc&membershipPlan=INDIVIDUAL&status=ACTIVE&categories=basic,membership",
    "last": "/users/search?page=5&pageSize=10&sortBy=lastName&sortOrder=asc&membershipPlan=INDIVIDUAL&status=ACTIVE&categories=basic,membership",
    "next": "/users/search?page=3&pageSize=10&sortBy=lastName&sortOrder=asc&membershipPlan=INDIVIDUAL&status=ACTIVE&categories=basic,membership",
    "prev": "/users/search?page=1&pageSize=10&sortBy=lastName&sortOrder=asc&membershipPlan=INDIVIDUAL&status=ACTIVE&categories=basic,membership"
  },
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Search Users Error Responses:

Rate Limiting (429 Too Many Requests)

```json
{
  "message": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Authentication Error (401 Unauthorized)

```json
{
  "message": "Invalid or expired access token",
  "code": "AUTHENTICATION_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}

```

Server Error (500 Internal Server Error)

```json
{
  "message": "An error occurred while searching for users",
  "code": "SEARCH_USERS_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

### Pagination with nextPageToken

The Search Users API supports two pagination methods:
1. Page-based pagination using `page` and `pageSize` parameters
2. Token-based pagination using `nextPageToken` parameter

Token-based pagination is recommended for large result sets as it provides better performance and consistency.


#### Example: Multi-page Search Flow

**Step 1: Initial Search Request**

```bash
# Initial search request
curl -X GET "https://api.example.com/v1/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&pageSize=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response:

```json
{
  "message": "Users found successfully",
  "code": "SEARCH_USERS_SUCCESS",
  "users": [
    {
      "basic": {
        "userId": "12345",
        "email": "a***e@e***e.com",
        "firstName": "Alice",
        "lastName": "Anderson",
        "membershipName": "aliceanderson"
      },
      "membership": {
        "membershipPlan": "INDIVIDUAL",
        "membershipStatus": "ACTIVE"
      }
    },
    // ... 9 more users
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 45,
    "totalPages": 5,
    "nextPageToken": "eyJsYXN0RXZhbHVhdGVkS2V5Ijp7InBrIjoiTUVNQkVSI2JvYkBleGFtcGxlLmNvbSJ9fQ=="
  },
  "_links": {
    "first": "/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&pageSize=10&page=1",
    "last": "/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&pageSize=10&page=5",
    "next": "/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&pageSize=10&nextPageToken=eyJsYXN0RXZhbHVhdGVkS2V5Ijp7InBrIjoiTUVNQkVSI2JvYkBleGFtcGxlLmNvbSJ9fQ=="
  },
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Step 2: Get Next Page Using nextPageToken

# Use the nextPageToken from the previous response

```bash
curl -X GET "https://api.example.com/v1/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&pageSize=10&nextPageToken=eyJsYXN0RXZhbHVhdGVkS2V5Ijp7InBrIjoiTUVNQkVSI2JvYkBleGFtcGxlLmNvbSJ9fQ==" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Step 3: Continue Pagination

Continue using the nextPageToken from each response to fetch subsequent pages until you reach the end of the results (when nextPageToken is no longer provided).

Postman Example for Token-based Pagination

1. Create a new GET request to https://api.example.com/v1/users/search
2. Add header: Authorization: Bearer YOUR_ACCESS_TOKEN
3. Add query parameters:
  
   - membershipPlan: "INDIVIDUAL"
   - status: "ACTIVE"
   - pageSize: 10

4. Click "Send"
5. From the response, copy the nextPageToken value
6. Create a new request or modify the existing one:

   - Add the nextPageToken parameter with the copied value
   - Remove any page parameter if present

7. Click "Send" to get the next page of results

Notes on Token-based Pagination

- The nextPageToken is a base64-encoded string that contains information about the last evaluated item
- When using nextPageToken, do not include the page parameter in your request
- Token-based pagination is more efficient for large datasets and provides consistent results even when data changes between requests
- The token is typically valid for a limited time (usually 15 minutes)

### Token Expiration and Renewal

When using token-based pagination, it's important to understand how token expiration works:

- Pagination tokens typically expire after 15 minutes of inactivity
- If a token expires, you'll receive an error response when attempting to use it:

```json
{
  "message": "Invalid or expired pagination token",
  "code": "INVALID_PAGINATION_TOKEN",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

How to Handle Expired Tokens

When a pagination token expires, you need to restart your pagination from the beginning:

1. Make a new initial request without the nextPageToken parameter
2. Use page-based pagination to navigate to approximately where you left off:

```bash
curl -X GET "https://api.example.com/v1/users/search?membershipPlan=INDIVIDUAL&status=ACTIVE&pageSize=10&page=3" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
3. Resume token-based pagination with the new token from this response

Best Practices for Handling Pagination Tokens

1. Process pages promptly: Try to process all pages within the token expiration window
2. Save your position: Keep track of which items you've processed so you can resume if needed
3. Handle errors gracefully: Implement retry logic that falls back to page-based pagination
4. Use consistent parameters: Keep all search criteria parameters identical between requests
5. Consider smaller page sizes: Smaller page sizes reduce the risk of token expiration during processing

Example: Handling an Expired Token

```javascript
async function fetchAllUsers() {
  let allUsers = [];
  let nextPageToken = null;
  let currentPage = 1;
  const pageSize = 10;
  
  try {
    do {
      // Construct URL based on whether we have a token or need to use page number
      let url = "https://api.example.com/v1/users/search?pageSize=" + pageSize;
      
      if (nextPageToken) {
        url += "&nextPageToken=" + nextPageToken;
      } else {
        url += "&page=" + currentPage;
      }
      
      const response = await fetch(url, {
        headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle expired token specifically
        if (errorData.code === "INVALID_PAGINATION_TOKEN") {
          console.log("Token expired, falling back to page-based pagination");
          nextPageToken = null;
          // Increment page to avoid fetching the same data
          currentPage++;
          continue;
        }
        
        throw new Error(`API error: ${errorData.message}`);
      }
      
      const data = await response.json();
      allUsers = allUsers.concat(data.users);
      
      // Update for next iteration
      nextPageToken = data.pagination.nextPageToken;
      currentPage = data.pagination.page + 1;
      
      // Exit when we've reached the end
      if (!nextPageToken && currentPage > data.pagination.totalPages) {
        break;
      }
      
    } while (true);
    
    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
```

This approach ensures that your pagination process can recover gracefully from token expiration without losing progress.


## 2. Get User Profile API

The Get User Profile API allows users to retrieve their own profile information.

**Get User Profile Endpoint**


### GET /users

**Get User Profile Query Parameters**

- userSessionId: User session ID for authentication context
- schema: Set to "true" to get the profile schema instead of profile data
- categories: Comma-separated list of profile categories to include (e.g., "basic,membership,professional")
- includeFullProfile: Set to "true" to include all profile data
- fields: Comma-separated list of specific fields to include
- noLinks: Set to "true" to exclude HATEOAS links
- fullLinks: Set to "true" to include full HATEOAS links instead of simplified links

Get User Profile cURL Example

# Get basic profile

```bash
curl -X GET "https://api.example.com/v1/users?userSessionId=SESSION_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get specific categories
curl -X GET "https://api.example.com/v1/users?userSessionId=SESSION_ID&categories=basic,professional,location" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get full profile
curl -X GET "https://api.example.com/v1/users?userSessionId=SESSION_ID&includeFullProfile=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get profile schema
curl -X GET "https://api.example.com/v1/users?schema=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

```

Get User Profile Postman Example

1. Create a new GET request to https://api.example.com/users?userSessionId=SESSION_ID&categories=basic,professional,location
2. Add header: Authorization: Bearer YOUR_ACCESS_TOKEN
3. Click "Send"

Get User Profile Response

Successful Response (200 OK)

```json
{
  "message": "User profile retrieved successfully",
  "code": "GET_USER_SUCCESS",
  "user": {
    "basic": {
      "userId": "12345",
      "email": "j***e@e***e.com",
      "firstName": "John",
      "lastName": "Doe",
      "membershipName": "johndoe123",
      "profileImageUrl": "https://example.com/profile.jpg"
    },
    "professional": {
      "jobTitle": "Software Engineer",
      "companyName": "Tech Company",
      "selfEmployed": false,
      "yearsOfExperience": 5,
      "professionalBio": "Experienced software engineer with a focus on cloud technologies."
    },
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    }
  },
  "_links": {
    "self": "/users?userSessionId=SESSION_ID",
    "updateProfile": {
      "default": "/users?userSessionId=SESSION_ID",
      "withBasic": "/users?userSessionId=SESSION_ID&requestedCategories=basic",
      "withProfessional": "/users?userSessionId=SESSION_ID&requestedCategories=professional",
      "withLocation": "/users?userSessionId=SESSION_ID&requestedCategories=location"
    },
    "getFullProfile": "/users?userSessionId=SESSION_ID&includeFullProfile=true",
    "getByCategories": {
      "all": "/users?userSessionId=SESSION_ID&categories=basic,membership,professional,location,profileStatus,preferences,securityInfo,social",
      "basic": "/users?userSessionId=SESSION_ID&categories=basic",
      "professional": "/users?userSessionId=SESSION_ID&categories=professional",
      "location": "/users?userSessionId=SESSION_ID&categories=location"
    }
  },
  "userSessionId": "SESSION_ID",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Schema Response (200 OK)

```json
{
  "message": "Schema available",
  "schema": {
    "basic": [
      { "name": "firstName", "description": "User's first name", "isComposite": false },
      { "name": "lastName", "description": "User's last name", "isComposite": false },
      { "name": "email", "description": "User's email address", "isComposite": false }
    ],
    "professional": [
      { "name": "jobTitle", "description": "User's job title", "isComposite": false },
      { "name": "companyName", "description": "User's company name", "isComposite": false }
    ]
  },
  "availableCategories": [
    "basic",
    "membership",
    "professional",
    "location",
    "profileStatus",
    "preferences",
    "securityInfo",
    "social",
    "metadata"
  ],
  "_links": {
    "self": "/users?userSessionId=SESSION_ID"
  },
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Get User Profile Error Responses

Authentication Error (401 Unauthorized)

```json
{
  "message": "Invalid or expired access token",
  "code": "INVALID_ACCESS_TOKEN",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

User Not Found (404 Not Found)

```json
{
  "message": "User profile not found",
  "code": "USER_PROFILE_NOT_FOUND",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Server Error (500 Internal Server Error)

```json
{
  "message": "An error occurred while retrieving user profile",
  "code": "GET_USER_PROFILE_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

## 3. Update User Profile API

The Update User Profile API allows users to update their profile information.

Update User Profile Endpoint

PUT /users

Update User Profile Request Body

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "jobTitle": "Senior Software Engineer",
  "phoneNumber": "+1234567890",
  "city": "Seattle",
  "state": "WA",
  "country": "USA",
  "preferredLanguage": "en",
  "socialProfiles": {
    "linkedinUrl": "https://linkedin.com/in/johnsmith",
    "githubUrl": "https://github.com/johnsmith"
  }
}
```

You can update any combination of fields across different categories.

Update User Profile Query Parameters

- userSessionId: User session ID for authentication context (required)
- categories: Comma-separated list of categories to include in the response
- includeFullProfile: Set to "true" to include the full updated profile in the response
- noLinks: Set to "true" to exclude HATEOAS links
- fullLinks: Set to "true" to include full HATEOAS links instead of simplified links


Update User Profile cURL Example:

```bash
curl -X PUT "https://api.example.com/v1/users?userSessionId=SESSION_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "firstName": "John",
        "lastName": "Smith",
        "jobTitle": "Senior Software Engineer",
        "phoneNumber": "+1234567890",
        "city": "Seattle",
        "state": "WA",
        "country": "USA",
        "preferredLanguage": "en",
        "socialProfiles": {
            "linkedinUrl": "https://linkedin.com/in/johnsmith",
            "githubUrl": "https://github.com/johnsmith"
        }
    }'
```

## Update User Profile Postman Example

1. Create a new PUT request to https://api.example.com/users?userSessionId=SESSION_ID
2. Add header: Authorization: Bearer YOUR_ACCESS_TOKEN
3. Set body type to "raw" and format to "JSON"
4. Add the following JSON body:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "jobTitle": "Senior Software Engineer",
  "phoneNumber": "+1234567890",
  "city": "Seattle",
  "state": "WA",
  "country": "USA",
  "preferredLanguage": "en",
  "socialProfiles": {
    "linkedinUrl": "https://linkedin.com/in/johnsmith",
    "githubUrl": "https://github.com/johnsmith"
  }
}
```

5. Click "Send"


## Update User Profile Response

Successful Response (200 OK)

```json
{
  "message": "User profile updated successfully",
  "code": "UPDATE_USER_SUCCESS",
  "updates": {
    "updatedFields": [
      "firstName",
      "lastName",
      "jobTitle",
      "phoneNumber",
      "city",
      "state",
      "country",
      "preferredLanguage",
      "socialProfiles"
    ],
    "updatedCategories": [
      "basic",
      "professional",
      "location",
      "preferences",
      "social"
    ],
    "sensitiveFieldsUpdated": false
  },
  "_links": {
    "self": "/users?userSessionId=SESSION_ID",
    "getFullProfile": "/users?userSessionId=SESSION_ID&includeFullProfile=true",
    "getByCategories": {
      "updatedOnly": "/users?userSessionId=SESSION_ID&categories=basic,professional,location,preferences,social"
    }
  },
  "userSessionId": "SESSION_ID",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Update User Profile Error Responses

Authentication Error (401 Unauthorized)

```json
{
  "message": "Invalid or expired access token",
  "code": "INVALID_ACCESS_TOKEN",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Invalid Session (401 Unauthorized)

```json
{
  "message": "Invalid user session",
  "code": "INVALID_USER_SESSION",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Validation Error (400 Bad Request)

```json
{
  "message": "Invalid request parameters: phoneNumber must be a valid phone number",
  "code": "VALIDATION_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Account Disabled (403 Forbidden)

```json
{
  "message": "Account is disabled or deactivated",
  "code": "ACCOUNT_DISABLED",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Server Error (500 Internal Server Error)

```json
{
  "message": "An error occurred while updating user profile",
  "code": "UPDATE_USER_PROFILE_ERROR",
  "timestamp": 1623456789000,
  "correlationId": "12345678-1234-1234-1234-123456789012"
}
```

Notes

1. The userSessionId query parameter is required for all update operations
2. By default, the response includes only update information without the profile data
3. Use includeFullProfile=true to get the complete updated profile in the response
4. Use requestedCategories to get specific sections of the profile in the response
5. The response includes HATEOAS links for related operations
6. Use noLinks=true to reduce response size by excluding HATEOAS links
7. The updates object in the response shows which fields and categories were updated
8. Sensitive field updates are flagged in the response