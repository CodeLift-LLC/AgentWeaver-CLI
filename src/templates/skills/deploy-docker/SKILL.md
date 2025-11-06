---
name: Docker Deployment
description: Production-ready Docker patterns including multi-stage builds, best practices, Docker Compose orchestration, and security hardening for containerized applications.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - docker
  - containers
  - deployment
  - devops
  - infrastructure
mcp-servers:
  - socket
  - playwright
---

# Docker Deployment Skill

This skill provides battle-tested patterns for containerizing applications with Docker, focusing on production readiness, security, and optimization.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Create Dockerfile with multi-stage build, optimize image size, add security best practices, set up Docker Compose for local development, test container builds, validate security scanning.

**Additional tools available**:
- Use Socket MCP for security scanning dependencies in container
- Use Playwright MCP for smoke testing deployed containers

## When to Use

- Containerizing applications for consistent deployment environments
- Implementing multi-stage builds to minimize image size
- Setting up Docker Compose for local development and testing
- Optimizing Docker images for faster builds and deployments
- Implementing security best practices for container images
- Creating reproducible build environments

## Core Concepts

### Multi-Stage Builds

Multi-stage builds reduce final image size by separating build dependencies from runtime dependencies.

**Benefits:**
- Smaller production images (can reduce size by 70-90%)
- Faster deployment and startup times
- Reduced attack surface
- Separation of build and runtime concerns

### Layer Caching

Docker caches each layer in a Dockerfile. Order commands from least to most frequently changing for optimal caching.

**Optimization Order:**
1. Base image and system packages
2. Application dependencies (package.json, requirements.txt)
3. Application source code
4. Configuration files

### Security Principles

- Run containers as non-root users
- Use minimal base images (Alpine, distroless)
- Scan images for vulnerabilities
- Don't include secrets in images
- Use specific image tags, not `latest`

## Universal Multi-Stage Build Pattern

Multi-stage builds follow a consistent pattern across ALL languages and frameworks:

### Universal Dockerfile Structure

```
┌─────────────────────────────────────────────────┐
│ Stage 1: Build Stage                            │
│                                                 │
│ ├─> Use full build image with tooling          │
│ ├─> Install build dependencies                 │
│ ├─> Copy dependency manifests                  │
│ ├─> Install/download dependencies              │
│ ├─> Copy source code                           │
│ └─> Build/compile application                  │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ Stage 2: Production Stage                       │
│                                                 │
│ ├─> Use minimal runtime image (alpine/slim)    │
│ ├─> Install security updates                   │
│ ├─> Create non-root user                       │
│ ├─> Copy artifacts from build stage            │
│ ├─> Copy runtime dependencies                  │
│ ├─> Switch to non-root user                    │
│ ├─> Define health check                        │
│ └─> Set startup command                        │
└─────────────────────────────────────────────────┘
```

### Dockerfile Template (Conceptual)

```dockerfile
# ==========================================
# Stage 1: Build
# ==========================================
FROM [base-build-image:version] AS builder

# Install build tools (compilers, package managers, etc.)
RUN [install build dependencies]

WORKDIR /app

# Copy dependency manifest files first (for layer caching)
COPY [dependency-manifest-files] ./

# Install/download dependencies
RUN [install-dependencies-command]

# Copy application source code
COPY . .

# Build/compile application (if needed)
RUN [build-command]

# ==========================================
# Stage 2: Production
# ==========================================
FROM [base-runtime-image:version] AS production

# Install security updates
RUN [update-system-packages]

# Create non-root user for security
RUN [create-non-root-user-command]

WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder --chown=[user]:[group] /app/[build-output] ./[destination]

# Copy runtime dependencies if needed
COPY --chown=[user]:[group] [runtime-files] ./

# Switch to non-root user
USER [non-root-user]

# Expose application port
EXPOSE [port]

# Define health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD [health-check-command]

# Set environment variables
ENV [ENV_VAR]=[value]

# Start application
CMD ["[runtime-command]", "[args]"]
```

### Key Optimization Principles

**1. Layer Caching Optimization:**
```
Order of operations (least to most frequently changing):
1. Base image selection
2. System package installation
3. Dependency manifest copy
4. Dependency installation
5. Source code copy
6. Application build
```

