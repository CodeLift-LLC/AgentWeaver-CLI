---
name: Environment Configuration
description: Production-ready patterns for managing environment variables, secrets, configuration across environments, and secure configuration practices for different deployment targets.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - configuration
  - environment-variables
  - secrets-management
  - security
  - deployment
  - devops
mcp-servers:
  - socket
  - playwright
---

# Environment Configuration Skill

This skill provides battle-tested patterns for managing application configuration, environment variables, and secrets across different environments securely and efficiently.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Design configuration structure, implement environment-specific configs, set up secure secrets management, validate config loading, test across environments (dev, staging, prod).

**Additional tools available**:
- Use Socket MCP for scanning secrets/config dependencies
- Use Playwright MCP for testing config-driven features

## When to Use

- Setting up environment-specific configuration
- Managing secrets and sensitive data securely
- Implementing configuration validation
- Creating multi-environment deployment strategies
- Handling configuration for different cloud providers
- Implementing feature flags and dynamic configuration

## Core Concepts

### Configuration Hierarchy

**Priority Order (highest to lowest):**
1. Command-line arguments
2. Environment variables
3. Environment-specific config files (.env.production)
4. Default config file (.env)
5. Application defaults

### Environment Types

- **Development**: Local development with debug enabled
- **Testing**: CI/CD and automated testing
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

### Security Principles

- Never commit secrets to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Implement principle of least privilege
- Encrypt secrets at rest and in transit

## Implementation Examples

### Node.js Configuration Setup

**Directory Structure**
```
config/
├── default.js          # Default configuration
├── development.js      # Development overrides
├── staging.js          # Staging overrides
├── production.js       # Production overrides
├── custom-environment-variables.js  # Env var mappings
└── index.js           # Configuration loader

.env.example           # Template for .env file
.env                   # Local environment variables (gitignored)
.env.development       # Development environment (gitignored)
.env.staging          # Staging environment (gitignored)
.env.production       # Production environment (gitignored)
```

**Using node-config**
```javascript
// config/default.js
module.exports = {
  app: {
    name: 'MyApp',
    port: 3000,
    env: 'development',
    logLevel: 'info'
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'myapp',
    pool: {
      min: 2,
      max: 10
    }
  },
  redis: {
    host: 'localhost',
    port: 6379,
    ttl: 3600
  },
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },
  features: {
    newDashboard: false,
    analytics: true
  }
};

// config/production.js
module.exports = {
  app: {
    env: 'production',
    logLevel: 'warn'
  },
  database: {
    pool: {
      min: 5,
      max: 20
    },
    ssl: true
  },
  api: {
    rateLimit: {
      max: 1000
    }
  }
};

// config/custom-environment-variables.js
module.exports = {
  app: {
    port: 'PORT',
    env: 'NODE_ENV'
  },
  database: {
    host: 'DB_HOST',
    port: 'DB_PORT',
    name: 'DB_NAME',
    username: 'DB_USER',
    password: 'DB_PASSWORD'
  },
  redis: {
    host: 'REDIS_HOST',
    port: 'REDIS_PORT',
    password: 'REDIS_PASSWORD'
  },
  secrets: {
    jwtSecret: 'JWT_SECRET',
    apiKey: 'API_KEY'
  }
};

// config/index.js
const config = require('config');
const Joi = require('joi');

// Configuration validation schema
const schema = Joi.object({
  app: Joi.object({
    name: Joi.string().required(),
    port: Joi.number().port().required(),
    env: Joi.string().valid('development', 'staging', 'production').required(),
    logLevel: Joi.string().valid('debug', 'info', 'warn', 'error').required()
  }).required(),
  database: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().port().required(),
    name: Joi.string().required(),
    username: Joi.string().when('$env', {
      is: Joi.string().valid('production', 'staging'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    password: Joi.string().when('$env', {
      is: Joi.string().valid('production', 'staging'),
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }).required(),
  secrets: Joi.object({
    jwtSecret: Joi.string().min(32).required(),
    apiKey: Joi.string().required()
  }).required()
}).unknown(true);

// Validate configuration on startup
const { error, value } = schema.validate(config, {
  context: { env: config.app.env },
  abortEarly: false
});

if (error) {
  console.error('Configuration validation failed:');
  error.details.forEach(detail => {
    console.error(`  - ${detail.message}`);
  });
  process.exit(1);
}

module.exports = value;
```

### Using dotenv with TypeScript

