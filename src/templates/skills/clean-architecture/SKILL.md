---
name: Clean Architecture
description: Comprehensive guide to implementing Clean Architecture (Uncle Bob) with layered design, dependency inversion, and separation of concerns for maintainable enterprise applications.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - architecture
  - clean-architecture
  - design-patterns
  - enterprise
  - backend
  - layered-architecture
---

# Clean Architecture Skill

This skill provides production-ready patterns for implementing Clean Architecture as defined by Robert C. Martin (Uncle Bob), emphasizing separation of concerns, testability, and independence from frameworks, databases, and external agencies.

## When to Use

- Building enterprise-level applications requiring long-term maintainability
- Projects with complex business logic that must remain independent of frameworks
- Applications requiring high testability and clear separation of concerns
- Systems that may need to swap databases, frameworks, or external services
- Teams working on large codebases with multiple developers
- Applications with complex domain logic and multiple integration points
- Projects requiring strict dependency management and boundaries

## When NOT to Use

- Simple CRUD applications with minimal business logic
- Rapid prototypes or MVPs where speed is critical
- Small applications with a single developer
- Projects with straightforward, unchanging requirements
- Applications where framework coupling is acceptable
- Systems with simple data flows and minimal business rules

## Core Concepts

### The Dependency Rule

**CRITICAL PRINCIPLE**: Dependencies must point inward. Inner layers must not know about outer layers.

```
┌─────────────────────────────────────────────┐
│         Frameworks & Drivers (Layer 4)      │
│   (UI, Database, External Interfaces)       │
│  ┌──────────────────────────────────────┐  │
│  │   Interface Adapters (Layer 3)       │  │
│  │   (Controllers, Presenters, Gateways)│  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │  Application Business Rules    │  │  │
│  │  │      (Use Cases - Layer 2)     │  │  │
│  │  │  ┌──────────────────────────┐  │  │  │
│  │  │  │ Enterprise Business Rules│  │  │  │
│  │  │  │    (Entities - Layer 1)  │  │  │  │
│  │  │  │                          │  │  │  │
│  │  │  └──────────────────────────┘  │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
        ↑  Dependencies flow inward  ↑
```

### The Four Layers

#### Layer 1: Entities (Enterprise Business Rules)
- Core business objects and rules
- Most stable, least likely to change
- No dependencies on any other layer
- Pure business logic

#### Layer 2: Use Cases (Application Business Rules)
- Application-specific business rules
- Orchestrates data flow to/from entities
- Implements business processes
- Defines interfaces for external concerns

#### Layer 3: Interface Adapters
- Converts data between use cases and external formats
- Controllers, Presenters, Gateways
- Adapts external agencies to use case interfaces
- Maps between domain and infrastructure

#### Layer 4: Frameworks & Drivers
- External frameworks, tools, databases
- UI, database implementations, web framework
- Most volatile, frequently changing
- Implementation details

## Project Structure Examples

### Node.js/TypeScript Structure

