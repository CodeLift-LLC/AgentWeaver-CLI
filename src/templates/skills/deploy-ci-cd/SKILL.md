---
name: CI/CD Pipelines
description: Production-ready CI/CD pipeline patterns for GitHub Actions, GitLab CI, and other platforms including automated testing, building, deployment, and best practices for reliable releases.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
tags:
  - ci-cd
  - github-actions
  - gitlab-ci
  - deployment
  - automation
  - devops
---

# CI/CD Pipelines Skill

This skill provides comprehensive patterns for implementing robust, secure, and efficient CI/CD pipelines across popular platforms.

## When to Use

- Setting up automated testing and deployment pipelines
- Implementing continuous integration for pull requests
- Automating Docker image builds and deployments
- Creating multi-environment deployment strategies
- Implementing security scanning and quality gates
- Setting up automated releases and versioning

## Core Concepts

### CI/CD Pipeline Stages

**Typical Pipeline Flow:**
1. **Code Checkout**: Clone repository code
2. **Dependencies**: Install project dependencies
3. **Lint**: Check code style and quality
4. **Test**: Run unit, integration, and E2E tests
5. **Build**: Compile/bundle application
6. **Security Scan**: Check for vulnerabilities
7. **Artifact Creation**: Build Docker images, packages
8. **Deploy**: Deploy to staging/production
9. **Verify**: Run smoke tests, health checks

### Environment Strategy

- **Development**: Continuous deployment on every commit
- **Staging**: Deployment on merge to main/develop
- **Production**: Manual approval or tag-based deployment

### Security Best Practices

- Use secret management (never hardcode credentials)
- Implement OIDC for cloud provider authentication
- Scan dependencies and container images
- Limit workflow permissions to minimum required
- Use environment protection rules

## Implementation Examples

