---
name: API Versioning
description: Comprehensive strategies for versioning REST APIs including URL versioning, header versioning, content negotiation, and backward compatibility patterns.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - api
  - versioning
  - rest
  - backward-compatibility
  - api-design
  - backend
mcp-servers:
  - socket
  - context7
---

# API Versioning Skill

This skill provides battle-tested patterns for versioning REST APIs, enabling you to evolve your API while maintaining backward compatibility and a smooth migration path for clients.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Select versioning strategy (URL, header, content negotiation), implement version routing/parsing, create response transformers, add deprecation notices, document migration paths, and test all versions.

**Additional tools available**:
- Use Socket MCP to scan dependencies before adding versioning libraries
- Use Context7 MCP for framework-specific versioning patterns

## When to Use

- Planning to evolve your API over time without breaking existing clients
- Need to make breaking changes while supporting legacy clients
- Managing multiple API versions simultaneously
- Providing deprecation notices and migration paths
- Supporting different API contracts for different client types
- Building public APIs with long-term support commitments

## Core Concepts

### Versioning Strategies Comparison

| Strategy | Example | Pros | Cons | Best For |
|----------|---------|------|------|----------|
| **URL Path** | `/v1/users` | Clear, cacheable, easy routing | URL clutter, multiple routes | Public APIs, clear separation |
| **Query Param** | `/users?version=1` | Flexible, optional | Less visible, caching issues | Internal APIs, gradual rollout |
| **Header** | `Accept: application/vnd.api+json; version=1` | Clean URLs, flexible | Hidden from URL, harder to test | RESTful purists, complex needs |
| **Content Negotiation** | `Accept: application/vnd.api.v1+json` | REST standard, precise | Complex, requires client support | APIs following REST strictly |
| **Subdomain** | `v1.api.example.com` | Complete isolation | DNS/SSL overhead, infrastructure cost | Major version changes only |

### Semantic Versioning for APIs

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (v1 -> v2)
MINOR: New features, backward compatible (v1.0 -> v1.1)
PATCH: Bug fixes, backward compatible (v1.0.0 -> v1.0.1)
```

### What Constitutes a Breaking Change

**Breaking Changes** (require new major version):
- Removing or renaming fields
- Changing field types
- Adding required fields
- Changing response structure
- Removing endpoints
- Changing authentication methods
- Modifying error response format

**Non-Breaking Changes** (can use same version):
- Adding new optional fields
- Adding new endpoints
- Adding new optional query parameters
- Deprecating fields (while still supporting them)
- Performance improvements
- Bug fixes

## Implementation Examples

### 1. URL Path Versioning (Express.js + TypeScript)

```typescript
// types/version.ts
export type ApiVersion = 'v1' | 'v2' | 'v3';

export interface VersionedRequest extends Request {
  apiVersion: ApiVersion;
}

// middleware/versionRouter.ts
import { Router, Request, Response, NextFunction } from 'express';
import { VersionedRequest } from '../types/version';

export const createVersionRouter = () => {
  const router = Router();

  // Extract version from URL
  router.use('/:version(v\\d+)/*', (req: VersionedRequest, res, next) => {
    req.apiVersion = req.params.version as ApiVersion;
    next();
  });

  return router;
};

// routes/v1/users.ts
import { Router } from 'express';

const router = Router();

// V1 User structure
interface UserV1 {
  id: string;
  name: string;
  email: string;
}

router.get('/users/:id', async (req, res) => {
  const user = await getUserById(req.params.id);

  // V1 response format
  const response: UserV1 = {
    id: user.id,
    name: user.fullName,
    email: user.email,
  };

  res.json(response);
});

router.post('/users', async (req, res) => {
  const { name, email } = req.body;

  const user = await createUser({
    fullName: name,
    email,
  });

  res.status(201).json({
    id: user.id,
    name: user.fullName,
    email: user.email,
  });
});

export default router;

// routes/v2/users.ts
import { Router } from 'express';

const router = Router();

// V2 User structure (breaking change: split name into firstName/lastName)
interface UserV2 {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; // Added in V2
}

router.get('/users/:id', async (req, res) => {
  const user = await getUserById(req.params.id);

  // V2 response format
  const response: UserV2 = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };

  res.json(response);
});

