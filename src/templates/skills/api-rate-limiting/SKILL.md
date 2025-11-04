---
name: API Rate Limiting
description: Production-ready patterns for implementing rate limiting in REST APIs using token bucket, sliding window, and fixed window algorithms.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - api
  - rate-limiting
  - performance
  - security
  - scalability
  - backend
---

# API Rate Limiting Skill

This skill provides comprehensive patterns for implementing rate limiting in REST APIs to protect against abuse, ensure fair resource usage, and maintain API performance.

## When to Use

- Protecting API endpoints from abuse and DDoS attacks
- Ensuring fair usage across multiple clients
- Preventing brute force attacks on authentication endpoints
- Managing API costs and resource consumption
- Implementing tiered access (free vs premium)
- Complying with downstream API rate limits

## Core Concepts

### Rate Limiting Algorithms

#### 1. Fixed Window Counter
Counts requests in fixed time windows (e.g., 100 requests per hour).

**Pros:**
- Simple to implement
- Low memory usage
- Easy to understand

**Cons:**
- Boundary issue: users can make 2x requests at window edges
- Doesn't distribute load evenly

#### 2. Sliding Window Log
Tracks timestamp of each request and counts requests in rolling window.

**Pros:**
- Accurate rate limiting
- No boundary issues
- Fair distribution

**Cons:**
- Higher memory usage (stores all timestamps)
- More complex cleanup logic

#### 3. Sliding Window Counter
Hybrid approach combining fixed window and sliding window.

**Pros:**
- Accurate like sliding log
- Lower memory than sliding log
- Smooth rate limiting

**Cons:**
- Slightly more complex calculation
- Requires two counters

#### 4. Token Bucket (Recommended)
Bucket holds tokens, requests consume tokens, bucket refills at steady rate.

**Pros:**
- Allows bursts while maintaining average rate
- Industry standard (AWS, Google Cloud)
- Flexible and intuitive

**Cons:**
- Requires tracking token count and last refill time
- Slightly more complex than fixed window

### Rate Limit Headers (Standard)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
Retry-After: 3600
```

### HTTP Status Codes

- `429 Too Many Requests`: Rate limit exceeded
- `503 Service Unavailable`: Server overloaded (with Retry-After)

## Implementation Examples

### 1. Token Bucket (Express.js + TypeScript)

```typescript
// types/rateLimit.ts
export interface RateLimitConfig {
  points: number;        // Number of tokens in bucket
  duration: number;      // Time window in seconds
  blockDuration?: number; // How long to block after limit exceeded
}

export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}

// utils/rateLimiter.ts
import { RateLimitConfig, RateLimitInfo } from '../types/rateLimit';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async consume(key: string, points: number = 1): Promise<RateLimitInfo> {
    const now = Date.now();
    const bucket = this.getBucket(key);

    // Refill tokens based on time elapsed
    const refillInterval = this.config.duration * 1000;
    const timeSinceRefill = now - bucket.lastRefill;
    const tokensToAdd = (timeSinceRefill / refillInterval) * this.config.points;

    bucket.tokens = Math.min(
      this.config.points,
      bucket.tokens + tokensToAdd
    );
    bucket.lastRefill = now;

    // Try to consume tokens
    if (bucket.tokens >= points) {
      bucket.tokens -= points;
      this.buckets.set(key, bucket);

      return {
        remaining: Math.floor(bucket.tokens),
        reset: new Date(now + refillInterval),
        limit: this.config.points,
      };
    }

    // Not enough tokens
    const resetTime = bucket.lastRefill + refillInterval;
    throw new RateLimitExceededError({
      remaining: 0,
      reset: new Date(resetTime),
      limit: this.config.points,
      retryAfter: Math.ceil((resetTime - now) / 1000),
    });
  }

  private getBucket(key: string): TokenBucket {
    const existing = this.buckets.get(key);
    if (existing) return existing;

    const newBucket: TokenBucket = {
      tokens: this.config.points,
      lastRefill: Date.now(),
    };
    this.buckets.set(key, newBucket);
    return newBucket;
  }

  // Cleanup old buckets (run periodically)
  cleanup(): void {
    const now = Date.now();
    const maxAge = this.config.duration * 2 * 1000;

    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(key);
      }
    }
  }
}

// errors/RateLimitExceededError.ts
export class RateLimitExceededError extends Error {
  constructor(public info: RateLimitInfo & { retryAfter: number }) {
    super('Rate limit exceeded');
  }
}

// middleware/rateLimit.ts
import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from '../utils/rateLimiter';
import { RateLimitExceededError } from '../errors';

