# {{projectName}}

Full-stack monorepo with Next.js frontend and FastAPI backend.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: shadcn/ui

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **API**: RESTful with async support
- **Validation**: Pydantic v2

### Database & Infrastructure
- **Database**: PostgreSQL 15 (via Supabase)
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Caching**: Redis
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### Development Tools
- **Package Managers**: pnpm (Node.js), uv (Python)
- **Testing**: Vitest (Frontend), pytest (Backend)
- **Linting**: ESLint (Frontend), Ruff (Backend)
- **CI/CD**: GitHub Actions

## Project Structure

```
{{projectName}}/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── backend/           # FastAPI application
│       ├── app/
│       ├── alembic/
│       ├── tests/
│       ├── pyproject.toml
│       └── alembic.ini
├── docker-compose.yml
├── package.json           # Node.js workspace
├── pyproject.toml         # Python workspace
└── .python-version
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm 8+
- uv (Python package manager)
- Docker and Docker Compose

### Installation

1. Install Node.js dependencies:
```bash
pnpm install
```

2. Install Python dependencies:
```bash
uv sync
```

3. Start Docker services:
```bash
pnpm docker:up
```

4. Set up environment variables:
```bash
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```

5. Run database migrations:
```bash
cd apps/backend
uv run alembic upgrade head
```

6. Start development servers:
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development

### Running Applications

```bash
# Start both frontend and backend
pnpm dev

# Start only frontend
pnpm dev:frontend

# Start only backend
pnpm dev:backend
```

### Building

```bash
# Build frontend
pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Test frontend only
pnpm --filter=frontend test

# Test backend only
cd apps/backend && uv run pytest
```

### Linting and Formatting

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format
```

### Database

```bash
# Create new migration
cd apps/backend
uv run alembic revision --autogenerate -m "description"

# Run migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1
```

### Docker

```bash
# Start services
pnpm docker:up

# Stop services
pnpm docker:down

# View logs
pnpm docker:logs
```

## API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Deployment

### Building for Production

```bash
# Build frontend
pnpm build

# Build Docker images
docker build -f Dockerfile.frontend -t {{projectName}}-frontend .
docker build -f Dockerfile.backend -t {{projectName}}-backend .
```

### Environment Variables

Make sure to set all required environment variables in production:

- `DATABASE_URL`
- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `REDIS_URL`
- `CORS_ORIGINS`

## Python Package Management

This project uses [uv](https://github.com/astral-sh/uv) for fast, reliable Python package management:

```bash
# Add a package
cd apps/backend
uv add package-name

# Add a dev dependency
uv add --dev package-name

# Update dependencies
uv sync

# Lock dependencies
uv lock
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
