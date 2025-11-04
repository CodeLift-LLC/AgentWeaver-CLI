---
name: API Error Handling
description: Comprehensive patterns for implementing robust error handling in REST APIs including status codes, error responses, logging, and user-friendly messages.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - api
  - error-handling
  - rest
  - http
  - backend
---

# API Error Handling Skill

This skill provides battle-tested patterns for implementing comprehensive error handling in REST APIs that balance developer experience with security.

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

## Implementation Examples

### Express.js (TypeScript)

```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public details?: any[]
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(details: any[]) {
    super(400, 'VALIDATION_ERROR', 'Validation failed', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
  });

  // Handle known AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.id,
      },
    });
  }

  // Handle Joi/Zod validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formatValidationErrors(err),
        timestamp: new Date().toISOString(),
        path: req.path,
        request_id: req.id,
      },
    });
  }

  // Handle unexpected errors (don't leak internal details)
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      path: req.path,
      request_id: req.id,
    },
  });
};

// Usage in routes
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      throw new NotFoundError('User');
    }
    res.json(user);
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

### FastAPI (Python)

```python
# errors/exceptions.py
from typing import Optional, List, Dict, Any
from fastapi import HTTPException
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    field: str
    message: str

class ErrorResponse(BaseModel):
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    timestamp: str
    path: str
    request_id: str

class AppException(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[List[Dict[str, str]]] = None
    ):
        self.code = code
        self.details = details
        super().__init__(status_code=status_code, detail=message)

class ValidationException(AppException):
    def __init__(self, details: List[Dict[str, str]]):
        super().__init__(
            status_code=400,
            code="VALIDATION_ERROR",
            message="Validation failed",
            details=details
        )

class NotFoundException(AppException):
    def __init__(self, resource: str):
        super().__init__(
            status_code=404,
            code="NOT_FOUND",
            message=f"{resource} not found"
        )

# middleware/error_handler.py
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from datetime import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

async def app_exception_handler(request: Request, exc: AppException):
    """Handle custom application exceptions"""
    request_id = request.state.request_id

    logger.error(f"AppException: {exc.code} - {exc.detail}", extra={
        "request_id": request_id,
        "path": request.url.path,
        "method": request.method
    })

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.detail,
                "details": exc.details,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "path": request.url.path,
                "request_id": request_id
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    request_id = request.state.request_id

    details = [
        {
            "field": ".".join(str(loc) for loc in error["loc"][1:]),
            "message": error["msg"]
        }
        for error in exc.errors()
    ]

    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Validation failed",
                "details": details,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "path": request.url.path,
                "request_id": request_id
            }
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    request_id = request.state.request_id

    logger.exception("Unexpected error", extra={
        "request_id": request_id,
        "path": request.url.path,
        "method": request.method
    })

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "path": request.url.path,
                "request_id": request_id
            }
        }
    )

# main.py - Register handlers
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

app = FastAPI()

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Usage in routes
@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    user = await get_user_by_id(user_id)
    if not user:
        raise NotFoundException("User")
    return user
```

## Best Practices

### 1. Consistent Error Format
- Use the same error response structure across all endpoints
- Include request_id for traceability
- Add timestamp for debugging time-sensitive issues

### 2. Appropriate Status Codes
- Use specific 4xx codes for client errors
- Reserve 5xx for actual server errors
- Don't use 500 for validation or authentication failures

### 3. Security Considerations
- **Never expose** stack traces in production
- **Don't leak** sensitive information in error messages
- **Use generic messages** for authentication failures
- **Log details** server-side, return minimal info to client

```javascript
// ❌ BAD - Leaks information
throw new Error('User john@example.com not found in database users table');

// ✅ GOOD - Generic message
throw new NotFoundError('User');
```

### 4. Logging Strategy
- Log all errors with full context
- Include request_id for correlation
- Use structured logging (JSON format)
- Different log levels: error (5xx), warn (4xx), info (success)

### 5. Validation Errors
- Return all validation errors at once (not one at a time)
- Include field names for easy client-side mapping
- Use clear, actionable error messages

## Error Code Conventions

Use a consistent naming convention for error codes:

```
RESOURCE_ACTION_REASON

Examples:
- USER_CREATE_DUPLICATE_EMAIL
- PAYMENT_PROCESS_INSUFFICIENT_FUNDS
- ORDER_UPDATE_INVALID_STATUS
- AUTH_TOKEN_EXPIRED
- RATE_LIMIT_EXCEEDED
```

## Testing Error Handling

```typescript
// Example test suite
describe('Error Handling', () => {
  it('should return 404 for non-existent resource', async () => {
    const response = await request(app)
      .get('/api/users/999')
      .expect(404);

    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toContain('User not found');
  });

  it('should return 400 for validation errors', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid-email' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toHaveLength(1);
    expect(response.body.error.details[0].field).toBe('email');
  });

  it('should include request_id in error response', async () => {
    const response = await request(app)
      .get('/api/users/999')
      .expect(404);

    expect(response.body.error.request_id).toBeDefined();
  });
});
```

## Common Pitfalls

### ❌ Pitfall 1: Inconsistent Error Formats
Different endpoints return different error structures

### ✅ Solution:
Use centralized error handler middleware that formats all errors consistently

### ❌ Pitfall 2: Exposing Internal Details
Returning database errors or stack traces to clients

### ✅ Solution:
Catch all errors, log internally, return generic messages

### ❌ Pitfall 3: Wrong Status Codes
Using 500 for client errors or 200 for errors

### ✅ Solution:
Use HTTP status codes correctly and consistently

## References

- [RFC 7807 - Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807)
- [HTTP Status Code Definitions](https://httpstatuses.com/)
- [REST API Error Handling Best Practices](https://www.baeldung.com/rest-api-error-handling-best-practices)
