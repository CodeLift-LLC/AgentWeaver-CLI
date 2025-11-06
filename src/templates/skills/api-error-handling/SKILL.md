---
name: API Error Handling
description: Comprehensive patterns for implementing robust error handling in REST APIs including status codes, error responses, logging, and user-friendly messages.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - api
  - error-handling
  - rest
  - http
  - backend
mcp-servers:
  - socket
  - context7
---

# API Error Handling Skill

This skill provides battle-tested patterns for implementing comprehensive error handling in REST APIs that balance developer experience with security.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Review existing error handling, design a consistent error format, implement centralized error middleware, test with various error scenarios, and validate error messages are user-friendly yet secure.

**Additional tools available**:
- Use Socket MCP to scan dependencies before adding error handling libraries
- Use Context7 MCP for framework-specific error handling documentation

## When to Use

- Building REST API endpoints that need robust error handling
- Standardizing error responses across your API
- Improving API debugging and troubleshooting
- Creating user-friendly error messages
- Implementing proper HTTP status code usage
- Setting up error logging and monitoring

## Core Concepts

### HTTP Status Code Selection

**2xx Success**
- `200 OK`: Standard successful response
- `201 Created`: Resource successfully created
- `202 Accepted`: Request accepted for async processing
- `204 No Content`: Success with no response body

**4xx Client Errors**
- `400 Bad Request`: Invalid request format or validation error
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Request conflicts with current state (e.g., duplicate)
- `422 Unprocessable Entity`: Valid format but semantic errors
- `429 Too Many Requests`: Rate limit exceeded

**5xx Server Errors**
- `500 Internal Server Error`: Generic server error
- `502 Bad Gateway`: Upstream service error
- `503 Service Unavailable`: Server temporarily unavailable
- `504 Gateway Timeout`: Upstream service timeout

## Standard Error Response Format

### Recommended Structure

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for the request",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      },
      {
        "field": "age",
        "message": "Age must be at least 18"
      }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/users",
    "request_id": "req_abc123xyz"
  }
}
```

### Field Descriptions

- **code**: Machine-readable error code (UPPERCASE_SNAKE_CASE)
- **message**: Human-readable error message
- **details**: Array of specific validation errors (optional)
- **timestamp**: When the error occurred (ISO 8601)
- **path**: API endpoint where error occurred
- **request_id**: Unique request identifier for troubleshooting

## Universal Implementation Pattern

### 1. Error Class Hierarchy (Language-Agnostic)

#### Conceptual Structure

```
BaseError (extends native Error)
├─> ValidationError (400)
├─> AuthenticationError (401)
├─> AuthorizationError (403)
├─> NotFoundError (404)
├─> ConflictError (409)
├─> RateLimitError (429)
└─> InternalServerError (500)
```

#### Error Class Pattern (Pseudocode)

```
class BaseError extends Error:
  constructor(statusCode, errorCode, message, details):
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.message = message
    this.details = details
    this.timestamp = getCurrentTimestamp()

class ValidationError extends BaseError:
  constructor(details):
    super(400, 'VALIDATION_ERROR', 'Validation failed', details)

class NotFoundError extends BaseError:
  constructor(resourceName):
    super(404, 'NOT_FOUND', resourceName + ' not found', null)

class UnauthorizedError extends BaseError:
  constructor(message = 'Unauthorized'):
    super(401, 'UNAUTHORIZED', message, null)

class ForbiddenError extends BaseError:
  constructor(message = 'Access forbidden'):
    super(403, 'FORBIDDEN', message, null)

class ConflictError extends BaseError:
  constructor(message, details = null):
    super(409, 'CONFLICT', message, details)

class InternalError extends BaseError:
  constructor(message = 'Internal server error'):
    super(500, 'INTERNAL_SERVER_ERROR', message, null)
```

### 2. Error Handler Middleware Pattern (Universal)

#### Conceptual Flow

```
1. Error caught by middleware
   ├─> Extract error information
   ├─> Log error with context
   ├─> Determine error type
   ├─> Format error response
   └─> Send HTTP response

2. Error Logging:
   ├─> Log level based on status code
   ├─> Include request context (path, method, headers)
   ├─> Include error stack trace (server-side only)
   ├─> Include request_id for correlation
   └─> Use structured logging format

