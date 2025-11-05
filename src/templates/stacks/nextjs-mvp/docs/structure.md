# Project Structure - Vertical Slice Architecture

This project uses **Vertical Slice Architecture (VSA)**, where each feature is organized as a self-contained vertical slice with all necessary layers (UI, API, data access, types) in one place.

## Why Vertical Slice Architecture?

**Traditional Layered Architecture:**
```
src/
├── components/      # ALL components
├── api/            # ALL API logic
├── models/         # ALL data models
└── utils/          # ALL utilities
```
❌ Features are scattered across layers
❌ Hard to find all code for a feature
❌ Tight coupling between unrelated features

**Vertical Slice Architecture:**
```
src/features/
├── auth/           # Everything for authentication
├── users/          # Everything for user management
└── posts/          # Everything for posts
```
✅ Each feature is self-contained
✅ Easy to locate feature code
✅ Features are loosely coupled
✅ Easy to add/remove features

## Full Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI/CD pipeline
│       └── deploy.yml                # Deployment workflow
│
├── drizzle/
│   └── migrations/                   # Database migration files
│
├── e2e/                              # E2E tests (Playwright)
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── dashboard/
│   │   └── overview.spec.ts
│   └── fixtures/                     # Test fixtures and helpers
│
├── public/                           # Static assets
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/              # Dashboard route group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...supabase]/
│   │   │   │       └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── features/                     # 🎯 VERTICAL SLICES (Features)
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── components/           # Auth-specific components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LoginForm.test.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── AuthProvider.tsx
│   │   │   ├── api/                  # Auth API logic
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.service.test.ts
│   │   │   ├── hooks/                # Auth-specific hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useSession.ts
│   │   │   │   └── useAuth.test.ts
│   │   │   ├── types/                # Auth types
│   │   │   │   └── index.ts
│   │   │   ├── utils/                # Auth utilities
│   │   │   │   ├── validation.ts
│   │   │   │   └── validation.test.ts
│   │   │   └── index.ts              # Public exports
│   │   │
│   │   ├── users/                    # User management feature
│   │   │   ├── components/
│   │   │   │   ├── UserProfile.tsx
│   │   │   │   ├── UserList.tsx
│   │   │   │   └── UserAvatar.tsx
│   │   │   ├── api/
│   │   │   │   └── users.service.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useUser.ts
│   │   │   │   └── useUserProfile.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/                # Dashboard feature
│   │   │   ├── components/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── ActivityFeed.tsx
│   │   │   │   └── RecentItems.tsx
│   │   │   ├── api/
│   │   │   │   └── dashboard.service.ts
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardStats.ts
│   │   │   └── index.ts
{{#if features.aiIntegration}}
│   │   │
│   │   ├── ai/                       # AI feature (chat, completions)
│   │   │   ├── components/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   └── PromptInput.tsx
│   │   │   ├── api/
│   │   │   │   ├── openai.service.ts
│   │   │   │   └── embeddings.service.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts
│   │   │   │   └── useCompletion.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
{{/if}}
{{#if features.payments}}
│   │   │
│   │   ├── payments/                 # Payments feature
│   │   │   ├── components/
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── PricingTable.tsx
│   │   │   │   └── PaymentHistory.tsx
│   │   │   ├── api/
│   │   │   │   ├── stripe.service.ts
│   │   │   │   └── webhooks.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useCheckout.ts
│   │   │   │   └── useSubscription.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
{{/if}}
{{#if features.vectorSearch}}
│   │   │
│   │   ├── search/                   # Vector search feature
│   │   │   ├── components/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   └── SearchFilters.tsx
│   │   │   ├── api/
│   │   │   │   ├── search.service.ts
│   │   │   │   └── embeddings.service.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useSearch.ts
│   │   │   │   └── useVectorSearch.ts
│   │   │   └── index.ts
{{/if}}
│   │   │
│   │   └── ...                       # Other features
│   │
│   ├── components/                   # ✨ SHARED components only
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── providers/
│   │       └── ThemeProvider.tsx
│   │
│   ├── lib/                          # Shared infrastructure
│   │   ├── db/                       # Database
│   │   │   ├── index.ts              # Drizzle client
│   │   │   ├── schema.ts             # Database schema
│   │   │   └── migrations.ts
│   │   ├── supabase/                 # Supabase client
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
{{#if features.aiIntegration}}
│   │   ├── openai/                   # OpenAI client
│   │   │   ├── client.ts
│   │   │   └── config.ts
{{/if}}
│   │   ├── redis/                    # Redis client
│   │   │   └── client.ts
│   │   └── utils/                    # Shared utilities
│   │       ├── cn.ts                 # Class name utility
│   │       ├── date.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                        # Shared hooks
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/                        # Shared types
│   │   ├── global.d.ts
│   │   └── env.d.ts
│   │
│   └── test/                         # Test utilities
│       ├── setup.ts                  # Vitest setup
│       ├── helpers.tsx               # Test helpers
│       └── mocks/
│           ├── handlers.ts           # MSW handlers
│           └── server.ts
│
├── .env.example                      # Environment variables template
├── .gitignore
├── docker-compose.yml                # Local development services
├── docker-compose.prod.yml           # Production configuration
├── Dockerfile                        # Production build
├── drizzle.config.ts                 # Drizzle ORM configuration
├── next.config.js                    # Next.js configuration
├── package.json
├── pnpm-workspace.yaml               # pnpm workspace
├── playwright.config.ts              # Playwright configuration
├── README.md
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── turbo.json                        # Turborepo configuration
└── vitest.config.ts                  # Vitest configuration
```

## Feature Structure Guidelines

### What Goes in a Feature Slice?

Each feature slice (`src/features/{feature-name}/`) should contain:

#### 1. **components/** - Feature-specific UI components
```typescript
// src/features/auth/components/LoginForm.tsx
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const { login } = useAuth();
  // Component logic
}
```

#### 2. **api/** - Business logic and external API calls
```typescript
// src/features/auth/api/auth.service.ts
import { supabase } from '@/lib/supabase/client';

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
};
```

#### 3. **hooks/** - Feature-specific React hooks
```typescript
// src/features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { authService } from '../api/auth.service';

export function useAuth() {
  const login = useCallback(async (email: string, password: string) => {
    return authService.login(email, password);
  }, []);

  return { login };
}
```

#### 4. **types/** - Feature-specific TypeScript types
```typescript
// src/features/auth/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
```

#### 5. **utils/** - Feature-specific helper functions
```typescript
// src/features/auth/utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

#### 6. **index.ts** - Public API (exports)
```typescript
// src/features/auth/index.ts
// Export only what other features need
export { LoginForm, SignupForm } from './components';
export { useAuth, useSession } from './hooks';
export type { User, LoginCredentials } from './types';
```

### What Goes in `src/components/`?

**Only truly shared components** used across multiple features:

- **ui/** - Generic UI components (shadcn/ui)
- **layout/** - Layout components (Header, Footer, Sidebar)
- **providers/** - Global providers (Theme, Auth context wrapper)

### What Goes in `src/lib/`?

**Shared infrastructure** that multiple features depend on:

- **db/** - Database client and schema
- **supabase/** - Supabase client instances
- **openai/** - OpenAI client configuration
- **utils/** - Generic utility functions (cn, date formatting, etc.)

## Database Schema Organization

Database schema is centralized in `src/lib/db/schema.ts`:

```typescript
// src/lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Users table (used by auth feature)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Posts table (used by posts feature)
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

**Why centralized schema?**
- Single source of truth for database structure
- Easy to see relationships between tables
- Drizzle generates types from schema
- Easier migration management

## API Routes Organization

API routes follow Next.js App Router conventions in `src/app/api/`:

```
src/app/api/
├── auth/                    # Auth endpoints
│   └── [...supabase]/
│       └── route.ts         # Supabase auth callback
├── users/
│   ├── route.ts             # GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts         # GET/PUT/DELETE /api/users/:id
├── posts/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── health/
    └── route.ts             # Health check endpoint
```

**Implementation calls feature services:**
```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { usersService } from '@/features/users/api/users.service';

export async function GET() {
  const users = await usersService.getAll();
  return NextResponse.json(users);
}
```

## Testing Organization

### Unit/Integration Tests (Vitest)
Tests are **colocated** with the code they test:

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.test.tsx        ✅ Colocated
├── api/
│   ├── auth.service.ts
│   └── auth.service.test.ts      ✅ Colocated
└── utils/
    ├── validation.ts
    └── validation.test.ts        ✅ Colocated
```

### E2E Tests (Playwright)
E2E tests are **feature-organized** in `e2e/`:

```
e2e/
├── auth/
│   ├── login.spec.ts
│   └── signup.spec.ts
├── users/
│   ├── profile.spec.ts
│   └── settings.spec.ts
└── fixtures/
    └── test-data.ts
```

## Adding a New Feature

Follow these steps to add a new feature using VSA:

### 1. Create Feature Directory

```bash
mkdir -p src/features/my-feature/{components,api,hooks,types,utils}
```

### 2. Create Feature Files

```typescript
// src/features/my-feature/types/index.ts
export interface MyFeatureData {
  id: string;
  name: string;
}

// src/features/my-feature/api/my-feature.service.ts
import { db } from '@/lib/db';

export const myFeatureService = {
  async getAll() {
    return db.query.myFeature.findMany();
  },
};

// src/features/my-feature/hooks/useMyFeature.ts
import { useQuery } from '@tanstack/react-query';
import { myFeatureService } from '../api/my-feature.service';

export function useMyFeature() {
  return useQuery({
    queryKey: ['my-feature'],
    queryFn: () => myFeatureService.getAll(),
  });
}

// src/features/my-feature/components/MyFeatureList.tsx
import { useMyFeature } from '../hooks/useMyFeature';

export function MyFeatureList() {
  const { data } = useMyFeature();
  // Render logic
}

// src/features/my-feature/index.ts
export { MyFeatureList } from './components/MyFeatureList';
export { useMyFeature } from './hooks/useMyFeature';
export type { MyFeatureData } from './types';
```

### 3. Add Database Schema

```typescript
// src/lib/db/schema.ts
export const myFeature = pgTable('my_feature', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type MyFeature = typeof myFeature.$inferSelect;
```

### 4. Generate Migration

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Add API Route (if needed)

```typescript
// src/app/api/my-feature/route.ts
import { NextResponse } from 'next/server';
import { myFeatureService } from '@/features/my-feature/api/my-feature.service';

export async function GET() {
  const data = await myFeatureService.getAll();
  return NextResponse.json(data);
}
```

### 6. Add Page Route (if needed)

```typescript
// src/app/(dashboard)/my-feature/page.tsx
import { MyFeatureList } from '@/features/my-feature';

export default function MyFeaturePage() {
  return <MyFeatureList />;
}
```

### 7. Write Tests

```typescript
// src/features/my-feature/api/my-feature.service.test.ts
import { describe, it, expect } from 'vitest';
import { myFeatureService } from './my-feature.service';

describe('myFeatureService', () => {
  it('should get all items', async () => {
    const items = await myFeatureService.getAll();
    expect(items).toBeDefined();
  });
});
```

## Benefits of This Structure

✅ **Feature Independence**: Each feature is self-contained
✅ **Easy Navigation**: Find all feature code in one place
✅ **Scalability**: Add features without affecting others
✅ **Team Collaboration**: Teams can work on different features independently
✅ **Code Reuse**: Shared components/utilities are clearly separated
✅ **Testing**: Tests are colocated with code
✅ **Deletion**: Remove entire feature by deleting one folder

## Anti-Patterns to Avoid

❌ **Don't put feature-specific code in shared folders**
```typescript
// ❌ Bad: Feature-specific component in shared folder
src/components/UserLoginForm.tsx

// ✅ Good: Feature-specific component in feature folder
src/features/auth/components/LoginForm.tsx
```

❌ **Don't create deep nesting in features**
```typescript
// ❌ Bad: Too much nesting
src/features/auth/components/forms/login/LoginForm.tsx

// ✅ Good: Flat structure
src/features/auth/components/LoginForm.tsx
```

❌ **Don't couple features to each other directly**
```typescript
// ❌ Bad: Direct coupling
import { userService } from '@/features/users/api/users.service';

// ✅ Good: Use public API
import { useUser } from '@/features/users';
```

❌ **Don't skip the index.ts exports**
```typescript
// ❌ Bad: Direct imports from internal files
import { LoginForm } from '@/features/auth/components/LoginForm';

// ✅ Good: Import from public API
import { LoginForm } from '@/features/auth';
```

## Summary

This Vertical Slice Architecture organizes code by **features** rather than **layers**, making it easier to understand, maintain, and scale your application. Each feature is a self-contained vertical slice with all necessary code in one place, while shared infrastructure remains centralized for reuse.
