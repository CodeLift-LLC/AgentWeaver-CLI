# Tech Stack Templates

AgentWeaver CLI includes production-ready tech stack templates to bootstrap your projects instantly with modern best practices.

## Available Templates

### 1. Next.js Full-Stack MVP (`nextjs-mvp`)

**Best for:** Rapid prototyping, MVPs, small teams
**Complexity:** Beginner
**Tech Stack:**
- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js App Router
- **UI:** Tailwind CSS, shadcn/ui
- **Database:** Supabase (PostgreSQL 15 + pgvector)
- **ORM:** Drizzle ORM
- **Testing:** Vitest + Playwright
- **Package Manager:** pnpm + Turborepo

**Features:**
- ✅ Authentication (Supabase Auth) - Default
- ⚙️ AI Integration (OpenAI SDK + Langfuse) - Optional
- ⚙️ Vector Search (pgvector) - Optional
- ⚙️ Payments (Stripe) - Optional
- ⚙️ Email (Resend) - Optional
- ✅ File Storage (Supabase Storage) - Default
- ✅ Realtime (Supabase Realtime) - Default
- ⚙️ Analytics - Optional

---

### 2. NestJS Backend API (`nestjs-backend`)

**Best for:** Enterprise APIs, microservices, scalable backends
**Complexity:** Intermediate
**Tech Stack:**
- **Framework:** NestJS 10, TypeScript
- **Runtime:** Node.js 20
- **Database:** Supabase (PostgreSQL 15 + pgvector)
- **ORM:** Drizzle ORM
- **Testing:** Jest + Supertest
- **API Docs:** Swagger/OpenAPI
- **Package Manager:** pnpm

**Features:**
- ✅ Authentication (Supabase Auth + JWT) - Default
- ⚙️ AI Integration (OpenAI SDK + Langfuse) - Optional
- ⚙️ Vector Search (pgvector) - Optional
- ⚙️ Payments (Stripe) - Optional
- ⚙️ Email (@nestjs-modules/mailer) - Optional
- ✅ File Storage (Supabase Storage) - Default
- ⚙️ Realtime (Supabase Realtime) - Optional
- ⚙️ Analytics - Optional

---

### 3. FastAPI Backend API (`fastapi-backend`)

**Best for:** ML/AI workloads, data-intensive APIs, Python backends
**Complexity:** Intermediate
**Tech Stack:**
- **Framework:** FastAPI 0.110+, Python 3.11+
- **Package Manager:** uv (modern Python package manager)
- **Database:** Supabase (PostgreSQL 15 + pgvector)
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Testing:** pytest + httpx
- **API Docs:** OpenAPI/Swagger (built-in)

**Features:**
- ✅ Authentication (Supabase Auth + JWT) - Default
- ⚙️ AI Integration (OpenAI SDK + Langfuse) - Optional
- ⚙️ Vector Search (pgvector) - Optional
- ⚙️ Payments (Stripe) - Optional
- ⚙️ Email (fastapi-mail) - Optional
- ✅ File Storage (Supabase Storage) - Default
- ⚙️ Realtime - Optional
- ⚙️ Analytics - Optional

---

## Usage

### Interactive Mode (Recommended)

```bash
agentweaver init
```

You'll be prompted to:
1. Choose whether to use a template
2. Select a template
3. Customize features
4. Configure agents and skills

### Non-Interactive Mode

```bash
# Use specific template with default features
agentweaver init --template nextjs-mvp --yes

# Use specific template (interactive feature selection)
agentweaver init --template nestjs-backend
```

### List Available Templates

```bash
agentweaver templates
```

---

## What Gets Generated

Each template generates:

### Configuration Files
- Docker Compose configuration
- Dockerfile (multi-stage production build)
- Package manager files (package.json/pyproject.toml)
- TypeScript/Python configuration
- ESLint/Ruff, Prettier configuration
- Test configuration (Vitest/Jest/pytest)

### CI/CD
- GitHub Actions workflow
- Lint, type-check, test, and build jobs
- E2E test setup

