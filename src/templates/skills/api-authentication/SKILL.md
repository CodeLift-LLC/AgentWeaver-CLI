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

## Implementation Examples

### 1. JWT Authentication (Express.js + TypeScript)

```typescript
// types/auth.ts
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// utils/jwt.ts
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateTokenPair = (payload: TokenPayload): TokenPair => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'api.example.com',
    audience: 'api.example.com',
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: 'api.example.com',
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, {
      issuer: 'api.example.com',
      audience: 'api.example.com',
    }) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TOKEN_EXPIRED');
    }
    throw new Error('INVALID_TOKEN');
  }
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'api.example.com',
    }) as { userId: string };
  } catch (error) {
    throw new Error('INVALID_REFRESH_TOKEN');
  }
};

// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    if (error.message === 'TOKEN_EXPIRED') {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired',
        },
      });
    }
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

// routes/auth.ts
import express from 'express';
import bcrypt from 'bcrypt';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';

const router = express.Router();

// Login endpoint
router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      // Increment failed login attempts
      await user.incrementFailedLogins();
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account locked due to too many failed login attempts',
        },
      });
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Reset failed login attempts
    await user.resetFailedLogins();

    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token endpoint
router.post('/auth/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'MISSING_REFRESH_TOKEN',
          message: 'Refresh token is required',
        },
      });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if refresh token exists and is valid
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: payload.userId,
      revoked: false,
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token is invalid or expired',
        },
      });
    }

    // Get user
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    // Generate new token pair
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Revoke old refresh token and store new one
    await storedToken.revoke();
    await RefreshToken.create({
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ data: { tokens } });
  } catch (error) {
    next(error);
  }
});

// Logout endpoint
router.post('/auth/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Revoke refresh token
    await RefreshToken.updateMany(
      { token: refreshToken, userId: req.user.userId },
      { revoked: true }
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
```

### 2. JWT Authentication (FastAPI + Python)

```python
# models/token.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TokenPayload(BaseModel):
    user_id: str
    email: str
    role: str
    exp: datetime

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

# utils/jwt.py
from datetime import datetime, timedelta
from typing import Dict
import jwt
from passlib.context import CryptContext
import os

ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")
REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: Dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp": expire,
        "iss": "api.example.com",
        "aud": "api.example.com"
    })
    return jwt.encode(to_encode, ACCESS_TOKEN_SECRET, algorithm=ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    """Create JWT refresh token"""
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "user_id": user_id,
        "exp": expire,
        "iss": "api.example.com"
    }
    return jwt.encode(to_encode, REFRESH_TOKEN_SECRET, algorithm=ALGORITHM)

def verify_access_token(token: str) -> Dict:
    """Verify and decode access token"""
    try:
        payload = jwt.decode(
            token,
            ACCESS_TOKEN_SECRET,
            algorithms=[ALGORITHM],
            issuer="api.example.com",
            audience="api.example.com"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("TOKEN_EXPIRED")
    except jwt.InvalidTokenError:
        raise ValueError("INVALID_TOKEN")

def verify_refresh_token(token: str) -> Dict:
    """Verify and decode refresh token"""
    try:
        payload = jwt.decode(
            token,
            REFRESH_TOKEN_SECRET,
            algorithms=[ALGORITHM],
            issuer="api.example.com"
        )
        return payload
    except jwt.InvalidTokenError:
        raise ValueError("INVALID_REFRESH_TOKEN")

# dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt import verify_access_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict:
    """Dependency to get current authenticated user"""
    try:
        token = credentials.credentials
        payload = verify_access_token(token)
        return payload
    except ValueError as e:
        if str(e) == "TOKEN_EXPIRED":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Access token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# routes/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from models.token import TokenPair, LoginRequest, RefreshRequest
from models.user import User
from database import get_db
from utils.jwt import (
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token
)
from dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login", response_model=TokenPair)
async def login(request: LoginRequest, db = Depends(get_db)):
    """Authenticate user and return token pair"""
    # Find user
    user = await User.find_by_email(db, request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(request.password, user.password_hash):
        await user.increment_failed_logins(db)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if account is locked
    if user.is_locked:
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account locked due to too many failed login attempts"
        )

    # Generate tokens
    access_token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })
    refresh_token = create_refresh_token(user.id)

    # Store refresh token
    await user.store_refresh_token(db, refresh_token)
    await user.reset_failed_logins(db)

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=900  # 15 minutes
    )

@router.post("/refresh", response_model=TokenPair)
async def refresh(request: RefreshRequest, db = Depends(get_db)):
    """Refresh access token using refresh token"""
    try:
        payload = verify_refresh_token(request.refresh_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Verify refresh token exists and is valid
    user = await User.find_by_id(db, payload["user_id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    is_valid = await user.verify_refresh_token(db, request.refresh_token)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    # Generate new tokens
    access_token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })
    new_refresh_token = create_refresh_token(user.id)

    # Revoke old and store new refresh token
    await user.revoke_refresh_token(db, request.refresh_token)
    await user.store_refresh_token(db, new_refresh_token)

    return TokenPair(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=900
    )

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: RefreshRequest,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Logout user by revoking refresh token"""
    user = await User.find_by_id(db, current_user["user_id"])
    await user.revoke_refresh_token(db, request.refresh_token)
    return None
```