// Create different rate limiters for different use cases
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new RateLimiter({ points: 100, duration: 60 }),

  // Auth endpoints: 5 requests per 15 minutes
  auth: new RateLimiter({ points: 5, duration: 900 }),

  // Premium tier: 1000 requests per minute
  premium: new RateLimiter({ points: 1000, duration: 60 }),

  // Heavy operations: 10 requests per hour
  heavy: new RateLimiter({ points: 10, duration: 3600 }),
};

export const createRateLimitMiddleware = (limiter: RateLimiter) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use IP address or user ID as key
      const key = req.user?.id || req.ip;

      // Consume 1 token
      const info = await limiter.consume(key);

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': info.limit.toString(),
        'X-RateLimit-Remaining': info.remaining.toString(),
        'X-RateLimit-Reset': Math.floor(info.reset.getTime() / 1000).toString(),
      });

      next();
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        res.set({
          'X-RateLimit-Limit': error.info.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.floor(error.info.reset.getTime() / 1000).toString(),
          'Retry-After': error.info.retryAfter.toString(),
        });

        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
            retryAfter: error.info.retryAfter,
          },
        });
      }
      next(error);
    }
  };
};

// Usage in routes
import express from 'express';
const app = express();

// Apply to all routes
app.use(createRateLimitMiddleware(rateLimiters.api));

// Apply to specific routes
app.post('/auth/login',
  createRateLimitMiddleware(rateLimiters.auth),
  loginHandler
);

app.post('/reports/generate',
  createRateLimitMiddleware(rateLimiters.heavy),
  generateReportHandler
);
```

### 2. Redis-Based Rate Limiting (Express.js + TypeScript)

```typescript
// utils/redisRateLimiter.ts
import Redis from 'ioredis';
import { RateLimitConfig, RateLimitInfo } from '../types/rateLimit';

export class RedisRateLimiter {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(redis: Redis, config: RateLimitConfig) {
    this.redis = redis;
    this.config = config;
  }

  async consume(key: string, points: number = 1): Promise<RateLimitInfo> {
    const redisKey = `ratelimit:${key}`;
    const now = Date.now();
    const windowStart = now - (this.config.duration * 1000);

    // Use Redis sorted set for sliding window
    const multi = this.redis.multi();

    // Remove old entries
    multi.zremrangebyscore(redisKey, 0, windowStart);

    // Count current requests
    multi.zcard(redisKey);

    // Add current request
    multi.zadd(redisKey, now, `${now}-${Math.random()}`);

    // Set expiry
    multi.expire(redisKey, this.config.duration * 2);

    const results = await multi.exec();
    const currentCount = (results![1][1] as number) + points;

    if (currentCount > this.config.points) {
      // Calculate reset time
      const oldestEntry = await this.redis.zrange(redisKey, 0, 0, 'WITHSCORES');
      const resetTime = oldestEntry.length > 0
        ? parseInt(oldestEntry[1]) + (this.config.duration * 1000)
        : now + (this.config.duration * 1000);

      throw new RateLimitExceededError({
        remaining: 0,
        reset: new Date(resetTime),
        limit: this.config.points,
        retryAfter: Math.ceil((resetTime - now) / 1000),
      });
    }

    return {
      remaining: this.config.points - currentCount,
      reset: new Date(now + (this.config.duration * 1000)),
      limit: this.config.points,
    };
  }
}

// Alternative: Token Bucket with Redis
export class RedisTokenBucket {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(redis: Redis, config: RateLimitConfig) {
    this.redis = redis;
    this.config = config;
  }

  async consume(key: string, points: number = 1): Promise<RateLimitInfo> {
    const redisKey = `tokenbucket:${key}`;

    // Lua script for atomic token bucket operation
    const script = `
      local key = KEYS[1]
      local capacity = tonumber(ARGV[1])
      local refill_rate = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local requested = tonumber(ARGV[4])

      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or capacity
      local last_refill = tonumber(bucket[2]) or now

      -- Refill tokens
      local time_passed = now - last_refill
      local tokens_to_add = time_passed * refill_rate
      tokens = math.min(capacity, tokens + tokens_to_add)

      -- Try to consume
      if tokens >= requested then
        tokens = tokens - requested
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, 3600)
        return {1, tokens}
      else
        return {0, tokens}
      end
    `;

    const capacity = this.config.points;
    const refillRate = capacity / this.config.duration;
    const now = Date.now() / 1000;

    const result = await this.redis.eval(
      script,
      1,
      redisKey,
      capacity,
      refillRate,
      now,
      points
    ) as [number, number];

    const [success, remaining] = result;

    if (success === 1) {
      return {
        remaining: Math.floor(remaining),
        reset: new Date((now + this.config.duration) * 1000),
        limit: capacity,
      };
    }

    const resetTime = (now + this.config.duration) * 1000;
    throw new RateLimitExceededError({
      remaining: 0,
      reset: new Date(resetTime),
      limit: capacity,
      retryAfter: this.config.duration,
    });
  }
}
```

### 3. FastAPI Rate Limiting (Python)

```python
# utils/rate_limiter.py
from datetime import datetime, timedelta
from typing import Dict, Optional
import time
import asyncio
from dataclasses import dataclass

