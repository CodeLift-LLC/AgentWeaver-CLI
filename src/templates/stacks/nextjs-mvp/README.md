# {{projectName}}

Next.js 15 Full-Stack MVP with Vertical Slice Architecture

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js App Router API routes
- **Database**: Supabase (PostgreSQL 15 + pgvector)
- **ORM**: Drizzle ORM with drizzle-kit migrations
{{#if features.authentication}}
- **Authentication**: Supabase Auth (GoTrue)
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
- **Email**: Resend (development with MailHog)
{{/if}}
{{#if features.fileStorage}}
- **File Storage**: Supabase Storage
{{/if}}
{{#if features.realtime}}
- **Realtime**: Supabase Realtime
{{/if}}
- **Testing**: Vitest (unit/integration), Playwright (E2E), React Testing Library
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm with Turborepo
- **Containerization**: Docker with multi-stage builds

## Architecture

This project uses **Vertical Slice Architecture (VSA)** - each feature is organized as a self-contained vertical slice with all necessary layers (UI, API, data access, types).

See [docs/structure.md](docs/structure.md) for detailed folder structure.

## Prerequisites

- Node.js 18+ (preferably 20 LTS)
- pnpm 8+ (`npm install -g pnpm`)
- Docker and Docker Compose
- Git

## Quick Start

### 1. Clone and Install

```bash
cd {{projectName}}
pnpm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in required values:

```bash
# Database (provided by local Supabase)
DATABASE_URL=postgresql://postgres:your-super-secret-password@localhost:54322/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth (use same secret in docker-compose.yml)
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
{{#if features.aiIntegration}}

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Langfuse (optional, for AI observability)
LANGFUSE_PUBLIC_KEY=pk-lf-your-public-key
LANGFUSE_SECRET_KEY=sk-lf-your-secret-key
LANGFUSE_HOST=http://localhost:3001
{{/if}}
{{#if features.payments}}

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
{{/if}}
{{#if features.email}}

# Email (Resend)
RESEND_API_KEY=re_your-resend-api-key
{{/if}}
```

### 3. Start Services

Start all backend services with Docker Compose:

```bash
docker compose up -d
```

This starts:
- PostgreSQL with pgvector (port 54322)
{{#if features.authentication}}
- Supabase Auth (port 54321)
{{/if}}
- Supabase Studio (port 54323)
{{#if features.fileStorage}}
- Supabase Storage (port 54324)
{{/if}}
{{#if features.realtime}}
- Supabase Realtime (port 54325)
{{/if}}
- Redis (port 6379)
{{#if features.aiIntegration}}
- Langfuse (port 3001)
{{/if}}
{{#if features.email}}
- MailHog (SMTP: 1025, Web UI: 8025)
{{/if}}

### 4. Database Setup

Generate and run migrations:

```bash
# Generate migration files from schema
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# (Optional) Seed database with sample data
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking

# Database
pnpm db:generate      # Generate migrations from schema changes
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push schema changes directly (dev only)
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Drizzle Studio

# Testing
pnpm test             # Run unit tests with Vitest
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI

# Docker
docker compose up -d          # Start all services
docker compose down           # Stop all services
docker compose logs -f        # View service logs
```

### Project Structure (Vertical Slice Architecture)

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes group
│   ├── (dashboard)/         # Dashboard routes group
│   ├── api/                 # API routes
│   └── layout.tsx
├── features/                 # Vertical slices (features)
│   ├── auth/
│   │   ├── components/      # Feature-specific UI components
│   │   ├── api/             # Feature-specific API logic
│   │   ├── hooks/           # Feature-specific hooks
│   │   ├── types/           # Feature-specific types
│   │   └── utils/           # Feature-specific utilities
│   ├── users/
│   └── ...
├── lib/                     # Shared utilities
│   ├── db/                  # Database client and schema
│   ├── supabase/            # Supabase client
│   └── utils/               # Shared helpers
├── components/              # Shared UI components
└── test/                    # Test setup and utilities
```

See [docs/structure.md](docs/structure.md) for complete structure.

## Testing

### Unit and Integration Tests (Vitest)

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

Tests are colocated with features:
```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.test.tsx
└── utils/
    ├── validation.ts
    └── validation.test.ts
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Run specific browser
pnpm test:e2e --project=chromium
```

E2E tests are in the `e2e/` directory:
```
e2e/
├── auth/
│   ├── login.spec.ts
│   └── signup.spec.ts
└── dashboard/
    └── overview.spec.ts
```

## Database Management

### Drizzle ORM Workflow

1. **Define schema** in `src/lib/db/schema.ts`
2. **Generate migrations**: `pnpm db:generate`
3. **Review** migration SQL in `drizzle/migrations/`
4. **Apply migrations**: `pnpm db:migrate`

### Example Schema

```typescript
// src/lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});
```
{{#if features.vectorSearch}}

### Vector Search with pgvector

```typescript
import { pgTable, text, vector } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }), // OpenAI embeddings
});

// Query similar documents
const similar = await db
  .select()
  .from(documents)
  .orderBy(cosineDistance(documents.embedding, queryEmbedding))
  .limit(10);
```
{{/if}}

## Deployment

### Docker Production Build

```bash
# Build production image
docker build -t {{projectName}} .

# Run container
docker run -p 3000:3000 --env-file .env {{projectName}}
```

### Docker Compose Production

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Vercel Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

**Important**: For production, use managed Supabase instead of self-hosted.

## CI/CD

GitHub Actions workflows are configured for:

- **Linting and Type Checking**: ESLint + TypeScript
- **Unit Tests**: Vitest with coverage reporting
- **E2E Tests**: Playwright with PostgreSQL service
- **Build Verification**: Ensures production build succeeds

Workflows run on push to `main`/`develop` and on pull requests.

## Service URLs (Local Development)

| Service | URL | Credentials |
|---------|-----|-------------|
| Next.js App | http://localhost:3000 | - |
| Supabase Studio | http://localhost:54323 | - |
{{#if features.aiIntegration}}
| Langfuse | http://localhost:3001 | - |
{{/if}}
{{#if features.email}}
| MailHog UI | http://localhost:8025 | - |
{{/if}}
| PostgreSQL | localhost:54322 | postgres / (see .env) |

## Troubleshooting

### Services won't start

```bash
# Stop all services
docker compose down

# Remove volumes and restart
docker compose down -v
docker compose up -d
```

### Database connection errors

- Ensure PostgreSQL is running: `docker compose ps`
- Check `DATABASE_URL` in `.env` matches docker-compose.yml
- Verify port 54322 is not in use: `netstat -an | grep 54322`

### Migrations fail

```bash
# Reset database (CAUTION: deletes all data)
docker compose down -v
docker compose up -d
pnpm db:migrate
```

### TypeScript errors

```bash
# Regenerate types
pnpm db:generate

# Clear Next.js cache
rm -rf .next
pnpm dev
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Supabase Documentation](https://supabase.com/docs)
{{#if features.aiIntegration}}
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Langfuse Documentation](https://langfuse.com/docs)
{{/if}}
- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)

## License

MIT
