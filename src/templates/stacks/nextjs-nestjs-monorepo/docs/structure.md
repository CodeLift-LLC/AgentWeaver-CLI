# Project Structure

## Monorepo Architecture

This project uses a monorepo architecture with Turborepo and pnpm workspaces.

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
NestJS 10 application with:
- RESTful API architecture
- TypeScript
- Drizzle ORM for database access
- JWT authentication
- Swagger API documentation

### `/packages`
Contains shared packages used across applications:

#### `/packages/shared`
Shared TypeScript types, utilities, and business logic:
- Common type definitions
- Validation schemas (Zod)
- Shared constants
- Utility functions

## Key Files

### Root Level
- `package.json` - Root package with workspace configuration
- `pnpm-workspace.yaml` - Workspace definition
- `turbo.json` - Turborepo configuration for build orchestration
- `tsconfig.json` - Base TypeScript configuration
- `docker-compose.yml` - Local development infrastructure

### Application Level
Each application has:
- `package.json` - Application dependencies and scripts
- `tsconfig.json` - TypeScript configuration extending root
- `.env.example` - Environment variable template

## Workflow

### Development
1. Changes to `/packages/shared` automatically rebuild dependent apps
2. Turborepo caches build outputs for faster rebuilds
3. Hot reload enabled for both frontend and backend

### Building
Turborepo orchestrates builds in dependency order:
1. Shared packages build first
2. Applications build using built shared packages
3. Outputs cached for subsequent builds

### Testing
Each package maintains its own tests:
- Unit tests with Vitest
- Integration tests in backend
- E2E tests for critical flows

## Dependencies

### Workspace Dependencies
Packages reference each other using workspace protocol:
```json
{
  "dependencies": {
    "@{{projectName}}/shared": "workspace:*"
  }
}
```

### External Dependencies
Managed at the workspace root when possible, with app-specific dependencies in individual packages.

## Best Practices

1. **Shared Code**: Place reusable code in `/packages/shared`
2. **Type Safety**: Use TypeScript strictly across all packages
3. **Validation**: Use Zod schemas in shared package
4. **API Contracts**: Define API types in shared package
5. **Environment Variables**: Never commit `.env` files
6. **Testing**: Test shared utilities thoroughly
7. **Documentation**: Update this file when structure changes
