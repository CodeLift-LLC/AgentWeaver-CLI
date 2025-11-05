# Project Structure

## Monorepo Architecture

This project uses a monorepo architecture with separate package managers for frontend (pnpm) and backend (uv).

## Directory Structure

### `/apps`
Contains all deployable applications:

#### `/apps/frontend`
Next.js 15 application with:
- App Router architecture
- TypeScript
- Tailwind CSS for styling
- Zustand for state management
- shadcn/ui components

#### `/apps/backend`
FastAPI application with:
- Async/await support
- Python 3.11 type hints
- SQLAlchemy 2.0 ORM
- Alembic migrations
- Pydantic v2 validation
- Automatic API documentation (Swagger/ReDoc)

## Key Files

### Root Level
- `package.json` - Node.js workspace and scripts
- `pyproject.toml` - Python workspace configuration
- `.python-version` - Python version specification
- `docker-compose.yml` - Local development infrastructure

### Frontend (`/apps/frontend`)
- `package.json` - Frontend dependencies
- `next.config.ts` - Next.js configuration with API proxy
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration

### Backend (`/apps/backend`)
- `pyproject.toml` - Python dependencies and project metadata
- `alembic.ini` - Database migration configuration
- `app/` - Application source code
- `tests/` - Test suite

## Workflow

### Development
1. Run `pnpm dev` to start both frontend and backend
2. Frontend runs on port 3000
3. Backend runs on port 8000
4. API requests from frontend are proxied to backend

### API Communication
The Next.js frontend is configured to proxy API requests:
- Requests to `/api/*` are forwarded to the FastAPI backend
- This avoids CORS issues in development
- In production, use proper CORS configuration

### Database Migrations
Using Alembic for database schema management:
1. Make changes to SQLAlchemy models
2. Generate migration: `uv run alembic revision --autogenerate`
3. Review and edit migration file
4. Apply migration: `uv run alembic upgrade head`

### Testing

#### Frontend Tests
- Unit tests with Vitest
- Component tests with React Testing Library
- Run with: `pnpm --filter=frontend test`

#### Backend Tests
- Unit and integration tests with pytest
- Async test support with pytest-asyncio
- Run with: `cd apps/backend && uv run pytest`

## Package Management

### Node.js (pnpm)
- Workspace defined in root `package.json`
- Frontend dependencies in `apps/frontend/package.json`
- Shared dev dependencies at root

### Python (uv)
- Workspace defined in root `pyproject.toml`
- Backend dependencies in `apps/backend/pyproject.toml`
- Fast dependency resolution and installation
- Automatic virtual environment management

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `REDIS_URL` - Redis connection string
- `CORS_ORIGINS` - Allowed CORS origins

## Best Practices

1. **Type Safety**: Use TypeScript in frontend, Python type hints in backend
2. **Validation**: Validate data with Zod (frontend) and Pydantic (backend)
3. **API Contracts**: Keep API request/response types in sync
4. **Testing**: Write tests for business logic and API endpoints
5. **Migrations**: Never edit existing migration files, create new ones
6. **Environment Variables**: Never commit `.env` files
7. **Documentation**: Update API docs when adding endpoints
8. **Error Handling**: Use proper HTTP status codes and error messages

## Deployment

### Frontend
- Build with: `pnpm build`
- Deploy to Vercel, Netlify, or any Node.js host
- Set environment variables in hosting platform

### Backend
- Build Docker image: `docker build -f Dockerfile.backend`
- Deploy to any Python-capable platform
- Ensure database migrations run before starting

### Docker Compose
For simple deployments, use the provided docker-compose.yml:
```bash
docker-compose up -d
```

This starts all services including frontend, backend, and infrastructure.