```
src/
├── domain/                           # Layer 1: Entities
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Order.ts
│   │   └── Product.ts
│   ├── value-objects/
│   │   ├── Email.ts
│   │   ├── Money.ts
│   │   └── Address.ts
│   ├── exceptions/
│   │   ├── DomainException.ts
│   │   └── ValidationException.ts
│   └── services/                     # Domain services (if needed)
│       └── PricingService.ts
│
├── application/                      # Layer 2: Use Cases
│   ├── use-cases/
│   │   ├── user/
│   │   │   ├── RegisterUser.ts
│   │   │   ├── LoginUser.ts
│   │   │   └── UpdateUserProfile.ts
│   │   ├── order/
│   │   │   ├── CreateOrder.ts
│   │   │   ├── CancelOrder.ts
│   │   │   └── GetOrderHistory.ts
│   │   └── product/
│   │       ├── AddProduct.ts
│   │       └── UpdateInventory.ts
│   ├── interfaces/                   # Port interfaces
│   │   ├── repositories/
│   │   │   ├── IUserRepository.ts
│   │   │   ├── IOrderRepository.ts
│   │   │   └── IProductRepository.ts
│   │   ├── services/
│   │   │   ├── IEmailService.ts
│   │   │   ├── IPaymentService.ts
│   │   │   └── IAuthService.ts
│   │   └── presenters/
│   │       ├── IUserPresenter.ts
│   │       └── IOrderPresenter.ts
│   ├── dto/                          # Data Transfer Objects
│   │   ├── UserDTO.ts
│   │   ├── OrderDTO.ts
│   │   └── ProductDTO.ts
│   └── exceptions/
│       ├── UseCaseException.ts
│       └── NotFoundException.ts
│
├── infrastructure/                   # Layer 3 & 4: Adapters & Frameworks
│   ├── web/                         # Web framework (Express, Fastify, etc.)
│   │   ├── controllers/
│   │   │   ├── UserController.ts
│   │   │   ├── OrderController.ts
│   │   │   └── ProductController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── userRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   └── productRoutes.ts
│   │   └── presenters/
│   │       ├── JsonUserPresenter.ts
│   │       └── JsonOrderPresenter.ts
│   │
│   ├── persistence/                 # Database implementations
│   │   ├── repositories/
│   │   │   ├── PostgresUserRepository.ts
│   │   │   ├── PostgresOrderRepository.ts
│   │   │   └── PostgresProductRepository.ts
│   │   ├── models/                  # ORM models (Prisma, TypeORM)
│   │   │   ├── UserModel.ts
│   │   │   ├── OrderModel.ts
│   │   │   └── ProductModel.ts
│   │   └── mappers/
│   │       ├── UserMapper.ts
│   │       ├── OrderMapper.ts
│   │       └── ProductMapper.ts
│   │
│   ├── external-services/           # Third-party service adapters
│   │   ├── SendGridEmailService.ts
│   │   ├── StripePaymentService.ts
│   │   └── Auth0AuthService.ts
│   │
│   └── config/
│       ├── database.ts
│       ├── dependencies.ts          # Dependency injection container
│       └── environment.ts
│
└── main.ts                          # Application entry point
```

### Python/FastAPI Structure

```
app/
├── domain/                           # Layer 1: Entities
│   ├── entities/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── order.py
│   │   └── product.py
│   ├── value_objects/
│   │   ├── __init__.py
│   │   ├── email.py
│   │   ├── money.py
│   │   └── address.py
│   ├── exceptions/
│   │   ├── __init__.py
│   │   ├── domain_exception.py
│   │   └── validation_exception.py
│   └── services/
│       ├── __init__.py
│       └── pricing_service.py
│
├── application/                      # Layer 2: Use Cases
│   ├── use_cases/
│   │   ├── __init__.py
│   │   ├── user/
│   │   │   ├── __init__.py
│   │   │   ├── register_user.py
│   │   │   ├── login_user.py
│   │   │   └── update_profile.py
│   │   ├── order/
│   │   │   ├── __init__.py
│   │   │   ├── create_order.py
│   │   │   ├── cancel_order.py
│   │   │   └── get_order_history.py
│   │   └── product/
│   │       ├── __init__.py
│   │       ├── add_product.py
│   │       └── update_inventory.py
│   ├── interfaces/
│   │   ├── __init__.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   ├── user_repository.py
│   │   │   ├── order_repository.py
│   │   │   └── product_repository.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── email_service.py
│   │   │   ├── payment_service.py
│   │   │   └── auth_service.py
│   │   └── presenters/
│   │       ├── __init__.py
│   │       ├── user_presenter.py
│   │       └── order_presenter.py
│   ├── dto/
│   │   ├── __init__.py
│   │   ├── user_dto.py
│   │   ├── order_dto.py
│   │   └── product_dto.py
│   └── exceptions/
│       ├── __init__.py
│       ├── use_case_exception.py
│       └── not_found_exception.py
│
├── infrastructure/                   # Layer 3 & 4
│   ├── web/
│   │   ├── __init__.py
│   │   ├── controllers/
│   │   │   ├── __init__.py
│   │   │   ├── user_controller.py
│   │   │   ├── order_controller.py
│   │   │   └── product_controller.py
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── auth_middleware.py
│   │   │   └── error_handler.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── user_routes.py
│   │   │   ├── order_routes.py
│   │   │   └── product_routes.py
│   │   └── presenters/
│   │       ├── __init__.py
│   │       ├── json_user_presenter.py
│   │       └── json_order_presenter.py
│   │
│   ├── persistence/
│   │   ├── __init__.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   ├── sqlalchemy_user_repository.py
│   │   │   ├── sqlalchemy_order_repository.py
│   │   │   └── sqlalchemy_product_repository.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user_model.py
│   │   │   ├── order_model.py
│   │   │   └── product_model.py
│   │   └── mappers/
│   │       ├── __init__.py
│   │       ├── user_mapper.py
│   │       ├── order_mapper.py
│   │       └── product_mapper.py
│   │
│   ├── external_services/
│   │   ├── __init__.py
│   │   ├── sendgrid_email_service.py
│   │   ├── stripe_payment_service.py
│   │   └── auth0_auth_service.py
│   │
│   └── config/
│       ├── __init__.py
│       ├── database.py
│       ├── dependencies.py
│       └── settings.py
│
└── main.py
```