@dataclass
class RateLimitInfo:
    remaining: int
    reset: datetime
    limit: int

@dataclass
class TokenBucket:
    tokens: float
    last_refill: float

class RateLimitExceeded(Exception):
    def __init__(self, info: RateLimitInfo, retry_after: int):
        self.info = info
        self.retry_after = retry_after
        super().__init__("Rate limit exceeded")

class RateLimiter:
    def __init__(self, points: int, duration: int):
        """
        Args:
            points: Maximum number of requests
            duration: Time window in seconds
        """
        self.points = points
        self.duration = duration
        self.buckets: Dict[str, TokenBucket] = {}
        self._lock = asyncio.Lock()

    async def consume(self, key: str, points: int = 1) -> RateLimitInfo:
        """Consume tokens from the bucket"""
        async with self._lock:
            now = time.time()
            bucket = self._get_bucket(key)

            # Refill tokens
            refill_interval = self.duration
            time_since_refill = now - bucket.last_refill
            tokens_to_add = (time_since_refill / refill_interval) * self.points

            bucket.tokens = min(self.points, bucket.tokens + tokens_to_add)
            bucket.last_refill = now

            # Try to consume
            if bucket.tokens >= points:
                bucket.tokens -= points
                self.buckets[key] = bucket

                return RateLimitInfo(
                    remaining=int(bucket.tokens),
                    reset=datetime.fromtimestamp(now + refill_interval),
                    limit=self.points
                )

            # Not enough tokens
            reset_time = bucket.last_refill + refill_interval
            raise RateLimitExceeded(
                info=RateLimitInfo(
                    remaining=0,
                    reset=datetime.fromtimestamp(reset_time),
                    limit=self.points
                ),
                retry_after=int(reset_time - now)
            )

    def _get_bucket(self, key: str) -> TokenBucket:
        if key in self.buckets:
            return self.buckets[key]

        bucket = TokenBucket(
            tokens=float(self.points),
            last_refill=time.time()
        )
        self.buckets[key] = bucket
        return bucket

    def cleanup(self):
        """Remove old buckets"""
        now = time.time()
        max_age = self.duration * 2

        keys_to_remove = [
            key for key, bucket in self.buckets.items()
            if now - bucket.last_refill > max_age
        ]

        for key in keys_to_remove:
            del self.buckets[key]

# middleware/rate_limit.py
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from utils.rate_limiter import RateLimiter, RateLimitExceeded
from typing import Callable
import time

# Create rate limiters
rate_limiters = {
    "api": RateLimiter(points=100, duration=60),
    "auth": RateLimiter(points=5, duration=900),
    "premium": RateLimiter(points=1000, duration=60),
    "heavy": RateLimiter(points=10, duration=3600),
}

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limiter: RateLimiter):
        super().__init__(app)
        self.limiter = limiter

    async def dispatch(self, request: Request, call_next: Callable):
        # Get key (user ID or IP)
        key = getattr(request.state, "user_id", None) or request.client.host

        try:
            # Consume token
            info = await self.limiter.consume(key)

            # Process request
            response = await call_next(request)

            # Add rate limit headers
            response.headers["X-RateLimit-Limit"] = str(info.limit)
            response.headers["X-RateLimit-Remaining"] = str(info.remaining)
            response.headers["X-RateLimit-Reset"] = str(int(info.reset.timestamp()))

            return response

        except RateLimitExceeded as e:
            return Response(
                content={
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests, please try again later",
                        "retry_after": e.retry_after
                    }
                },
                status_code=429,
                headers={
                    "X-RateLimit-Limit": str(e.info.limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(e.info.reset.timestamp())),
                    "Retry-After": str(e.retry_after)
                }
            )

# Dependency for route-specific rate limiting
from fastapi import Depends

def create_rate_limit_dependency(limiter: RateLimiter):
    async def rate_limit(request: Request):
        key = getattr(request.state, "user_id", None) or request.client.host

        try:
            info = await limiter.consume(key)
            # Store in request state for header injection
            request.state.rate_limit_info = info
        except RateLimitExceeded as e:
            raise HTTPException(
                status_code=429,
                detail={
                    "code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests",
                    "retry_after": e.retry_after
                },
                headers={
                    "Retry-After": str(e.retry_after)
                }
            )

    return rate_limit