**2. Size Reduction Techniques:**
- Use multi-stage builds (70-90% size reduction)
- Choose minimal base images (alpine, slim, distroless)
- Remove package manager caches
- Combine RUN commands to reduce layers
- Use .dockerignore to exclude unnecessary files

**3. Security Hardening:**
- Always use specific image versions (not `latest`)
- Run as non-root user
- Apply security updates
- Scan for vulnerabilities
- Don't include secrets in images

## Framework-Specific Examples

> **Note**: The examples below show how to apply the universal pattern to specific technology stacks. Use Context7 MCP for the latest framework-specific Docker best practices:
>
> ```
> Query Context7: "[Your Language/Framework] Docker best practices"
> ```

### Example: Compiled Language Pattern (Go, Rust, Java, C#)

**Characteristics:**
- Requires compilation step
- Can produce single binary
- Smaller runtime images (can use distroless)

**Pattern:**
1. Build stage: Full SDK/compiler image
2. Production stage: Minimal runtime or distroless image
3. Copy only compiled binary/artifacts

### Example: Interpreted Language Pattern (Node.js, Python, Ruby, PHP)

**Characteristics:**
- No compilation needed (or optional transpilation)
- Requires runtime environment
- May need virtual environment isolation

**Pattern:**
1. Build stage: Install dependencies, run build steps (TypeScript, webpack, etc.)
2. Production stage: Runtime image with minimal dependencies
3. Copy source + dependencies (or bundled assets)

### Example: JVM Language Pattern (Java, Kotlin, Scala)

**Characteristics:**
- Requires JVM runtime
- Can produce JAR/WAR artifacts
- Gradle/Maven build systems

**Pattern:**
1. Build stage: Full JDK with build tools
2. Production stage: JRE (runtime-only) image
3. Copy JAR/WAR artifact

### Language-Specific Reference Examples

Below are reference implementations showing the universal pattern applied to popular tech stacks:

<details>
<summary>Node.js / TypeScript Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
RUN apk upgrade --no-cache
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD node healthcheck.js
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
```
</details>

<details>
<summary>Python / FastAPI Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM python:3.11-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM python:3.11-slim AS production
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
RUN useradd -m -u 1001 appuser
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
COPY --chown=appuser:appuser . .
USER appuser
ENV PATH="/opt/venv/bin:$PATH" PYTHONUNBUFFERED=1
EXPOSE 8000
HEALTHCHECK --interval=30s CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=2)"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
</details>

<details>
<summary>Go Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder
RUN apk add --no-cache git ca-certificates tzdata
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags='-w -s -extldflags "-static"' -a -installsuffix cgo \
    -o /bin/app ./cmd/server

# Stage 2: Production (distroless)
FROM gcr.io/distroless/static-debian11:nonroot
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /bin/app /app
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```
</details>

<details>
<summary>Java / Spring Boot Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY gradle/ gradle/
COPY build.gradle settings.gradle gradlew ./
RUN ./gradlew dependencies --no-daemon
COPY src ./src
RUN ./gradlew bootJar --no-daemon