## Complete Example: User Registration Flow

### Layer 1: Entity (Domain)

```typescript
// domain/entities/User.ts
import { Email } from '../value-objects/Email';
import { ValidationException } from '../exceptions/ValidationException';

export interface UserProps {
  id: string;
  email: Email;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    // Business rule: Validate user data
    if (!props.firstName || props.firstName.trim().length === 0) {
      throw new ValidationException('First name is required');
    }

    if (!props.lastName || props.lastName.trim().length === 0) {
      throw new ValidationException('Last name is required');
    }

    // Business rule: New users are active by default
    return new User({
      ...props,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // Business rule: User can only be deactivated if they have no pending orders
  deactivate(): void {
    if (!this.props.isActive) {
      throw new ValidationException('User is already inactive');
    }
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    if (this.props.isActive) {
      throw new ValidationException('User is already active');
    }
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  updateProfile(firstName: string, lastName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new ValidationException('First name is required');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new ValidationException('Last name is required');
    }

    this.props.firstName = firstName.trim();
    this.props.lastName = lastName.trim();
    this.props.updatedAt = new Date();
  }

  // Getters
  get id(): string { return this.props.id; }
  get email(): Email { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get fullName(): string { return `${this.props.firstName} ${this.props.lastName}`; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toObject(): UserProps {
    return { ...this.props };
  }
}
```

```typescript
// domain/value-objects/Email.ts
import { ValidationException } from '../exceptions/ValidationException';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new ValidationException('Invalid email address');
    }
    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### Layer 2: Use Case (Application)

```typescript
// application/interfaces/repositories/IUserRepository.ts
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

```typescript
// application/interfaces/services/IEmailService.ts
export interface IEmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
```

```typescript
// application/dto/UserDTO.ts
export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
}
```

```typescript
// application/use-cases/user/RegisterUser.ts
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IEmailService } from '../../interfaces/services/IEmailService';
import { CreateUserDTO, UserResponseDTO } from '../../dto/UserDTO';
import { UseCaseException } from '../../exceptions/UseCaseException';
import * as bcrypt from 'bcrypt';

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Validate input
    this.validateInput(dto);

    // Create email value object
    const email = new Email(dto.email);

    // Business rule: Email must be unique
    const emailExists = await this.userRepository.existsByEmail(email);
    if (emailExists) {
      throw new UseCaseException('Email already registered');
    }

    // Hash password (security concern, but use case orchestrates it)
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user entity (entity enforces business rules)
    const user = User.create({
      email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isActive: true,
    });

    // Save to repository
    await this.userRepository.save(user);

    // Send welcome email (infrastructure concern)
    try {
      await this.emailService.sendWelcomeEmail(
        user.email.toString(),
        user.fullName
      );
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send welcome email:', error);
    }

    // Return DTO
    return this.toDTO(user);
  }

  private validateInput(dto: CreateUserDTO): void {
    if (!dto.password || dto.password.length < 8) {
      throw new UseCaseException('Password must be at least 8 characters');
    }

    if (!dto.firstName || !dto.lastName) {
      throw new UseCaseException('First name and last name are required');
    }
  }

  private toDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
```

### Layer 3: Interface Adapters

```typescript
// infrastructure/web/controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../../application/use-cases/user/RegisterUser';
import { CreateUserDTO } from '../../../application/dto/UserDTO';

export class UserController {
  constructor(private registerUser: RegisterUser) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Convert HTTP request to DTO
      const dto: CreateUserDTO = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      // Execute use case
      const result = await this.registerUser.execute(dto);

      // Convert DTO to HTTP response
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
```

```typescript
// infrastructure/persistence/repositories/PostgresUserRepository.ts
import { IUserRepository } from '../../../application/interfaces/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';
import { UserMapper } from '../mappers/UserMapper';
import { PrismaClient } from '@prisma/client';

export class PostgresUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return UserMapper.toDomain(userData);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.toString() },
    });

    if (!userData) {
      return null;
    }

    return UserMapper.toDomain(userData);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toString() },
    });
    return count > 0;
  }

  async update(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
```

