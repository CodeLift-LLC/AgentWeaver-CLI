# NestJS Project Structure - Vertical Slice Architecture

## Vertical Slice Architecture for NestJS

Each feature is organized as a self-contained NestJS module with controllers, services, DTOs, and data access.

```
src/
├── main.ts
├── app.module.ts
├── features/                    # Vertical slices
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/
│   └── ...
├── lib/                         # Shared infrastructure
│   ├── db/
│   └── utils/
└── common/                      # Shared across app
    ├── decorators/
    ├── filters/
    ├── guards/
    └── pipes/
```

See Next.js template structure.md for detailed VSA principles.
