# {{projectName}}

NestJS 10 Backend API with Vertical Slice Architecture

## Tech Stack

- **Backend**: NestJS 10, TypeScript, Node.js 20
- **Database**: Supabase (PostgreSQL 15 + pgvector)
- **ORM**: Drizzle ORM with drizzle-kit migrations
{{#if features.authentication}}
- **Authentication**: Supabase Auth (GoTrue) + JWT
{{/if}}
{{#if features.aiIntegration}}
- **AI**: OpenAI SDK with Langfuse observability
{{/if}}
{{#if features.vectorSearch}}
- **Vector Search**: pgvector extension
{{/if}}
{{#if features.payments}}
- **Payments**: Stripe
{{/if}}
{{#if features.email}}
- **Email**: @nestjs-modules/mailer (development with MailHog)
{{/if}}
{{#if features.fileStorage}}
- **File Storage**: Supabase Storage
{{/if}}
- **Testing**: Jest (unit/integration), Supertest (E2E)
- **API Documentation**: Swagger/OpenAPI
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm
- **Containerization**: Docker with multi-stage builds

## Architecture

This project uses **Vertical Slice Architecture (VSA)** - each feature is organized as a self-contained vertical slice with controllers, services, DTOs, and data access.

See [docs/structure.md](docs/structure.md) for detailed folder structure.

## Prerequisites

- Node.js 18+ (preferably 20 LTS)
- pnpm 8+ (`npm install -g pnpm`)
- Docker and Docker Compose
- Git

## Quick Start

### 1. Install Dependencies

```bash
cd {{projectName}}
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://postgres:your-super-secret-password@localhost:54322/postgres

# App
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
{{#if features.aiIntegration}}

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Langfuse
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key
LANGFUSE_HOST=http://localhost:3001
{{/if}}
{{#if features.payments}}

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
{{/if}}
```

### 3. Start Services

```bash
docker compose up -d
```

Services running:
- PostgreSQL: `localhost:54322`
{{#if features.authentication}}
- Supabase Auth: `localhost:54321`
{{/if}}
- Supabase Studio: `localhost:54323`
{{#if features.fileStorage}}
- Supabase Storage: `localhost:54324`
{{/if}}
- Redis: `localhost:6379`
{{#if features.aiIntegration}}
- Langfuse: `localhost:3001`
{{/if}}
{{#if features.email}}
- MailHog: `localhost:8025`
{{/if}}

### 4. Database Setup

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Seed database
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm start:dev
```

API available at: http://localhost:3000
Swagger docs: http://localhost:3000/api

## Development

### Scripts

```bash
# Development
pnpm start:dev          # Start with watch mode
pnpm start:debug        # Start with debug mode
pnpm build              # Build for production
pnpm start:prod         # Start production server

# Code Quality
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage
pnpm test:e2e           # Run E2E tests

# Database
pnpm db:generate        # Generate migrations
pnpm db:migrate         # Apply migrations
pnpm db:studio          # Open Drizzle Studio
```

### Project Structure (Vertical Slice Architecture)

```
src/
├── main.ts                      # Application entry point
├── app.module.ts                # Root module
├── features/                    # Vertical slices
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   └── ...
├── lib/                         # Shared utilities
│   ├── db/                      # Database client & schema
│   ├── supabase/                # Supabase client
│   └── utils/                   # Helpers
└── common/                      # Shared across app
    ├── decorators/
    ├── filters/
    ├── guards/
    ├── interceptors/
    └── pipes/
```

## Testing

### Unit Tests

```bash
pnpm test
```

Tests are colocated with features:
```
src/features/users/
├── users.service.ts
├── users.service.spec.ts
├── users.controller.ts
└── users.controller.spec.ts
```

### E2E Tests

```bash
pnpm test:e2e
```

E2E tests in `test/` directory:
```
test/
├── app.e2e-spec.ts
├── auth.e2e-spec.ts
└── users.e2e-spec.ts
```

## API Documentation

Swagger documentation auto-generated at: `http://localhost:3000/api`

## Deployment

### Docker Production Build

```bash
docker build -t {{projectName}} .
docker run -p 3000:3000 --env-file .env {{projectName}}
```

### Docker Compose Production

```bash
docker compose -f docker-compose.prod.yml up -d
```

## License

MIT
