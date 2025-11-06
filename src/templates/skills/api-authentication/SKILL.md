---
name: API Authentication
description: Comprehensive patterns for implementing secure authentication in REST APIs including JWT, OAuth, API keys, and session-based authentication.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - api
  - authentication
  - security
  - jwt
  - oauth
  - backend
mcp-servers:
  - socket
  - context7
---

# API Authentication Skill

This skill provides production-ready patterns for implementing secure authentication mechanisms in REST APIs, covering JWT tokens, OAuth 2.0, API keys, and session-based authentication.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Select the appropriate authentication strategy (JWT, OAuth, API keys), implement secure token generation/validation, add authentication middleware, test with various scenarios, and validate security requirements are met.

**Additional tools available**:
- Use Socket MCP to scan authentication dependencies for vulnerabilities
- Use Context7 MCP for framework-specific authentication documentation

## When to Use

- Building secure REST API endpoints requiring user authentication
- Implementing token-based authentication for stateless APIs
- Setting up OAuth 2.0 for third-party integrations
- Creating API key authentication for service-to-service communication
- Implementing session-based authentication for traditional web apps
- Managing authentication tokens (refresh, revoke, rotate)

## Core Concepts

### Authentication vs Authorization

**Authentication**: Verifying identity (who you are)
**Authorization**: Verifying permissions (what you can do)

This skill focuses on authentication patterns. Combine with authorization middleware for complete access control.

### Authentication Patterns Comparison

| Pattern | Best For | Pros | Cons |
|---------|----------|------|------|
| **JWT** | Stateless APIs, microservices | Scalable, self-contained | Can't revoke easily, token size |
| **OAuth 2.0** | Third-party integrations | Standard protocol, flexible | Complex setup, requires SSL |
| **API Keys** | Service-to-service | Simple, easy to rotate | Less secure for user auth |
| **Sessions** | Server-rendered apps | Easy revocation | Requires state, less scalable |

### Security Fundamentals

1. **Always use HTTPS** in production
2. **Hash passwords** with bcrypt/argon2 (never store plaintext)
3. **Use secure token storage** (httpOnly cookies or secure storage)
4. **Implement rate limiting** on auth endpoints
5. **Add CSRF protection** for session-based auth
6. **Use short-lived access tokens** with refresh tokens
7. **Implement account lockout** after failed attempts

## Universal Implementation Pattern

### 1. JWT Authentication Pattern (Language-Agnostic)

#### Conceptual Flow

```
1. User Registration:
   ├─> Receive credentials (email, password)
   ├─> Validate input format
   ├─> Check if user already exists
   ├─> Hash password (bcrypt/argon2)
   └─> Store user in database

2. User Login:
   ├─> Receive credentials
   ├─> Find user by email
   ├─> Compare hashed password
   ├─> Generate access token (short-lived, e.g., 15min)
   ├─> Generate refresh token (long-lived, e.g., 7 days)
   └─> Return tokens to client

3. Protected Route Access:
   ├─> Extract token from request (header/cookie)
   ├─> Verify token signature
   ├─> Decode token payload
   ├─> Validate expiration
   ├─> Extract user info
   └─> Proceed to route handler

4. Token Refresh:
   ├─> Receive refresh token
   ├─> Verify refresh token
   ├─> Check if revoked (optional)
   ├─> Generate new access token
   └─> Return new access token
```

#### Data Structures

**Token Payload Structure:**
```
{
  userId: <unique identifier>,
  email: <user email>,
  role: <user role/permissions>,
  iat: <issued at timestamp>,
  exp: <expiration timestamp>
}
```

**Token Pair Response:**
```
{
  accessToken: <short-lived JWT>,
  refreshToken: <long-lived JWT or opaque token>,
  expiresIn: <seconds until expiration>,
  tokenType: "Bearer"
}
```

#### Core Functions (Pseudocode)

**Generate Token:**
```
function generateToken(payload, secret, expiresIn):
  token = JWT.sign(payload, secret, {
    expiresIn: expiresIn,
    algorithm: 'HS256' // or RS256 for asymmetric
  })
  return token
```

**Verify Token:**
```
function verifyToken(token, secret):
  try:
    payload = JWT.verify(token, secret)
    return { valid: true, payload: payload }
  catch (error):
    return { valid: false, error: error.message }
```

**Hash Password:**
```
function hashPassword(plainPassword, saltRounds = 10):
  salt = generateSalt(saltRounds)
  hash = bcrypt.hash(plainPassword, salt)
  return hash
```

**Compare Password:**
```
function comparePassword(plainPassword, hashedPassword):
  isMatch = bcrypt.compare(plainPassword, hashedPassword)
  return isMatch
```