```typescript
// src/config/env.ts
import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment-specific .env file
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: path.resolve(process.cwd(), envFile) });

// Define environment variable schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),

  // Database
  DATABASE_URL: z.string().url(),
  DB_POOL_MIN: z.string().transform(Number).pipe(z.number().min(0)).default('2'),
  DB_POOL_MAX: z.string().transform(Number).pipe(z.number().min(1)).default('10'),

  // Redis
  REDIS_URL: z.string().url(),
  REDIS_TTL: z.string().transform(Number).pipe(z.number().min(0)).default('3600'),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // External APIs
  API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SENDGRID_API_KEY: z.string().startsWith('SG.'),

  // AWS (optional)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),

  // Feature Flags
  ENABLE_NEW_DASHBOARD: z.string().transform(val => val === 'true').default('false'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();

// Usage in application
// import { env } from './config/env';
// const port = env.PORT;
// const dbUrl = env.DATABASE_URL;
```

### Python Configuration with Pydantic

```python
# config/settings.py
from pydantic import Field, PostgresDsn, RedisDsn, validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal, Optional
import os

class Settings(BaseSettings):
    """Application settings with validation"""

    model_config = SettingsConfigDict(
        env_file=f'.env.{os.getenv("APP_ENV", "development")}',
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
    )

    # Application
    APP_NAME: str = "MyApp"
    APP_ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = Field(default=False)
    PORT: int = Field(default=8000, ge=1, le=65535)

    # Database
    DATABASE_URL: PostgresDsn
    DB_POOL_MIN: int = Field(default=2, ge=0)
    DB_POOL_MAX: int = Field(default=10, ge=1)
    DB_ECHO: bool = Field(default=False)

    # Redis
    REDIS_URL: RedisDsn
    REDIS_TTL: int = Field(default=3600, ge=0)

    # Security
    SECRET_KEY: str = Field(min_length=32)
    JWT_SECRET: str = Field(min_length=32)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, ge=1)

    # CORS
    CORS_ORIGINS: list[str] = Field(default=["http://localhost:3000"])

    # External APIs
    STRIPE_SECRET_KEY: str
    SENDGRID_API_KEY: str

    # AWS (optional)
    AWS_REGION: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None

    # Feature Flags
    ENABLE_NEW_DASHBOARD: bool = False
    ENABLE_ANALYTICS: bool = True

    # Monitoring
    SENTRY_DSN: Optional[str] = None
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    @validator("DEBUG", pre=True)
    def parse_debug(cls, v):
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes")
        return v

    @validator("CORS_ORIGINS", pre=True)
    def parse_cors(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @validator("SECRET_KEY")
    def validate_secret_key(cls, v, values):
        if values.get("APP_ENV") == "production" and len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters in production")
        return v

    class Config:
        case_sensitive = True

# Create global settings instance
settings = Settings()

# Usage
# from config.settings import settings
# database_url = settings.DATABASE_URL
# debug_mode = settings.DEBUG
```

### Docker Environment Variables

**Docker Compose with .env**
```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    build: .
    ports:
      - "${PORT:-3000}:3000"
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      API_KEY: ${API_KEY}
      # Feature flags
      ENABLE_NEW_DASHBOARD: ${ENABLE_NEW_DASHBOARD:-false}
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME:-myapp}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  postgres_data:
```

**.env.example (commit this)**
```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
DB_USER=postgres
DB_PASSWORD=changeme
DB_NAME=myapp

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=changeme

# Security (generate strong secrets!)
JWT_SECRET=your-secret-key-min-32-characters
API_KEY=your-api-key

# External Services
STRIPE_SECRET_KEY=sk_test_xxxxx
SENDGRID_API_KEY=SG.xxxxx

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

# Feature Flags
ENABLE_NEW_DASHBOARD=false
ENABLE_ANALYTICS=true

# Monitoring
SENTRY_DSN=
LOG_LEVEL=info
```

### Kubernetes ConfigMaps and Secrets

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  NODE_ENV: "production"
  PORT: "3000"
  LOG_LEVEL: "info"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  DB_NAME: "myapp"
  ENABLE_NEW_DASHBOARD: "true"
  ENABLE_ANALYTICS: "true"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: production