3. Error Response:
   ├─> Status code from error object
   ├─> Standardized error format
   ├─> Include request_id
   ├─> Sanitize sensitive information
   └─> Return to client
```

#### Error Handler Middleware (Pseudocode)

```
function errorHandlerMiddleware(error, request, response, next):
  // 1. Generate request ID if not exists
  requestId = request.id || generateUUID()

  // 2. Log error with context
  logError({
    level: determineLogLevel(error.statusCode),
    message: error.message,
    stack: error.stack,
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    path: request.path,
    method: request.method,
    requestId: requestId,
    userId: request.user?.id,
    timestamp: getCurrentTimestamp()
  })

  // 3. Handle custom application errors
  if error instanceof BaseError:
    return response.status(error.statusCode).json({
      error: {
        code: error.errorCode,
        message: error.message,
        details: error.details,
        timestamp: getCurrentTimestamp(),
        path: request.path,
        request_id: requestId
      }
    })

  // 4. Handle validation errors from validation libraries
  if error.type === 'ValidationError':
    details = formatValidationErrors(error)
    return response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: details,
        timestamp: getCurrentTimestamp(),
        path: request.path,
        request_id: requestId
      }
    })

  // 5. Handle unexpected errors (don't leak internals)
  logError({
    level: 'critical',
    message: 'Unexpected error',
    error: error,
    requestId: requestId
  })

  return response.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp: getCurrentTimestamp(),
      path: request.path,
      request_id: requestId
    }
  })

function determineLogLevel(statusCode):
  if statusCode >= 500:
    return 'error'
  else if statusCode >= 400:
    return 'warn'
  else:
    return 'info'

function formatValidationErrors(validationError):
  errors = []
  for each field in validationError.fields:
    errors.push({
      field: field.name,
      message: field.errorMessage
    })
  return errors
```

### 3. Route-Level Error Handling Pattern (Pseudocode)

```
// Synchronous route handler
function getUserHandler(request, response, next):
  try:
    userId = request.params.id

    // Validation
    if not isValidId(userId):
      throw new ValidationError([{
        field: 'id',
        message: 'Invalid user ID format'
      }])

    // Business logic
    user = database.findUserById(userId)

    if not user:
      throw new NotFoundError('User')

    // Authorization check
    if not canAccessUser(request.user, user):
      throw new ForbiddenError('Cannot access this user')

    response.status(200).json(user)

  catch error:
    next(error)  // Pass to error handler middleware

// Asynchronous route handler
async function createUserHandler(request, response, next):
  try:
    userData = request.body

    // Validate input
    validationResult = validateUserData(userData)
    if not validationResult.valid:
      throw new ValidationError(validationResult.errors)

    // Check for conflicts
    existingUser = await database.findUserByEmail(userData.email)
    if existingUser:
      throw new ConflictError('User with this email already exists')

    // Create user
    newUser = await database.createUser(userData)

    response.status(201).json(newUser)

  catch error:
    next(error)  // Pass to error handler middleware
```

### 4. Request ID Middleware Pattern (Pseudocode)

```
function requestIdMiddleware(request, response, next):
  // Check if client provided request ID
  requestId = request.headers['x-request-id']

  // Generate new ID if not provided
  if not requestId:
    requestId = generateUUID()

  // Attach to request object
  request.id = requestId

  // Add to response headers for client correlation
  response.setHeader('x-request-id', requestId)

  next()
```

### 5. Validation Helper Pattern (Pseudocode)

```
function validateUserInput(data, schema):
  errors = []

  for each field in schema:
    value = data[field.name]

    // Required field check
    if field.required and not value:
      errors.push({
        field: field.name,
        message: field.name + ' is required'
      })
      continue

    // Type validation
    if value and not isCorrectType(value, field.type):
      errors.push({
        field: field.name,
        message: field.name + ' must be of type ' + field.type
      })
      continue

    // Custom validators
    if field.validators:
      for each validator in field.validators:
        if not validator.validate(value):
          errors.push({
            field: field.name,
            message: validator.errorMessage
          })

  if errors.length > 0:
    throw new ValidationError(errors)

  return data