#### Middleware Pattern (Pseudocode)

```
function authenticationMiddleware(request, response, next):
  // 1. Extract token from header or cookie
  authHeader = request.headers['authorization']
  if not authHeader:
    return response.status(401).json({ error: 'No token provided' })

  token = authHeader.replace('Bearer ', '')

  // 2. Verify token
  result = verifyToken(token, SECRET_KEY)

  if not result.valid:
    return response.status(401).json({ error: 'Invalid or expired token' })

  // 3. Attach user to request
  request.user = result.payload

  // 4. Proceed to next handler
  next()
```

#### API Endpoints Pattern

```
POST /auth/register
  Body: { email, password, name }
  Response: { user: { id, email, name }, tokens: TokenPair }

POST /auth/login
  Body: { email, password }
  Response: { user: { id, email, name }, tokens: TokenPair }

POST /auth/refresh
  Body: { refreshToken }
  Response: { accessToken, expiresIn }

POST /auth/logout
  Headers: { Authorization: "Bearer <token>" }
  Response: { message: "Logged out successfully" }

GET /auth/me
  Headers: { Authorization: "Bearer <token>" }
  Response: { user: { id, email, name, role } }
```

### 2. OAuth 2.0 Pattern (Language-Agnostic)

#### OAuth Flow Types

**Authorization Code Flow (Most Common):**
```
1. Client redirects user to OAuth provider:
   → GET /oauth/authorize?client_id=...&redirect_uri=...&scope=...&state=...

2. User authenticates with provider

3. Provider redirects back with auth code:
   → GET /callback?code=...&state=...

4. Client exchanges code for tokens:
   → POST /oauth/token
   Body: { code, client_id, client_secret, redirect_uri }
   Response: { access_token, refresh_token, expires_in }

5. Client uses access token:
   → GET /api/resource
   Headers: { Authorization: "Bearer <access_token>" }
```

**Client Credentials Flow (Machine-to-Machine):**
```
1. Application requests token:
   → POST /oauth/token
   Body: { grant_type: "client_credentials", client_id, client_secret, scope }

2. Provider returns access token:
   Response: { access_token, expires_in, token_type: "Bearer" }

3. Application uses token:
   → GET /api/resource
   Headers: { Authorization: "Bearer <access_token>" }
```

### 3. API Key Authentication Pattern

#### Conceptual Flow

```
1. Generate API Key:
   ├─> Create random secure string (32+ chars)
   ├─> Hash the key before storing
   ├─> Store hashed key with metadata (user_id, scopes, created_at)
   └─> Return plain key once (never shown again)

2. Authenticate Request:
   ├─> Extract API key from header (X-API-Key)
   ├─> Hash the provided key
   ├─> Find matching hashed key in database
   ├─> Verify not expired
   ├─> Attach user/service context
   └─> Proceed to handler

3. Key Rotation:
   ├─> Generate new key
   ├─> Mark old key as deprecated (grace period)
   ├─> After grace period, revoke old key
```

#### API Key Middleware Pattern

```
function apiKeyMiddleware(request, response, next):
  // 1. Extract API key
  apiKey = request.headers['x-api-key']

  if not apiKey:
    return response.status(401).json({ error: 'API key required' })

  // 2. Hash and lookup
  hashedKey = hash(apiKey)
  keyRecord = database.findApiKey(hashedKey)

  if not keyRecord or keyRecord.revoked:
    return response.status(401).json({ error: 'Invalid API key' })

  // 3. Check expiration
  if keyRecord.expiresAt < now():
    return response.status(401).json({ error: 'API key expired' })

  // 4. Attach context
  request.apiKey = keyRecord
  request.user = keyRecord.user

  // 5. Log usage (optional)
  logApiKeyUsage(keyRecord.id, request.path)

  next()
```

### 4. Session-Based Authentication Pattern

#### Conceptual Flow

```
1. Login:
   ├─> Verify credentials
   ├─> Create session in session store
   ├─> Generate session ID (secure random)
   ├─> Store session data: { userId, role, createdAt, expiresAt }
   ├─> Set httpOnly cookie with session ID
   └─> Return success

2. Subsequent Requests:
   ├─> Extract session ID from cookie
   ├─> Lookup session in session store
   ├─> Verify not expired
   ├─> Load user data
   ├─> Refresh session expiration (sliding)
   └─> Proceed to handler

3. Logout:
   ├─> Extract session ID
   ├─> Delete session from store
   ├─> Clear cookie
   └─> Return success
```

## Security Best Practices

### Token Storage (Client-Side)