router.post('/users', async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const user = await createUser({
    firstName,
    lastName,
    email,
  });

  res.status(201).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;

// app.ts
import express from 'express';
import usersV1 from './routes/v1/users';
import usersV2 from './routes/v2/users';

const app = express();

// Mount versioned routes
app.use('/v1', usersV1);
app.use('/v2', usersV2);

// Default to latest version
app.use('/users', usersV2);

// Version deprecation warnings
app.use('/v1/*', (req, res, next) => {
  res.set('X-API-Deprecation', 'V1 will be deprecated on 2025-12-31');
  res.set('X-API-Sunset', '2025-12-31');
  next();
});

export default app;
```

### 2. Header-Based Versioning (Express.js + TypeScript)

```typescript
// middleware/headerVersion.ts
import { Request, Response, NextFunction } from 'express';
import { VersionedRequest, ApiVersion } from '../types/version';

const SUPPORTED_VERSIONS: ApiVersion[] = ['v1', 'v2', 'v3'];
const DEFAULT_VERSION: ApiVersion = 'v3';

export const parseApiVersion = (
  req: VersionedRequest,
  res: Response,
  next: NextFunction
) => {
  // Try custom header first
  let version = req.headers['x-api-version'] as string;

  // Fall back to Accept header content negotiation
  if (!version) {
    const accept = req.headers.accept || '';
    const match = accept.match(/application\/vnd\.api\.(v\d+)\+json/);
    version = match?.[1] || DEFAULT_VERSION;
  }

  // Validate version
  if (!SUPPORTED_VERSIONS.includes(version as ApiVersion)) {
    return res.status(400).json({
      error: {
        code: 'UNSUPPORTED_API_VERSION',
        message: `API version ${version} is not supported`,
        supportedVersions: SUPPORTED_VERSIONS,
      },
    });
  }

  req.apiVersion = version as ApiVersion;
  res.set('X-API-Version', version);

  next();
};

// routes/users.ts
import { Router } from 'express';
import { parseApiVersion } from '../middleware/headerVersion';
import { VersionedRequest } from '../types/version';

const router = Router();

router.use(parseApiVersion);

router.get('/users/:id', async (req: VersionedRequest, res) => {
  const user = await getUserById(req.params.id);

  // Transform based on version
  const response = transformUser(user, req.apiVersion);

  res.json(response);
});

// transformers/userTransformer.ts
import { ApiVersion } from '../types/version';

export const transformUser = (user: User, version: ApiVersion) => {
  switch (version) {
    case 'v1':
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
      };

    case 'v2':
    case 'v3':
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        ...(version === 'v3' && { profile: user.profile }), // V3 addition
      };

    default:
      throw new Error(`Unsupported version: ${version}`);
  }
};

export const transformUserList = (users: User[], version: ApiVersion) => {
  return users.map(user => transformUser(user, version));
};
```

### 3. Content Negotiation Versioning (FastAPI + Python)

```python
# types/version.py
from enum import Enum
from typing import Literal

ApiVersion = Literal["v1", "v2", "v3"]

class ApiVersionEnum(str, Enum):
    V1 = "v1"
    V2 = "v2"
    V3 = "v3"

# middleware/version.py
from fastapi import Request, Header, HTTPException
from typing import Optional
import re

SUPPORTED_VERSIONS = ["v1", "v2", "v3"]
DEFAULT_VERSION = "v3"

def parse_version_from_accept(accept: str) -> Optional[str]:
    """Parse version from Accept header content negotiation"""
    # application/vnd.api.v2+json
    match = re.search(r'application/vnd\.api\.(v\d+)\+json', accept)
    return match.group(1) if match else None

async def get_api_version(
    request: Request,
    x_api_version: Optional[str] = Header(None),
    accept: Optional[str] = Header(None)
) -> str:
    """Extract and validate API version from headers"""
    # Priority: X-API-Version header > Accept header > default
    version = x_api_version

    if not version and accept:
        version = parse_version_from_accept(accept)

    version = version or DEFAULT_VERSION

    if version not in SUPPORTED_VERSIONS:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "UNSUPPORTED_API_VERSION",
                "message": f"API version {version} is not supported",
                "supported_versions": SUPPORTED_VERSIONS
            }
        )

    request.state.api_version = version
    return version

# models/user.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# V1 Models
class UserV1(BaseModel):
    id: str
    name: str
    email: str

class CreateUserV1(BaseModel):
    name: str
    email: str