type: Opaque
stringData:
  DATABASE_URL: postgresql://user:password@postgres-service:5432/myapp
  JWT_SECRET: your-secret-key-min-32-characters
  API_KEY: your-api-key
  STRIPE_SECRET_KEY: sk_live_xxxxx
  SENDGRID_API_KEY: SG.xxxxx
  REDIS_PASSWORD: redis-password

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_URL
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
```

### AWS Secrets Manager Integration

```typescript
// src/config/secrets.ts
import {
  SecretsManagerClient,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

interface AppSecrets {
  DATABASE_URL: string;
  JWT_SECRET: string;
  API_KEY: string;
  STRIPE_SECRET_KEY: string;
}

async function getSecrets(): Promise<AppSecrets> {
  try {
    const secretName = `myapp/${process.env.NODE_ENV}/secrets`;

    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    if (!response.SecretString) {
      throw new Error('Secret string is empty');
    }

    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error('Failed to fetch secrets:', error);
    throw error;
  }
}

// Cache secrets to avoid repeated API calls
let cachedSecrets: AppSecrets | null = null;

export async function loadSecrets(): Promise<AppSecrets> {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  cachedSecrets = await getSecrets();
  return cachedSecrets;
}

// Usage in application
// const secrets = await loadSecrets();
// const dbUrl = secrets.DATABASE_URL;
```

### HashiCorp Vault Integration

```typescript
// src/config/vault.ts
import Vault from 'node-vault';

const vault = Vault({
  endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
  token: process.env.VAULT_TOKEN,
});

async function getVaultSecrets(path: string) {
  try {
    const result = await vault.read(path);
    return result.data.data;
  } catch (error) {
    console.error(`Failed to read from Vault path ${path}:`, error);
    throw error;
  }
}

// Read secrets from Vault
export async function loadVaultConfig() {
  const [database, api, aws] = await Promise.all([
    getVaultSecrets('secret/data/myapp/database'),
    getVaultSecrets('secret/data/myapp/api'),
    getVaultSecrets('secret/data/myapp/aws'),
  ]);

  return {
    database: {
      url: database.url,
      username: database.username,
      password: database.password,
    },
    api: {
      key: api.key,
      stripeKey: api.stripe_key,
    },
    aws: {
      accessKeyId: aws.access_key_id,
      secretAccessKey: aws.secret_access_key,
    },
  };
}
```

## Best Practices

### 1. Never Commit Secrets

**Use .gitignore**
```
# .gitignore
.env
.env.*
!.env.example
config/secrets.json
credentials.json
*.pem
*.key
```

**Use git-secrets or pre-commit hooks**
```bash
# Install git-secrets
git secrets --install
git secrets --register-aws
```

### 2. Environment-Specific Configuration

**Use different files per environment**
```
.env.development     # Local development
.env.test           # CI/CD testing
.env.staging        # Staging environment
.env.production     # Production environment
.env.example        # Template (commit this)
```

### 3. Validate Configuration on Startup

```typescript
// Fail fast if configuration is invalid
function validateConfig() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY'];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
  }
}

validateConfig();
```

### 4. Use Type-Safe Configuration

```typescript
// Define types for configuration
interface Config {
  app: {
    port: number;
    env: 'development' | 'staging' | 'production';
  };
  database: {
    url: string;
    pool: { min: number; max: number };
  };
}

// Type-safe access
const config: Config = loadConfig();
```

### 5. Secret Rotation

**Implement secret rotation strategy**
- Rotate secrets every 90 days
- Use versioned secrets
- Update applications without downtime
- Audit secret access

## Security Checklist

- [ ] Secrets never committed to version control
- [ ] Different secrets for each environment
- [ ] Secrets encrypted at rest
- [ ] Least privilege access to secrets
- [ ] Secret rotation strategy in place
- [ ] Configuration validation on startup
- [ ] Audit logging for secret access
- [ ] Secure secret distribution mechanism

## Common Pitfalls

### ❌ Pitfall 1: Hardcoded Secrets
Secrets directly in source code or config files

### ✅ Solution:
Use environment variables and secret management systems

### ❌ Pitfall 2: Shared Secrets Across Environments
Same secrets in development, staging, and production

### ✅ Solution:
Use different secrets for each environment

### ❌ Pitfall 3: No Configuration Validation
Application starts with invalid configuration

### ✅ Solution:
Validate all configuration on startup, fail fast

### ❌ Pitfall 4: Exposing Secrets in Logs
Logging configuration values including secrets

### ✅ Solution:
Redact sensitive values before logging

## References

- [The Twelve-Factor App - Config](https://12factor.net/config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [HashiCorp Vault](https://www.vaultproject.io/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