# Usage in routes
from fastapi import APIRouter, Depends

router = APIRouter()

auth_rate_limit = create_rate_limit_dependency(rate_limiters["auth"])
heavy_rate_limit = create_rate_limit_dependency(rate_limiters["heavy"])

@router.post("/auth/login", dependencies=[Depends(auth_rate_limit)])
async def login(credentials: LoginRequest):
    # Login logic
    pass

@router.post("/reports/generate", dependencies=[Depends(heavy_rate_limit)])
async def generate_report(params: ReportParams):
    # Report generation logic
    pass
```

## Best Practices

### 1. Choose the Right Algorithm

```typescript
// Use token bucket for general API rate limiting
const apiLimiter = new RateLimiter({ points: 100, duration: 60 });

// Use strict fixed window for sensitive operations
const authLimiter = new RateLimiter({ points: 5, duration: 900 });
```

### 2. Tiered Rate Limits

```typescript
const getRateLimiter = (user: User): RateLimiter => {
  switch (user.tier) {
    case 'free':
      return rateLimiters.free; // 100/min
    case 'premium':
      return rateLimiters.premium; // 1000/min
    case 'enterprise':
      return rateLimiters.enterprise; // 10000/min
    default:
      return rateLimiters.api;
  }
};
```

### 3. Multiple Rate Limits

```typescript
// Apply both per-user and global rate limits
const limiter = async (req: Request) => {
  // Per-user limit
  await userLimiter.consume(req.user.id);

  // Global limit (prevent system overload)
  await globalLimiter.consume('global');
};
```

### 4. Rate Limit by Cost

```typescript
// Different operations cost different amounts
const costs = {
  'GET /users': 1,
  'POST /users': 5,
  'POST /reports': 10,
};

const cost = costs[`${req.method} ${req.path}`] || 1;
await limiter.consume(key, cost);
```

### 5. Distributed Rate Limiting

Use Redis for multi-server deployments:

```typescript
// Shared Redis instance across servers
const redis = new Redis(process.env.REDIS_URL);
const limiter = new RedisRateLimiter(redis, { points: 100, duration: 60 });
```

## Testing Rate Limiting

```typescript
describe('Rate Limiting', () => {
  it('should allow requests under the limit', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .get('/api/test')
        .expect(200);
    }
  });

  it('should reject requests over the limit', async () => {
    // Make requests up to limit
    for (let i = 0; i < 100; i++) {
      await request(app).get('/api/test');
    }

    // Next request should be rate limited
    const response = await request(app)
      .get('/api/test')
      .expect(429);

    expect(response.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(response.headers['retry-after']).toBeDefined();
  });

  it('should include rate limit headers', async () => {
    const response = await request(app)
      .get('/api/test')
      .expect(200);

    expect(response.headers['x-ratelimit-limit']).toBeDefined();
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    expect(response.headers['x-ratelimit-reset']).toBeDefined();
  });

  it('should reset after time window', async () => {
    // Consume all tokens
    for (let i = 0; i < 100; i++) {
      await request(app).get('/api/test');
    }

    // Wait for reset
    await sleep(61000); // 61 seconds

    // Should work again
    await request(app)
      .get('/api/test')
      .expect(200);
  });
});
```

## Common Pitfalls

### ❌ Pitfall 1: Not Using Distributed Rate Limiting
In-memory rate limiting doesn't work with multiple servers.

### ✅ Solution:
Use Redis-based rate limiting for multi-server deployments.

### ❌ Pitfall 2: Same Limit for All Endpoints
Treating all endpoints equally can lead to abuse or poor UX.

### ✅ Solution:
```typescript
// Different limits for different endpoints
app.use('/auth', createRateLimitMiddleware(rateLimiters.auth));
app.use('/api', createRateLimitMiddleware(rateLimiters.api));
```

### ❌ Pitfall 3: Not Handling Burst Traffic
Fixed window counters allow 2x requests at boundaries.

### ✅ Solution:
Use token bucket or sliding window for smoother rate limiting.

### ❌ Pitfall 4: Missing Rate Limit Headers
Clients don't know when they can retry.

### ✅ Solution:
Always include X-RateLimit-* and Retry-After headers.

## References

- [IETF Rate Limit Headers Draft](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers)
- [Stripe Rate Limiting](https://stripe.com/docs/rate-limits)
- [AWS Token Bucket Algorithm](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
- [Redis Rate Limiting Patterns](https://redis.io/docs/manual/patterns/rate-limiter/)