```

## Error Code Naming Convention

Use a consistent, hierarchical naming pattern:

```
RESOURCE_ACTION_REASON

Examples:
├─> USER_CREATE_DUPLICATE_EMAIL
├─> PAYMENT_PROCESS_INSUFFICIENT_FUNDS
├─> ORDER_UPDATE_INVALID_STATUS
├─> AUTH_TOKEN_EXPIRED
├─> RATE_LIMIT_EXCEEDED
├─> DATABASE_CONNECTION_FAILED
└─> EXTERNAL_API_TIMEOUT
```

## Best Practices

### 1. Consistent Error Format
- Use the same error response structure across all endpoints
- Include request_id for traceability
- Add timestamp for debugging time-sensitive issues
- Keep error structure flat and simple

### 2. Appropriate Status Codes
- Use specific 4xx codes for client errors
- Reserve 5xx for actual server errors
- Don't use 500 for validation or authentication failures
- Be consistent across similar error types

### 3. Security Considerations

**Never expose in production:**
- Stack traces
- Database query details
- Internal file paths
- Environment variables
- Cryptographic details

**Generic Messages for Security:**
```
❌ BAD - Leaks information:
"User john@example.com not found in database table 'users'"

✅ GOOD - Generic message:
"User not found"

❌ BAD - Reveals authentication details:
"Password hash comparison failed for user ID 12345"

✅ GOOD - Generic message:
"Invalid credentials"

❌ BAD - Exposes infrastructure:
"MongoDB connection failed on host db-prod-01.internal:27017"

✅ GOOD - Generic message:
"Service temporarily unavailable"
```

### 4. Logging Strategy

**What to log:**
- All errors with full context
- Request ID for correlation
- User ID (if authenticated)
- Request path and method
- Stack trace (server-side only)
- Timestamp

**Log Format (Structured JSON):**
```json
{
  "level": "error",
  "timestamp": "2024-01-15T10:30:00Z",
  "message": "User not found",
  "requestId": "req_abc123xyz",
  "userId": "user_789",
  "path": "/api/users/999",
  "method": "GET",
  "statusCode": 404,
  "errorCode": "NOT_FOUND",
  "stack": "Error: User not found\n    at getUserById (user-service.js:42)\n    ..."
}
```

**Log Levels:**
- `error`: 5xx errors (server failures)
- `warn`: 4xx errors (client failures)
- `info`: Successful requests
- `debug`: Detailed debugging info

### 5. Validation Errors

**Return all errors at once:**
```
❌ BAD - One error at a time:
{
  "error": {
    "message": "Email is required"
  }
}

✅ GOOD - All errors together:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Email is required" },
      { "field": "age", "message": "Age must be at least 18" },
      { "field": "phone", "message": "Invalid phone format" }
    ]
  }
}
```

## Testing Error Handling

### Test Coverage Requirements

```
1. Test each error type:
   ├─> Validation errors (400)
   ├─> Authentication errors (401)
   ├─> Authorization errors (403)
   ├─> Not found errors (404)
   ├─> Conflict errors (409)
   └─> Internal errors (500)

2. Test error response format:
   ├─> Correct status code
   ├─> Correct error code
   ├─> Error message present
   ├─> Request ID present
   ├─> Timestamp present
   └─> Details array (if applicable)

3. Test security:
   ├─> No stack traces in response
   ├─> No sensitive data leaked
   ├─> Generic messages for auth failures
   └─> Proper logging of errors

4. Test edge cases:
   ├─> Malformed JSON in request
   ├─> Missing required headers
   ├─> Invalid content types
   ├─> Oversized payloads
   └─> Database connection failures
```

### Universal Test Pattern (Pseudocode)

```
test('should return 404 for non-existent resource'):
  response = await httpClient.get('/api/users/999')

  assert response.statusCode equals 404
  assert response.body.error.code equals 'NOT_FOUND'
  assert response.body.error.message contains 'not found'
  assert response.body.error.request_id is defined
  assert response.body.error.timestamp is defined

test('should return 400 for validation errors'):
  response = await httpClient.post('/api/users', {
    email: 'invalid-email',
    age: 15
  })

  assert response.statusCode equals 400
  assert response.body.error.code equals 'VALIDATION_ERROR'
  assert response.body.error.details.length >= 2
  assert response.body.error.details contains field 'email'
  assert response.body.error.details contains field 'age'