# Stage 2: Production
FROM eclipse-temurin:21-jre-alpine AS production
RUN apk upgrade --no-cache
RUN addgroup -g 1001 -S spring && adduser -S spring -u 1001 -G spring
WORKDIR /app
COPY --from=builder --chown=spring:spring /app/build/libs/*.jar app.jar
USER spring
EXPOSE 8080
HEALTHCHECK --interval=30s CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
```
</details>

<details>
<summary>C# / .NET Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o out

# Stage 2: Production
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS production
RUN apk upgrade --no-cache
RUN addgroup -g 1001 -S dotnet && adduser -S dotnet -u 1001 -G dotnet
WORKDIR /app
COPY --from=builder --chown=dotnet:dotnet /app/out .
USER dotnet
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
CMD ["dotnet", "YourApp.dll"]
```
</details>

<details>
<summary>Ruby / Rails Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM ruby:3.3-alpine AS builder
RUN apk add --no-cache build-base postgresql-dev nodejs yarn
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN bundle exec rake assets:precompile

# Stage 2: Production
FROM ruby:3.3-alpine AS production
RUN apk upgrade --no-cache && apk add --no-cache postgresql-client
RUN addgroup -g 1001 -S rails && adduser -S rails -u 1001 -G rails
WORKDIR /app
COPY --from=builder --chown=rails:rails /usr/local/bundle /usr/local/bundle
COPY --from=builder --chown=rails:rails /app ./
USER rails
EXPOSE 3000
ENV RAILS_ENV=production RAILS_LOG_TO_STDOUT=1
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
```
</details>

<details>
<summary>PHP / Laravel Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM composer:2 AS builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist
COPY . .
RUN composer dump-autoload --optimize

# Stage 2: Production
FROM php:8.3-fpm-alpine AS production
RUN apk upgrade --no-cache && apk add --no-cache libpq
RUN docker-php-ext-install pdo pdo_mysql opcache
RUN addgroup -g 1001 -S www && adduser -S www -u 1001 -G www
WORKDIR /var/www
COPY --from=builder --chown=www:www /app ./
USER www
EXPOSE 9000
CMD ["php-fpm"]
```
</details>

<details>
<summary>Rust Multi-Stage Build</summary>

```dockerfile
# Stage 1: Build
FROM rust:1.75-alpine AS builder
RUN apk add --no-cache musl-dev
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release
COPY src ./src
RUN touch src/main.rs && cargo build --release

# Stage 2: Production
FROM alpine:3.18 AS production
RUN apk upgrade --no-cache && apk add --no-cache ca-certificates
RUN addgroup -g 1001 -S rust && adduser -S rust -u 1001 -G rust
WORKDIR /app
COPY --from=builder --chown=rust:rust /app/target/release/app ./
USER rust
EXPOSE 8080
CMD ["./app"]
```
</details>

## Docker Compose Orchestration

Docker Compose follows a universal pattern for multi-container applications.

### Universal Docker Compose Structure

```yaml
version: '3.9'

services:
  # ==========================================
  # Application Service
  # ==========================================
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: [stage-name]  # development, production, etc.
    container_name: [app-name]
    ports:
      - "[host-port]:[container-port]"
    volumes:
      # Mount source code for development hot reload
      - ./src:/app/src:ro
      # Named volume for dependencies (prevents overwriting)
      - [dependencies-volume]:/app/[dependencies-dir]
    environment:
      - [ENV_NAME]=[value]
      - DATABASE_URL=[database-connection-string]
      - CACHE_URL=[cache-connection-string]
    env_file:
      - .env.[environment]
    depends_on:
      [service-name]:
        condition: service_healthy
    networks:
      - [network-name]
    restart: unless-stopped
    # Optional: Resource limits
    deploy:
      resources:
        limits:
          cpus: '[cpu-limit]'
          memory: [memory-limit]

  # ==========================================
  # Database Service
  # ==========================================
  db:
    image: [database-image]:[version]
    container_name: [db-name]
    ports:
      - "[host-port]:[container-port]"
    environment:
      - [DB_USER_VAR]=[username]
      - [DB_PASSWORD_VAR]=[password]
      - [DB_NAME_VAR]=[database-name]
    volumes:
      - [db-volume]:/[db-data-path]
      - ./scripts/[init-script]:/[db-init-path]:ro
    healthcheck:
      test: ["CMD-SHELL", "[health-check-command]"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - [network-name]
    restart: unless-stopped

  # ==========================================
  # Cache Service (Optional)
  # ==========================================
  cache:
    image: [cache-image]:[version]
    container_name: [cache-name]
    ports:
      - "[host-port]:[container-port]"
    volumes:
      - [cache-volume]:/data
    healthcheck:
      test: ["CMD", "[health-check-command]"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - [network-name]
    restart: unless-stopped

volumes:
  [db-volume]:
    driver: local
  [cache-volume]:
    driver: local
  [dependencies-volume]:
    driver: local

networks:
  [network-name]:
    driver: bridge
```

### Common Service Patterns

**Database Services:**
- PostgreSQL: `postgres:16-alpine` (port 5432)
- MySQL: `mysql:8-alpine` (port 3306)
- MongoDB: `mongo:7-alpine` (port 27017)
- MariaDB: `mariadb:11-alpine` (port 3306)

**Cache Services:**
- Redis: `redis:7-alpine` (port 6379)
- Memcached: `memcached:1-alpine` (port 11211)

**Message Queues:**
- RabbitMQ: `rabbitmq:3-management-alpine` (port 5672, 15672)
- Kafka: `confluentinc/cp-kafka:latest` (port 9092)

### Reference Example: Full Development Stack

<details>
<summary>Node.js Development Stack (PostgreSQL + Redis + Nginx)</summary>

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: myapp
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src:ro
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    env_file:
      - .env.development
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    container_name: myapp-db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: myapp-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: myapp-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
    redis_data:
    node_modules:

networks:
  app-network:
    driver: bridge
```
</details>

### Universal Production Deployment (Docker Swarm/Stack)

```yaml
version: '3.9'

services:
  app:
    image: [registry]/[app-name]:${VERSION:-latest}
    deploy:
      replicas: [number-of-replicas]
      update_config:
        parallelism: 1  # Update one container at a time
        delay: 10s      # Wait 10s between updates
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '[cpu-limit]'
          memory: [memory-limit]
        reservations:
          cpus: '[cpu-reservation]'
          memory: [memory-reservation]
    ports:
      - "[host-port]:[container-port]"
    environment:
      - [ENV_NAME]=production
    env_file:
      - .env.production
    secrets:
      - [secret-name-1]
      - [secret-name-2]
    healthcheck:
      test: ["CMD", "[health-check-command]"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - [network-name]
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

secrets:
  [secret-name-1]:
    external: true
  [secret-name-2]:
    external: true

networks:
  [network-name]:
    driver: overlay  # For swarm mode
```

<details>
<summary>Production Example: Node.js with Swarm</summary>

```yaml
version: '3.9'

services:
  app:
    image: myregistry.com/myapp:${VERSION:-latest}
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    secrets:
      - db_password
      - api_key
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - app-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

secrets:
  db_password:
    external: true
  api_key:
    external: true

networks:
  app-network:
    driver: overlay
```
</details>

## Best Practices

### 1. Image Optimization

**Use .dockerignore**
```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
*.md
Dockerfile
.dockerignore
dist
coverage
.vscode
.idea
*.log
```

**Minimize layers**
```dockerfile
# ❌ BAD - Creates multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# ✅ GOOD - Single layer
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*
```

### 2. Security Hardening

**Use specific image versions**
```dockerfile
# ❌ BAD - Unpredictable, can break
FROM node:latest

# ✅ GOOD - Specific, reproducible
FROM node:20.10.0-alpine3.18
```

**Run as non-root user**
```dockerfile
# Create and use non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser
```

**Set read-only root filesystem**
```yaml
# docker-compose.yml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

### 3. Build Optimization

**Order Dockerfile commands strategically**
```dockerfile
# 1. Base image (rarely changes)
FROM node:20-alpine

# 2. System dependencies (rarely changes)
RUN apk add --no-cache curl

# 3. Application dependencies (changes occasionally)
COPY package*.json ./
RUN npm ci

# 4. Application code (changes frequently)
COPY . .
```

**Use BuildKit for parallel builds**
```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Build with BuildKit
docker build --platform linux/amd64 -t myapp:latest .
```

### 4. Health Checks

**Universal Health Check Pattern:**

Health checks verify that your container is running and ready to serve traffic.

```dockerfile
HEALTHCHECK --interval=[check-frequency] \
            --timeout=[timeout-duration] \
            --start-period=[startup-grace-period] \
            --retries=[retry-count] \
  CMD [health-check-command]
```

**Common Health Check Approaches:**

1. **HTTP Endpoint Check**: Query application's /health endpoint
2. **TCP Port Check**: Verify port is listening
3. **Process Check**: Verify application process is running
4. **Custom Script**: Run application-specific validation

**Health Check Examples by Language:**

<details>
<summary>Node.js HTTP Health Check</summary>

```javascript
// healthcheck.js
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', (err) => {
  console.error('ERROR:', err);
  process.exit(1);
});

request.end();
```

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD node healthcheck.js
```
</details>

<details>
<summary>Python HTTP Health Check</summary>

```python
# healthcheck.py
import sys
import requests

try:
    response = requests.get('http://localhost:8000/health', timeout=2)
    sys.exit(0 if response.status_code == 200 else 1)
except Exception as e:
    print(f"ERROR: {e}", file=sys.stderr)
    sys.exit(1)
```

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD python healthcheck.py
```
</details>

<details>
<summary>Simple curl-based Health Check</summary>

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:[port]/health || exit 1
```
</details>

<details>
<summary>wget-based Health Check (when curl unavailable)</summary>

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:[port]/health || exit 1
```
</details>

<details>
<summary>Go HTTP Health Check</summary>

```go
// healthcheck.go
package main

import (
    "net/http"
    "os"
    "time"
)

func main() {
    client := &http.Client{Timeout: 2 * time.Second}
    resp, err := client.Get("http://localhost:8080/health")
    if err != nil || resp.StatusCode != 200 {
        os.Exit(1)
    }
    os.Exit(0)
}
```

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s CMD /app/healthcheck
```
</details>

### 5. Environment-Specific Builds

**Universal Multi-Target Pattern:**

Use Docker build stages to create environment-specific images from a single Dockerfile.

```dockerfile
# ==========================================
# Development Stage
# ==========================================
FROM [base-image] AS development

WORKDIR /app

# Install ALL dependencies (including dev dependencies)
COPY [dependency-manifest] ./
RUN [install-all-dependencies]

# Copy source code
COPY . .

# Start with hot-reload/watch mode
CMD ["[dev-command]", "[watch-flag]"]

# ==========================================
# Production Stage
# ==========================================
FROM [base-image] AS production

WORKDIR /app

# Install ONLY production dependencies
COPY [dependency-manifest] ./
RUN [install-production-dependencies]

# Copy application
COPY . .

# Start in production mode
CMD ["[start-command]"]
```

**Build Specific Stage:**
```bash
# Build development image
docker build --target development -t myapp:dev .

# Build production image
docker build --target production -t myapp:prod .
```

<details>
<summary>Node.js Multi-Target Example</summary>

```dockerfile
# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```
</details>

<details>
<summary>Python Multi-Target Example</summary>

```dockerfile
# Development stage
FROM python:3.11-slim AS development
WORKDIR /app
COPY requirements.txt requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt
COPY . .
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0"]

# Production stage
FROM python:3.11-slim AS production
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
</details>

## Common Commands

### Building Images
```bash
# Build image
docker build -t myapp:1.0.0 .

# Build specific stage
docker build --target production -t myapp:prod .

# Build with build arguments
docker build --build-arg NODE_ENV=production -t myapp .

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

### Running Containers
```bash
# Run container
docker run -d -p 3000:3000 --name myapp myapp:1.0.0

# Run with environment variables
docker run -d -p 3000:3000 --env-file .env myapp:1.0.0

# Run with volume mount
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data myapp:1.0.0

# Run with resource limits
docker run -d --memory="512m" --cpus="1.0" myapp:1.0.0
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Start specific service
docker-compose up -d app

# View logs
docker-compose logs -f app

# Scale service
docker-compose up -d --scale app=3

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Debugging
```bash
# Execute command in running container
docker exec -it myapp sh

# View container logs
docker logs -f myapp

# Inspect container
docker inspect myapp

# View container resource usage
docker stats myapp
```

## Security Scanning

**Scan images for vulnerabilities**
```bash
# Using Docker Scout
docker scout cves myapp:latest

# Using Trivy
trivy image myapp:latest

# Using Snyk
snyk container test myapp:latest
```

## Common Pitfalls

### ❌ Pitfall 1: Large Image Sizes
Including build tools and dependencies in production images

### ✅ Solution:
Use multi-stage builds to separate build and runtime dependencies

### ❌ Pitfall 2: Running as Root
Security risk if container is compromised

### ✅ Solution:
Always create and use a non-root user in production images

### ❌ Pitfall 3: Inefficient Layer Caching
Copying all files before installing dependencies

### ✅ Solution:
Copy dependency files first, install, then copy source code

### ❌ Pitfall 4: Hardcoded Secrets
Including secrets in Dockerfiles or images

### ✅ Solution:
Use environment variables, Docker secrets, or external secret management

## References

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