# V2 Models
class UserV2(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    created_at: datetime

class CreateUserV2(BaseModel):
    first_name: str
    last_name: str
    email: str

# V3 Models
class UserProfileV3(BaseModel):
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserV3(UserV2):
    profile: Optional[UserProfileV3] = None

class CreateUserV3(CreateUserV2):
    profile: Optional[UserProfileV3] = None

# transformers/user_transformer.py
from typing import Union
from models.user import UserV1, UserV2, UserV3
from database.models import User

def transform_user(user: User, version: str) -> Union[UserV1, UserV2, UserV3]:
    """Transform user model based on API version"""
    if version == "v1":
        return UserV1(
            id=user.id,
            name=user.full_name,
            email=user.email
        )

    elif version == "v2":
        return UserV2(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            created_at=user.created_at
        )

    elif version == "v3":
        return UserV3(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            created_at=user.created_at,
            profile=UserProfileV3(
                bio=user.bio,
                avatar_url=user.avatar_url
            ) if user.bio or user.avatar_url else None
        )

    raise ValueError(f"Unsupported version: {version}")

# routes/users.py
from fastapi import APIRouter, Depends, Request, Response
from typing import Union
from middleware.version import get_api_version
from models.user import UserV1, UserV2, UserV3
from transformers.user_transformer import transform_user
from database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}")
async def get_user(
    user_id: str,
    request: Request,
    response: Response,
    version: str = Depends(get_api_version),
    db = Depends(get_db)
) -> Union[UserV1, UserV2, UserV3]:
    """Get user by ID (version-aware)"""
    # Set version header in response
    response.headers["X-API-Version"] = version

    # Fetch user from database
    user = await User.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Transform based on version
    return transform_user(user, version)

@router.post("/", status_code=201)
async def create_user(
    request: Request,
    response: Response,
    version: str = Depends(get_api_version),
    db = Depends(get_db)
) -> Union[UserV1, UserV2, UserV3]:
    """Create user (version-aware)"""
    response.headers["X-API-Version"] = version

    # Parse request body based on version
    body = await request.json()

    if version == "v1":
        # V1: single name field
        user = await User.create(
            db,
            full_name=body["name"],
            email=body["email"]
        )
    else:
        # V2+: first_name and last_name
        user = await User.create(
            db,
            first_name=body["first_name"],
            last_name=body["last_name"],
            email=body["email"],
            bio=body.get("profile", {}).get("bio") if version == "v3" else None,
            avatar_url=body.get("profile", {}).get("avatar_url") if version == "v3" else None
        )

    return transform_user(user, version)

# main.py
from fastapi import FastAPI
from routes import users

app = FastAPI()

# Middleware to add deprecation warnings
@app.middleware("http")
async def add_deprecation_headers(request, call_next):
    response = await call_next(request)

    version = getattr(request.state, "api_version", None)
    if version == "v1":
        response.headers["X-API-Deprecation"] = "V1 will be deprecated on 2025-12-31"
        response.headers["X-API-Sunset"] = "2025-12-31"
        response.headers["Link"] = '</docs/migration/v1-to-v2>; rel="deprecation"'

    return response

app.include_router(users.router)
```

### 4. Version Migration Strategy

```typescript
// utils/migration.ts
export interface MigrationPath {
  from: ApiVersion;
  to: ApiVersion;
  guide: string;
  breakingChanges: string[];
  deadline?: Date;
}

export const migrations: MigrationPath[] = [
  {
    from: 'v1',
    to: 'v2',
    guide: '/docs/migration/v1-to-v2',
    breakingChanges: [
      'User.name split into firstName and lastName',
      'Added required createdAt field to all resources',
      'Changed error response format',
    ],
    deadline: new Date('2025-12-31'),
  },
  {
    from: 'v2',
    to: 'v3',
    guide: '/docs/migration/v2-to-v3',
    breakingChanges: [
      'Added profile object to User',
      'Pagination now uses cursor-based instead of offset',
    ],
  },
];

// Endpoint to get migration information
router.get('/versions', (req, res) => {
  res.json({
    current: 'v3',
    supported: ['v1', 'v2', 'v3'],
    deprecated: ['v1'],
    migrations,
  });
});
```

## Best Practices

### 1. Choose the Right Versioning Strategy

```typescript
// For public APIs with many clients
app.use('/v1', v1Routes); // URL path versioning

// For internal APIs or microservices
app.use(parseApiVersion); // Header-based versioning
```

### 2. Provide Clear Deprecation Notices

```typescript
// Set deprecation headers
res.set({
  'X-API-Deprecation': 'This version will be deprecated on 2025-12-31',
  'X-API-Sunset': '2025-12-31',
  'Link': '</docs/migration>; rel="deprecation"',
});