### 3. API Key Authentication

```typescript
// middleware/apiKey.ts
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { ApiKey } from '../models/ApiKey';
import { UnauthorizedError } from '../errors';

export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedError('API key is required');
    }

    // Hash the API key
    const hashedKey = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    // Find API key
    const keyRecord = await ApiKey.findOne({
      keyHash: hashedKey,
      revoked: false,
    });

    if (!keyRecord) {
      throw new UnauthorizedError('Invalid API key');
    }

    // Check expiration
    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('API key has expired');
    }

    // Update last used timestamp
    await keyRecord.updateLastUsed();

    // Attach API key info to request
    req.apiKey = {
      id: keyRecord.id,
      name: keyRecord.name,
      scopes: keyRecord.scopes,
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Generate API key
export const generateApiKey = (): string => {
  // Generate random 32-byte key
  const key = crypto.randomBytes(32).toString('hex');
  return `ak_${key}`;
};

export const hashApiKey = (key: string): string => {
  return crypto.createHash('sha256').update(key).digest('hex');
};
```

## Best Practices

### 1. Token Security

```typescript
// Store tokens securely
// ✅ GOOD - httpOnly cookie (for web apps)
res.cookie('refreshToken', tokens.refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// ❌ BAD - localStorage (vulnerable to XSS)
localStorage.setItem('token', accessToken);
```

### 2. Password Requirements

```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');
```

### 3. Rate Limiting Auth Endpoints

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
});

router.post('/auth/login', authLimiter, loginHandler);
```

### 4. Account Lockout

```typescript
// Lock account after 5 failed attempts
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes

if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
  user.lockedUntil = new Date(Date.now() + LOCK_DURATION);
  await user.save();
}
```

## Testing Authentication

```typescript
describe('JWT Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })
      .expect(200);

    expect(response.body.data.tokens.accessToken).toBeDefined();
    expect(response.body.data.tokens.refreshToken).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' })
      .expect(401);

    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should access protected route with valid token', async () => {
    const token = await generateTestToken();

    await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should reject expired token', async () => {
    const expiredToken = generateExpiredToken();

    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(response.body.error.code).toBe('TOKEN_EXPIRED');
  });

  it('should refresh access token', async () => {
    const { refreshToken } = await loginUser();

    const response = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(response.body.data.tokens.accessToken).toBeDefined();
  });
});
```

## Common Pitfalls

### ❌ Pitfall 1: Storing Passwords in Plain Text
Never store passwords without hashing.

### ✅ Solution:
```typescript
import bcrypt from 'bcrypt';
const passwordHash = await bcrypt.hash(password, 10);
```

### ❌ Pitfall 2: Long-lived Access Tokens
Using access tokens that don't expire creates security risks.

### ✅ Solution:
Use short-lived access tokens (15-30 min) with refresh tokens.

### ❌ Pitfall 3: Not Validating Token Claims
Accepting tokens without verifying issuer, audience, or expiration.

### ✅ Solution:
```typescript
jwt.verify(token, secret, {
  issuer: 'api.example.com',
  audience: 'api.example.com',
});
```

### ❌ Pitfall 4: Exposing Tokens in URLs
Passing tokens as query parameters exposes them in logs.

### ✅ Solution:
Always use Authorization header: `Authorization: Bearer <token>`

## References

- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