**Web Applications:**
- ✅ **Recommended**: HttpOnly cookies for auth tokens (prevents XSS)
- ⚠️ **Acceptable**: localStorage/sessionStorage (vulnerable to XSS)
- ❌ **Avoid**: Storing tokens in plain JavaScript variables

**Mobile/Desktop Apps:**
- Use secure storage (Keychain on iOS, Keystore on Android)
- Encrypt tokens before storage
- Clear tokens on app termination if required

### Rate Limiting

```
Rate Limit Configuration:
├─> Login endpoint: 5 attempts per 15 minutes per IP
├─> Registration: 3 attempts per hour per IP
├─> Password reset: 3 attempts per hour per email
└─> Token refresh: 10 requests per minute per user
```

### CSRF Protection (for Cookie-Based Auth)

```
1. Generate CSRF token on login
2. Store in session
3. Send to client (separate from auth cookie)
4. Require CSRF token in request headers for state-changing operations
5. Validate CSRF token matches session
```

### Password Requirements

```
Minimum Requirements:
├─> Length: 12+ characters
├─> Complexity: Mix of uppercase, lowercase, numbers, symbols
├─> Check against common passwords list
├─> Check against previous passwords (history)
└─> Enforce password expiration (optional, 90 days)
```

## Testing Strategies

### Test Cases to Cover

1. **Registration Tests:**
   - Valid registration succeeds
   - Duplicate email rejected
   - Weak password rejected
   - Invalid email format rejected

2. **Login Tests:**
   - Valid credentials succeed and return tokens
   - Invalid password fails
   - Non-existent user fails
   - Account locked after X failed attempts

3. **Token Tests:**
   - Valid token grants access
   - Expired token rejected
   - Invalid signature rejected
   - Missing token rejected
   - Refresh token successfully generates new access token

4. **Authorization Tests:**
   - Authenticated user can access protected routes
   - Unauthenticated user redirected/rejected
   - Tokens work across different API endpoints

5. **Security Tests:**
   - Tokens expire correctly
   - Rate limiting prevents brute force
   - HTTPS enforced in production
   - Password hashing verified (never store plain)

## Common Pitfalls

❌ **Don't:**
- Store passwords in plaintext
- Use weak JWT secrets (use 256+ bit random strings)
- Allow unlimited login attempts
- Store sensitive data in JWT payload
- Use HTTP in production
- Implement your own crypto (use established libraries)

✅ **Do:**
- Use proven authentication libraries for your stack
- Implement proper error handling
- Log authentication events for security monitoring
- Use environment variables for secrets
- Implement token refresh mechanism
- Test thoroughly including edge cases

## Framework-Specific Implementation Examples

For framework-specific code examples, use the Context7 MCP to fetch documentation:

**TypeScript/Node.js Stacks:**
- Express.js + Passport.js
- NestJS with JWT guards
- Hono with JWT middleware

**Python Stacks:**
- FastAPI + python-jose
- Django REST Framework + SimpleJWT
- Flask + Flask-JWT-Extended

**Java Stacks:**
- Spring Boot + Spring Security
- Micronaut Security
- Quarkus with SmallRye JWT

**Go Stacks:**
- Gin + jwt-go
- Echo + JWT middleware
- Fiber + JWT

**.NET Stacks:**
- ASP.NET Core Identity
- ASP.NET Core JWT Bearer

**PHP Stacks:**
- Laravel Sanctum/Passport
- Symfony Security

**Ruby Stacks:**
- Rails + Devise
- Rails + JWT (jwt gem)

## Reference Resources

**Query Context7 MCP for:**
- "[Your Framework] JWT authentication best practices"
- "[Your Framework] OAuth 2.0 implementation"
- "[Your ORM] password hashing with bcrypt"
- "[Your Framework] authentication middleware patterns"

**Security Standards:**
- OWASP Authentication Cheat Sheet
- OAuth 2.0 RFC 6749
- JWT RFC 7519
- NIST Password Guidelines

## Implementation Checklist

- [ ] Choose authentication strategy (JWT/OAuth/API Key/Session)
- [ ] Implement secure password hashing (bcrypt/argon2)
- [ ] Create token generation utilities
- [ ] Implement token verification middleware
- [ ] Add registration endpoint with validation
- [ ] Add login endpoint with credential verification
- [ ] Add token refresh endpoint
- [ ] Add logout endpoint (if applicable)
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection (if using cookies)
- [ ] Use HTTPS in production
- [ ] Test all authentication flows
- [ ] Test error cases and security scenarios
- [ ] Scan dependencies for vulnerabilities (use Socket MCP)
- [ ] Document API endpoints and token format