test('should not expose stack traces in production'):
  // Trigger internal error
  response = await httpClient.get('/api/trigger-error')

  assert response.statusCode equals 500
  assert response.body.error.code equals 'INTERNAL_SERVER_ERROR'
  assert response.body.error.stack is undefined
  assert response.body.error.message equals 'An unexpected error occurred'

test('should include request_id in all error responses'):
  responses = [
    await httpClient.get('/api/users/999'),  // 404
    await httpClient.post('/api/users', {}),  // 400
    await httpClient.get('/api/protected')    // 401
  ]

  for each response in responses:
    assert response.body.error.request_id is defined
    assert response.body.error.request_id matches UUID_PATTERN
```

## Common Pitfalls

### ❌ Pitfall 1: Inconsistent Error Formats
Different endpoints return different error structures:
- `/api/users` returns `{ error: "message" }`
- `/api/orders` returns `{ message: "error", code: 400 }`
- `/api/products` returns `{ errors: [ ... ] }`

### ✅ Solution:
Use centralized error handler middleware that formats ALL errors consistently

### ❌ Pitfall 2: Exposing Internal Details
```
Response: {
  "error": "QueryFailedError: duplicate key value violates unique constraint users_email_key",
  "stack": "at Connection.query (/app/node_modules/pg/lib/connection.js:12)"
}
```

### ✅ Solution:
Catch all errors, log internally with full details, return generic user-facing messages

### ❌ Pitfall 3: Wrong Status Codes
- Returning 500 for validation errors
- Returning 200 with error in body
- Using 401 when should use 403

### ✅ Solution:
Follow HTTP semantics strictly and document status code usage

### ❌ Pitfall 4: Validation One Error at a Time
User fixes one field, submits, gets next error. Repeats 5 times.

### ✅ Solution:
Validate all fields and return all errors in a single response

### ❌ Pitfall 5: No Request Tracing
Customer reports error, no way to find it in logs

### ✅ Solution:
Always include request_id in responses and logs for correlation

## Framework-Specific Implementation Examples

For framework-specific code examples, use the Context7 MCP to fetch documentation:

**TypeScript/Node.js Stacks:**
- Express.js error middleware
- NestJS exception filters
- Hono error handling
- Fastify error hooks

**Python Stacks:**
- FastAPI exception handlers
- Django REST Framework exception handling
- Flask error handlers
- Sanic error handlers

**Java Stacks:**
- Spring Boot @ControllerAdvice
- Micronaut @Error annotations
- Quarkus ExceptionMapper
- JAX-RS ExceptionMapper

**Go Stacks:**
- Gin recovery middleware
- Echo HTTPErrorHandler
- Fiber error handling
- Chi middleware

**.NET Stacks:**
- ASP.NET Core exception middleware
- ASP.NET Core ProblemDetails
- Web API exception filters

**PHP Stacks:**
- Laravel exception handler
- Symfony exception listeners
- Slim error middleware

**Ruby Stacks:**
- Rails rescue_from
- Sinatra error handlers
- Grape error handling

## Reference Resources

**Query Context7 MCP for:**
- "[Your Framework] error handling best practices"
- "[Your Framework] custom exception handlers"
- "[Your Framework] validation error formatting"
- "[Your Framework] middleware error handling"

**Standards:**
- [RFC 7807 - Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807)
- [HTTP Status Code Definitions](https://httpstatuses.com/)
- OWASP API Security - Error Handling

## Implementation Checklist

- [ ] Design consistent error response format
- [ ] Create custom error class hierarchy
- [ ] Implement centralized error handler middleware
- [ ] Add request ID generation and tracking
- [ ] Configure structured logging
- [ ] Implement validation error formatting
- [ ] Add security filters (no stack traces in production)
- [ ] Set up proper HTTP status code mapping
- [ ] Create error code naming convention
- [ ] Test all error types and status codes
- [ ] Test error response format consistency
- [ ] Verify no sensitive data in error responses
- [ ] Document error codes and meanings
- [ ] Set up error monitoring and alerting