// Log deprecated API usage
logger.warn('Deprecated API version used', {
  version: req.apiVersion,
  endpoint: req.path,
  clientId: req.user?.id,
});
```

### 3. Version Only What Changes

```typescript
// Don't version everything - use transformers
const transformUser = (user: User, version: ApiVersion) => {
  const base = {
    id: user.id,
    email: user.email,
  };

  if (version === 'v1') {
    return { ...base, name: user.fullName };
  }

  return {
    ...base,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
```

### 4. Support Multiple Versions Temporarily

```typescript
// Support old versions for a transition period
const SUNSET_DATES = {
  v1: new Date('2025-12-31'),
  v2: null, // Still supported
  v3: null, // Current version
};

// Notify clients approaching sunset
if (SUNSET_DATES[version]) {
  const daysUntilSunset = Math.ceil(
    (SUNSET_DATES[version].getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilSunset <= 90) {
    res.set('X-API-Warning', `This version will sunset in ${daysUntilSunset} days`);
  }
}
```

### 5. Document Version Differences

```typescript
// OpenAPI/Swagger for each version
const swaggerV1 = {
  openapi: '3.0.0',
  info: {
    title: 'API V1',
    version: '1.0.0',
    description: 'Deprecated - migrate to V2',
  },
  // ...
};

app.use('/docs/v1', swaggerUI.serve, swaggerUI.setup(swaggerV1));
app.use('/docs/v2', swaggerUI.serve, swaggerUI.setup(swaggerV2));
```

## Testing API Versions

```typescript
describe('API Versioning', () => {
  describe('V1', () => {
    it('should return V1 user format', async () => {
      const response = await request(app)
        .get('/v1/users/123')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).not.toHaveProperty('firstName');
    });

    it('should include deprecation headers', async () => {
      const response = await request(app)
        .get('/v1/users/123')
        .expect(200);

      expect(response.headers['x-api-deprecation']).toBeDefined();
    });
  });

  describe('V2', () => {
    it('should return V2 user format', async () => {
      const response = await request(app)
        .get('/v2/users/123')
        .expect(200);

      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('lastName');
      expect(response.body).not.toHaveProperty('name');
    });
  });

  describe('Header-based versioning', () => {
    it('should accept X-API-Version header', async () => {
      const response = await request(app)
        .get('/users/123')
        .set('X-API-Version', 'v2')
        .expect(200);

      expect(response.headers['x-api-version']).toBe('v2');
    });

    it('should accept content negotiation', async () => {
      const response = await request(app)
        .get('/users/123')
        .set('Accept', 'application/vnd.api.v2+json')
        .expect(200);

      expect(response.headers['x-api-version']).toBe('v2');
    });

    it('should default to latest version', async () => {
      const response = await request(app)
        .get('/users/123')
        .expect(200);

      expect(response.headers['x-api-version']).toBe('v3');
    });
  });

  describe('Version validation', () => {
    it('should reject unsupported version', async () => {
      const response = await request(app)
        .get('/users/123')
        .set('X-API-Version', 'v99')
        .expect(400);

      expect(response.body.error.code).toBe('UNSUPPORTED_API_VERSION');
    });
  });
});
```

## Common Pitfalls

### ❌ Pitfall 1: Not Planning for Versioning from Day 1
Starting without versioning makes it hard to add later.

### ✅ Solution:
Include version (even if just v1) from the start.

### ❌ Pitfall 2: Supporting Too Many Versions
Maintaining many versions increases complexity and costs.

### ✅ Solution:
```typescript
// Limit supported versions (current + 1 previous)
const SUPPORTED_VERSIONS = ['v2', 'v3'];
const DEPRECATED_VERSIONS = ['v1']; // With sunset date
```

### ❌ Pitfall 3: Making Frequent Breaking Changes
Too many versions confuse clients.

### ✅ Solution:
- Batch breaking changes into major versions
- Use minor versions for backward-compatible additions
- Consider feature flags for gradual rollout

### ❌ Pitfall 4: No Migration Path
Clients don't know how to upgrade.

### ✅ Solution:
```typescript
// Provide clear migration guides
const migrationGuide = {
  from: 'v1',
  to: 'v2',
  steps: [
    'Update User.name to User.firstName and User.lastName',
    'Handle new createdAt field in responses',
  ],
  codeExamples: '...',
};
```

## References

- [Roy Fielding on Versioning](https://www.infoq.com/articles/roy-fielding-on-versioning/)
- [Stripe API Versioning](https://stripe.com/docs/api/versioning)
- [Microsoft REST API Guidelines - Versioning](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#12-versioning)
- [API Versioning Best Practices](https://www.troyhunt.com/your-api-versioning-is-wrong-which-is/)
- [RFC 5829 - Link Relation Types for Simple Version Navigation](https://tools.ietf.org/html/rfc5829)
