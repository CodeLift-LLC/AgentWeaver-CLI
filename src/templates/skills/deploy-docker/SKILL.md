---
name: Docker Deployment
description: Production-ready Docker patterns including multi-stage builds, best practices, Docker Compose orchestration, and security hardening for containerized applications.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
tags:
  - docker
  - containers
  - deployment
  - devops
  - infrastructure
---

# Docker Deployment Skill

This skill provides battle-tested patterns for containerizing applications with Docker, focusing on production readiness, security, and optimization.

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

## Implementation Examples

### Node.js Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application source
COPY . .

# Build application (if using TypeScript or similar)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Install security updates
RUN apk upgrade --no-cache

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy other necessary files
COPY --chown=nodejs:nodejs ./public ./public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Set environment to production
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/server.js"]
```

### Python FastAPI Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM python:3.11-slim AS production

# Install security updates
RUN apt-get update && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 appuser

# Set working directory
WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Set PATH to use venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=2)"

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Go Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /src

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Build binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o /bin/app ./cmd/server

# Stage 2: Production (distroless for minimal footprint)
FROM gcr.io/distroless/static-debian11:nonroot

# Copy timezone data
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
# Copy CA certificates
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy binary
COPY --from=builder /bin/app /app

# Expose port
EXPOSE 8080

# Health check not available in distroless, implement in orchestration layer

# Use nonroot user (65532)
USER nonroot:nonroot

# Start application
ENTRYPOINT ["/app"]
```

### Docker Compose for Development

```yaml
version: '3.9'

services:
  # Application service
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development  # Use development stage
    container_name: myapp
    ports:
      - "3000:3000"
    volumes:
      # Mount source code for hot reload
      - ./src:/app/src:ro
      # Named volume for node_modules
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

  # PostgreSQL database
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

  # Redis cache
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

  # Nginx reverse proxy
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
    driver: local
  redis_data:
    driver: local
  node_modules:
    driver: local

networks:
  app-network:
    driver: bridge
```

### Docker Compose for Production

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

**Application-level health check**
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

### 5. Environment-Specific Builds

**Multi-target Dockerfile**
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