### Documentation
- Comprehensive README.md
- Architecture guide (Vertical Slice Architecture)
- Environment variables example

### Docker Services

Based on selected features, services include:
- PostgreSQL (Supabase) with pgvector
- Supabase Auth (GoTrue)
- Supabase Studio (database UI)
- Supabase Storage (optional)
- Supabase Realtime (optional)
- Redis (caching/queues)
- Langfuse (AI observability, optional)
- MailHog (email testing, optional)

---

## Architecture

All templates use **Vertical Slice Architecture (VSA)**:

```
src/features/           # Each feature is self-contained
├── auth/
│   ├── components/     # UI components (Next.js)
│   ├── api/           # Business logic
│   ├── hooks/         # React hooks (Next.js)
│   ├── types/         # TypeScript types
│   └── utils/         # Feature utilities
├── users/
└── ...
```

**Benefits:**
- Features are self-contained and independent
- Easy to add/remove features
- Minimal coupling between features
- Easy to understand and navigate

---

## Post-Installation Steps

After template installation, you'll typically:

1. **Install dependencies**
   ```bash
   # Node.js projects
   pnpm install

   # Python projects
   uv sync
   ```

2. **Start services**
   ```bash
   docker compose up -d
   ```

3. **Run migrations**
   ```bash
   # Next.js/NestJS
   pnpm db:migrate

   # FastAPI
   uv run alembic upgrade head
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

5. **Start development server**
   ```bash
   # Next.js/NestJS
   pnpm dev

   # FastAPI
   uv run uvicorn app.main:app --reload
   ```

---

## Customization

### Adding New Features

Each template follows VSA, making it easy to add features:

1. Create a new feature directory
2. Implement the feature components/services
3. Export through `index.ts`
4. Features remain isolated

### Removing Features

Simply delete the feature directory - no complex refactoring needed.

---

## Technology Choices

### Why Supabase?
- Open-source Firebase alternative
- PostgreSQL with pgvector for vector search
- Built-in authentication
- Real-time subscriptions
- File storage
- Runs locally with Docker

### Why Drizzle ORM (Node.js)?
- TypeScript-first
- Lightweight and performant
- SQL-like syntax
- Excellent type inference
- Migration toolkit included

### Why SQLAlchemy 2.0 (Python)?
- Industry standard for Python
- Powerful ORM with raw SQL capability
- Excellent async support
- Alembic for migrations

### Why pnpm?
- Faster than npm/yarn
- Efficient disk space usage
- Strict dependency resolution
- Monorepo support

### Why uv (Python)?
- 10-100x faster than pip
- Rust-based package manager
- Modern dependency resolution
- Lock file support

---

## Comparison Matrix

| Feature | Next.js MVP | NestJS Backend | FastAPI Backend |
|---------|-------------|----------------|-----------------|
| **Language** | TypeScript | TypeScript | Python |
| **Use Case** | Full-stack MVPs | Enterprise APIs | ML/AI APIs |
| **Complexity** | Beginner | Intermediate | Intermediate |
| **Frontend** | ✅ Included | ❌ API only | ❌ API only |
| **Package Manager** | pnpm | pnpm | uv |
| **ORM** | Drizzle | Drizzle | SQLAlchemy |
| **Testing** | Vitest + Playwright | Jest + Supertest | pytest + httpx |
| **Build Time** | ~30s | ~20s | ~10s |
| **Docker Image** | ~500MB | ~400MB | ~200MB |

---

## Contributing

To add a new template:

1. Create directory in `src/templates/stacks/<template-id>/`
2. Create `manifest.yml` with template configuration
3. Add template files with Handlebars for conditionals
4. Test with `agentweaver init --template <template-id>`

See existing templates for examples.

---

## Support

- **Documentation:** [GitHub Repository](https://github.com/CodeLift-LLC/AgentWeaver-CLI)
- **Issues:** [GitHub Issues](https://github.com/CodeLift-LLC/AgentWeaver-CLI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/CodeLift-LLC/AgentWeaver-CLI/discussions)