### GitHub Actions - Complete Node.js Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Job 1: Code Quality and Testing
  test:
    name: Test and Lint
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  # Job 2: Security Scanning
  security:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

  # Job 3: Build and Push Docker Image
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.event_name != 'pull_request'
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NODE_ENV=production
            BUILD_DATE=${{ github.event.repository.updated_at }}
            VCS_REF=${{ github.sha }}

  # Job 4: Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster staging-cluster \
            --service myapp-service \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster staging-cluster \
            --services myapp-service

      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/health || exit 1
          curl -f https://staging.example.com/api/version || exit 1

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Staging deployment ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Staging Deployment*\nStatus: ${{ job.status }}\nCommit: ${{ github.sha }}\nActor: ${{ github.actor }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Job 5: Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'release'
    environment:
      name: production
      url: https://example.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_PROD_ROLE_ARN }}
          aws-region: us-east-1

      - name: Deploy to ECS with blue/green
        run: |
          # Update task definition with new image
          NEW_TASK_DEF=$(aws ecs describe-task-definition \
            --task-definition myapp-prod \
            --query 'taskDefinition' | \
            jq --arg IMAGE "${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.event.release.tag_name }}" \
            '.containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')

          aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEF"

          # Update service
          aws ecs update-service \
            --cluster production-cluster \
            --service myapp-service \
            --task-definition myapp-prod

      - name: Monitor deployment
        run: |
          aws ecs wait services-stable \
            --cluster production-cluster \
            --services myapp-service \
            --region us-east-1

      - name: Create deployment record
        uses: chrnorm/deployment-action@v2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          environment: production
          environment-url: https://example.com
```

### GitHub Actions - Matrix Testing

```yaml
# .github/workflows/matrix-test.yml
name: Matrix Testing

on: [push, pull_request]

jobs:
  test:
    name: Test on Node ${{ matrix.node }} and ${{ matrix.os }}
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        node: [18, 20, 21]
        os: [ubuntu-latest, windows-latest, macos-latest]
      fail-fast: false

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

### GitLab CI - Complete Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - deploy
  - verify

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
  NODE_VERSION: "20"

# Default settings
default:
  image: node:${NODE_VERSION}
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
      - .npm/
  before_script:
    - npm ci --cache .npm --prefer-offline

# Lint stage
lint:
  stage: lint
  script:
    - npm run lint
    - npm run type-check
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# Test stage
test:unit:
  stage: test
  services:
    - name: postgres:16
      alias: postgres
    - name: redis:7-alpine
      alias: redis
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/testdb
    REDIS_URL: redis://redis:6379
  script:
    - npm run test:unit
    - npm run test:integration
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
      junit: junit.xml
    paths:
      - coverage/
    expire_in: 30 days

test:e2e:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx playwright install
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 7 days

# Security scanning
security:sast:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker run --rm -v $(pwd):/src aquasec/trivy fs /src
  allow_failure: true

security:dependencies:
  stage: test
  script:
    - npm audit --audit-level=moderate
  allow_failure: true

# Build stage
build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - |
      docker build \
        --build-arg NODE_ENV=production \
        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
        --build-arg VCS_REF=$CI_COMMIT_SHORT_SHA \
        --cache-from $CI_REGISTRY_IMAGE:latest \
        --tag $IMAGE_TAG \
        --tag $CI_REGISTRY_IMAGE:latest \
        .
    - docker push $IMAGE_TAG
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_COMMIT_TAG

# Deploy to staging
deploy:staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl jq
  script:
    - |
      curl -X POST "https://api.staging.example.com/deploy" \
        -H "Authorization: Bearer $STAGING_DEPLOY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"image\": \"$IMAGE_TAG\", \"commit\": \"$CI_COMMIT_SHORT_SHA\"}"
  environment:
    name: staging
    url: https://staging.example.com
    on_stop: stop:staging
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
  only:
    - develop

# Stop staging environment
stop:staging:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Stopping staging environment"
  environment:
    name: staging
    action: stop
  when: manual
  only:
    - develop

# Deploy to production
deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl jq
  script:
    - |
      curl -X POST "https://api.example.com/deploy" \
        -H "Authorization: Bearer $PROD_DEPLOY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"image\": \"$IMAGE_TAG\", \"commit\": \"$CI_COMMIT_SHORT_SHA\"}"
  environment:
    name: production
    url: https://example.com
  rules:
    - if: $CI_COMMIT_TAG
  when: manual

# Verify deployment
verify:staging:
  stage: verify
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -f https://staging.example.com/health || exit 1
    - curl -f https://staging.example.com/api/version || exit 1
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
  needs:
    - deploy:staging

verify:production:
  stage: verify
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -f https://example.com/health || exit 1
    - curl -f https://example.com/api/version || exit 1
  rules:
    - if: $CI_COMMIT_TAG
  needs:
    - deploy:production
```

### Reusable Workflow (GitHub Actions)

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy Workflow

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true
      aws-role-arn:
        required: true
    outputs:
      deployment-url:
        description: "The URL of the deployment"
        value: ${{ jobs.deploy.outputs.url }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    outputs:
      url: ${{ steps.deploy.outputs.url }}

    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.aws-role-arn }}
          aws-region: us-east-1

      - name: Deploy to ECS
        id: deploy
        run: |
          aws ecs update-service \
            --cluster ${{ inputs.environment }}-cluster \
            --service myapp-service \
            --force-new-deployment

          echo "url=https://${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT

      - name: Wait for stability
        run: |
          aws ecs wait services-stable \
            --cluster ${{ inputs.environment }}-cluster \
            --services myapp-service

# Usage in another workflow
# .github/workflows/main.yml
# jobs:
#   deploy-staging:
#     uses: ./.github/workflows/reusable-deploy.yml
#     with:
#       environment: staging
#       image-tag: ${{ needs.build.outputs.image-tag }}
#     secrets:
#       deploy-token: ${{ secrets.STAGING_DEPLOY_TOKEN }}
#       aws-role-arn: ${{ secrets.AWS_STAGING_ROLE }}
```

## Best Practices

### 1. Secret Management

**Use GitHub/GitLab Secrets**
```yaml
# Reference secrets securely
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**Use OIDC for Cloud Providers**
```yaml
# No need for long-lived credentials
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActions
    aws-region: us-east-1
```

### 2. Caching Dependencies

**GitHub Actions**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

**GitLab CI**
```yaml
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
```

### 3. Conditional Execution

**Run jobs only when needed**
```yaml
# GitHub Actions
jobs:
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

# GitLab CI
deploy:
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      changes:
        - src/**/*
```

### 4. Parallel Execution

**Speed up pipelines with parallelism**
```yaml
# GitHub Actions - Matrix builds
strategy:
  matrix:
    node: [18, 20]
    os: [ubuntu-latest, windows-latest]
  max-parallel: 4

# GitLab CI - Parallel jobs
test:
  parallel: 5
  script:
    - npm run test -- --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
```

### 5. Deployment Strategies

**Blue-Green Deployment**
- Deploy new version alongside old
- Switch traffic after verification
- Easy rollback if issues occur

**Canary Deployment**
- Deploy to small subset of users
- Monitor metrics and errors
- Gradually increase traffic

**Rolling Deployment**
- Update instances one at a time
- Maintain availability during deployment
- Slower but safer

## Common Pitfalls

### ❌ Pitfall 1: Hardcoded Secrets
Storing credentials in workflow files

### ✅ Solution:
Always use secret management systems and environment variables

### ❌ Pitfall 2: No Deployment Verification
Deploying without verifying the deployment succeeded

### ✅ Solution:
Always run smoke tests and health checks after deployment

### ❌ Pitfall 3: Inefficient Caching
Not caching dependencies, rebuilding everything each time

### ✅ Solution:
Implement proper caching strategies for dependencies and build artifacts

### ❌ Pitfall 4: Missing Rollback Strategy
No plan for when deployments fail

### ✅ Solution:
Implement automated rollback mechanisms and keep previous versions available

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [GitLab CI/CD Best Practices](https://docs.gitlab.com/ee/ci/pipelines/pipeline_efficiency.html)
- [OIDC with Cloud Providers](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
