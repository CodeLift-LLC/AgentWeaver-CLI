# {{projectName}}

Enterprise monorepo built with Next.js frontend and NestJS backend.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: shadcn/ui

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **API**: RESTful
- **Validation**: class-validator

### Database & Infrastructure
- **Database**: PostgreSQL 15 (via Supabase)
- **ORM**: Drizzle
- **Caching**: Redis
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### Development Tools
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Testing**: Vitest
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
│   └── backend/           # NestJS application
│       ├── src/
│       ├── package.json
│       └── nest-cli.json
├── packages/
│   └── shared/            # Shared types and utilities
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker and Docker Compose

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start Docker services:
```bash
pnpm docker:up
```

3. Set up environment variables:
```bash
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```

4. Build shared packages:
```bash
pnpm --filter=@{{projectName}}/shared build
```

5. Run database migrations:
```bash
pnpm --filter=@{{projectName}}/backend db:migrate
```

6. Start development servers:
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Supabase Studio: http://localhost:54323

## Development

### Running Applications

```bash
# Start all applications in development mode
pnpm dev

# Start only frontend
pnpm --filter=@{{projectName}}/frontend dev

# Start only backend
pnpm --filter=@{{projectName}}/backend dev
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter=@{{projectName}}/frontend build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter=@{{projectName}}/backend test

# Run tests in watch mode
pnpm --filter=@{{projectName}}/backend test:watch
```

### Database

```bash
# Generate migration
pnpm --filter=@{{projectName}}/backend db:generate

# Run migrations
pnpm --filter=@{{projectName}}/backend db:migrate

# Open Drizzle Studio
pnpm --filter=@{{projectName}}/backend db:studio
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

## Deployment

### Building for Production

```bash
# Build all applications
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

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