```typescript
// infrastructure/persistence/mappers/UserMapper.ts
import { User, UserProps } from '../../../domain/entities/User';
import { Email } from '../../../domain/value-objects/Email';

interface UserPersistence {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserMapper {
  static toDomain(raw: UserPersistence): User {
    const props: UserProps = {
      id: raw.id,
      email: new Email(raw.email),
      passwordHash: raw.password_hash,
      firstName: raw.first_name,
      lastName: raw.last_name,
      isActive: raw.is_active,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    };

    return User.reconstitute(props);
  }

  static toPersistence(user: User): UserPersistence {
    return {
      id: user.id,
      email: user.email.toString(),
      password_hash: user.passwordHash,
      first_name: user.firstName,
      last_name: user.lastName,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
```

### Layer 4: Frameworks & External Services

```typescript
// infrastructure/external-services/SendGridEmailService.ts
import { IEmailService } from '../../application/interfaces/services/IEmailService';
import sgMail from '@sendgrid/mail';

export class SendGridEmailService implements IEmailService {
  constructor(private apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const msg = {
      to: email,
      from: 'noreply@example.com',
      subject: 'Welcome to Our Platform!',
      text: `Hello ${name}, welcome to our platform!`,
      html: `<strong>Hello ${name}</strong>, welcome to our platform!`,
    };

    await sgMail.send(msg);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `https://example.com/reset-password?token=${token}`;
    const msg = {
      to: email,
      from: 'noreply@example.com',
      subject: 'Password Reset Request',
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await sgMail.send(msg);
  }
}
```

```typescript
// infrastructure/config/dependencies.ts
import { PrismaClient } from '@prisma/client';
import { PostgresUserRepository } from '../persistence/repositories/PostgresUserRepository';
import { SendGridEmailService } from '../external-services/SendGridEmailService';
import { RegisterUser } from '../../application/use-cases/user/RegisterUser';
import { UserController } from '../web/controllers/UserController';

// Dependency Injection Container
export class Container {
  private static instance: Container;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repositories
  getUserRepository(): PostgresUserRepository {
    return new PostgresUserRepository(this.prisma);
  }

  // Services
  getEmailService(): SendGridEmailService {
    return new SendGridEmailService(process.env.SENDGRID_API_KEY!);
  }

  // Use Cases
  getRegisterUserUseCase(): RegisterUser {
    return new RegisterUser(
      this.getUserRepository(),
      this.getEmailService()
    );
  }

  // Controllers
  getUserController(): UserController {
    return new UserController(this.getRegisterUserUseCase());
  }
}
```

```typescript
// main.ts
import express from 'express';
import { Container } from './infrastructure/config/dependencies';
import { errorHandler } from './infrastructure/web/middleware/errorHandler';

const app = express();
const container = Container.getInstance();

app.use(express.json());

// Routes
const userController = container.getUserController();
app.post('/api/users/register', (req, res, next) =>
  userController.register(req, res, next)
);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Repository Pattern & Abstractions

### Repository Interface (Application Layer)

```typescript
// application/interfaces/repositories/IOrderRepository.ts
import { Order } from '../../../domain/entities/Order';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  update(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
}
```

### Multiple Implementations (Infrastructure Layer)

```typescript
// infrastructure/persistence/repositories/PostgresOrderRepository.ts
export class PostgresOrderRepository implements IOrderRepository {
  // PostgreSQL implementation
}

// infrastructure/persistence/repositories/MongoOrderRepository.ts
export class MongoOrderRepository implements IOrderRepository {
  // MongoDB implementation
}

// infrastructure/persistence/repositories/InMemoryOrderRepository.ts
export class InMemoryOrderRepository implements IOrderRepository {
  // In-memory implementation (for testing)
}
```

## Testing Strategy

### Unit Testing Use Cases

```typescript
// application/use-cases/user/RegisterUser.spec.ts
import { RegisterUser } from './RegisterUser';
import { IUserRepository } from '../../interfaces/repositories/IUserRepository';
import { IEmailService } from '../../interfaces/services/IEmailService';
import { CreateUserDTO } from '../../dto/UserDTO';

describe('RegisterUser', () => {
  let registerUser: RegisterUser;
  let userRepository: jest.Mocked<IUserRepository>;
  let emailService: jest.Mocked<IEmailService>;

  beforeEach(() => {
    // Create mocks
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    emailService = {
      sendWelcomeEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    registerUser = new RegisterUser(userRepository, emailService);
  });

  it('should register a new user successfully', async () => {
    // Arrange
    const dto: CreateUserDTO = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    userRepository.existsByEmail.mockResolvedValue(false);

    // Act
    const result = await registerUser.execute(dto);

    // Assert
    expect(result.email).toBe('test@example.com');
    expect(result.firstName).toBe('John');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'test@example.com',
      'John Doe'
    );
  });

  it('should throw error if email already exists', async () => {
    // Arrange
    const dto: CreateUserDTO = {
      email: 'existing@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    userRepository.existsByEmail.mockResolvedValue(true);

    // Act & Assert
    await expect(registerUser.execute(dto)).rejects.toThrow(
      'Email already registered'
    );
  });

  it('should validate password length', async () => {
    // Arrange
    const dto: CreateUserDTO = {
      email: 'test@example.com',
      password: 'short',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Act & Assert
    await expect(registerUser.execute(dto)).rejects.toThrow(
      'Password must be at least 8 characters'
    );
  });
});
```

## Best Practices

### 1. Dependency Inversion

Always depend on abstractions (interfaces), not concrete implementations.

```typescript
// Good: Use Case depends on interface
class CreateOrder {
  constructor(private orderRepository: IOrderRepository) {}
}

// Bad: Use Case depends on concrete implementation
class CreateOrder {
  constructor(private orderRepository: PostgresOrderRepository) {}
}
```

### 2. Keep Entities Pure

Entities should only contain business logic, no infrastructure concerns.

```typescript
// Good: Pure entity logic
class Order {
  addItem(product: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationException('Quantity must be positive');
    }
    // Business logic here
  }
}

// Bad: Entity coupled to database
class Order {
  async save(): Promise<void> {
    await database.orders.insert(this);
  }
}
```

### 3. Use Value Objects

Encapsulate primitive types with business meaning.

```typescript
// Good: Value object with validation
class Email {
  constructor(private value: string) {
    if (!this.isValid(value)) {
      throw new ValidationException('Invalid email');
    }
  }
}

// Bad: Primitive obsession
function createUser(email: string) {
  // No validation, repeated across codebase
}
```

## Common Pitfalls

### Pitfall 1: Leaking Domain Logic to Controllers

```typescript
// Bad: Business logic in controller
class UserController {
  async register(req, res) {
    if (req.body.password.length < 8) {
      return res.status(400).json({ error: 'Password too short' });
    }
    // More business logic...
  }
}

// Good: Business logic in use case/entity
class RegisterUser {
  execute(dto: CreateUserDTO) {
    this.validatePassword(dto.password);
    // Use case orchestration
  }
}
```

### Pitfall 2: Direct Database Access from Use Cases

```typescript
// Bad: Use case directly accessing database
class GetUserProfile {
  async execute(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  }
}

// Good: Use case using repository abstraction
class GetUserProfile {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}
```

### Pitfall 3: Anemic Domain Model

```typescript
// Bad: Anemic model (just getters/setters)
class Order {
  constructor(public items: OrderItem[], public total: number) {}
}

// Service contains business logic
class OrderService {
  calculateTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// Good: Rich domain model
class Order {
  private items: OrderItem[];

  addItem(item: OrderItem): void {
    // Business rule: validate item
    this.items.push(item);
    this.recalculateTotal();
  }

  private recalculateTotal(): void {
    // Business logic in entity
  }

  getTotal(): Money {
    return this.total;
  }
}
```

## Trade-offs

### Advantages
- High testability (easy to mock dependencies)
- Independent of frameworks and databases
- Clear separation of concerns
- Easy to understand and maintain
- Facilitates team collaboration
- Supports long-term evolution

### Disadvantages
- Initial setup complexity
- More files and abstractions
- Overkill for simple CRUD apps
- Learning curve for team
- May slow down initial development
- Requires discipline to maintain boundaries

## When to Choose Clean Architecture vs Simpler Approaches

### Choose Clean Architecture When:
- Building enterprise applications with complex business logic
- Long-term maintainability is critical
- Multiple teams working on different layers
- High test coverage is required
- Business rules are complex and likely to change
- Need to support multiple interfaces (REST, GraphQL, CLI, etc.)

### Choose Simpler Approaches When:
- Building MVPs or prototypes
- Simple CRUD applications
- Small team or solo developer
- Time to market is critical
- Business logic is minimal
- Requirements are stable and well-understood

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [The Clean Architecture (Book)](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Domain-Driven Design by Eric Evans](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)
- [Hexagonal Architecture (Ports and Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture Example (TypeScript)](https://github.com/eduardomoroni/clean-architecture-typescript)
