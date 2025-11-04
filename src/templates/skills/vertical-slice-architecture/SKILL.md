---
name: Vertical Slice Architecture
description: Comprehensive guide to implementing Vertical Slice Architecture with feature-based organization, CQRS patterns, and minimal coupling for maintainable applications.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - architecture
  - vertical-slice
  - cqrs
  - feature-driven
  - backend
  - mediatr
mcp-servers:
  - sequential-thinking
  - context7
---

# Vertical Slice Architecture Skill

This skill provides production-ready patterns for implementing Vertical Slice Architecture, organizing code by feature rather than technical layers, minimizing coupling between features, and emphasizing high cohesion within features.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Identify features/use cases, organize code by vertical slice, implement CQRS handlers, minimize cross-slice dependencies, test each slice independently.

**Additional tools available**:
- Use Sequential Thinking MCP for complex architectural decisions
- Use Context7 MCP to research Vertical Slice Architecture patterns

## When to Use

- Building applications where features are independent and evolve separately
- Teams organized around features/products rather than technical layers
- Applications with distinct, loosely-coupled features
- Projects requiring rapid feature development and iteration
- Systems where features have different technical requirements
- CQRS-style applications with command/query separation
- Microservices or modular monoliths

## When NOT to Use

- Applications with heavily shared business logic across features
- Simple CRUD apps with uniform patterns across all entities
- Projects with strict layered architecture requirements
- Teams unfamiliar with CQRS or feature-based organization
- Systems where cross-cutting concerns dominate feature logic
- Legacy codebases with deep coupling between layers

## Core Concepts

### Vertical vs Horizontal Slicing

```
Traditional Horizontal (Layered):
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  Controllers for all features           │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│  Services for all features              │
├─────────────────────────────────────────┤
│          Data Access Layer              │
│  Repositories for all features          │
└─────────────────────────────────────────┘

Vertical Slice Architecture:
┌──────────┬──────────┬──────────┬──────────┐
│ Feature  │ Feature  │ Feature  │ Feature  │
│    1     │    2     │    3     │    4     │
│          │          │          │          │
│ Request  │ Request  │ Request  │ Request  │
│ Handler  │ Handler  │ Handler  │ Handler  │
│ Response │ Response │ Response │ Response │
│ Validator│ Validator│ Validator│ Validator│
│ DB Query │ DB Query │ DB Query │ DB Query │
└──────────┴──────────┴──────────┴──────────┘
```

### Key Principles

1. **Feature-First Organization**: Code organized by business features, not technical concerns
2. **Vertical Independence**: Each slice contains all layers needed for that feature
3. **Minimize Coupling**: Features should be as independent as possible
4. **Maximize Cohesion**: Everything related to a feature lives together
5. **CQRS Pattern**: Separate commands (writes) from queries (reads)
6. **Thin Controllers**: Controllers delegate to feature handlers immediately
7. **No Service Layer**: Business logic lives in feature handlers, not shared services

## Benefits Over Traditional N-Tier

### Traditional Layered Problems:
- Changes require touching multiple layers
- Shared services become bloated over time
- Tight coupling between unrelated features
- Difficult to find all code for a feature
- Generic abstractions that don't fit all cases

### Vertical Slice Solutions:
- Feature changes isolated to single directory
- Each feature optimized for its specific needs
- Features can be developed/deployed independently
- All feature code co-located
- Feature-specific implementations

## Project Structure Examples

### Node.js/TypeScript with MediatR Pattern

```
src/
├── features/                         # All features organized by business capability
│   ├── users/
│   │   ├── commands/                 # Write operations
│   │   │   ├── RegisterUser/
│   │   │   │   ├── RegisterUserCommand.ts       # Command DTO
│   │   │   │   ├── RegisterUserHandler.ts       # Command handler
│   │   │   │   ├── RegisterUserValidator.ts     # Input validation
│   │   │   │   └── RegisterUser.spec.ts         # Tests
│   │   │   ├── UpdateUserProfile/
│   │   │   │   ├── UpdateUserProfileCommand.ts
│   │   │   │   ├── UpdateUserProfileHandler.ts
│   │   │   │   └── UpdateUserProfileValidator.ts
│   │   │   └── DeactivateUser/
│   │   │       ├── DeactivateUserCommand.ts
│   │   │       └── DeactivateUserHandler.ts
│   │   │
│   │   ├── queries/                  # Read operations
│   │   │   ├── GetUserById/
│   │   │   │   ├── GetUserByIdQuery.ts          # Query DTO
│   │   │   │   ├── GetUserByIdHandler.ts        # Query handler
│   │   │   │   └── GetUserById.spec.ts
│   │   │   ├── ListUsers/
│   │   │   │   ├── ListUsersQuery.ts
│   │   │   │   ├── ListUsersHandler.ts
│   │   │   │   └── ListUsersValidator.ts
│   │   │   └── SearchUsers/
│   │   │       ├── SearchUsersQuery.ts
│   │   │       └── SearchUsersHandler.ts
│   │   │
│   │   ├── UserController.ts         # Thin controller - just routes to handlers
│   │   ├── UserRoutes.ts             # Route definitions
│   │   └── models/                   # Feature-specific models (if needed)
│   │       └── UserModel.ts
│   │
│   ├── orders/
│   │   ├── commands/
│   │   │   ├── CreateOrder/
│   │   │   │   ├── CreateOrderCommand.ts
│   │   │   │   ├── CreateOrderHandler.ts
│   │   │   │   ├── CreateOrderValidator.ts
│   │   │   │   └── CreateOrder.spec.ts
│   │   │   ├── CancelOrder/
│   │   │   │   ├── CancelOrderCommand.ts
│   │   │   │   ├── CancelOrderHandler.ts
│   │   │   │   └── CancelOrderValidator.ts
│   │   │   └── ProcessPayment/
│   │   │       ├── ProcessPaymentCommand.ts
│   │   │       └── ProcessPaymentHandler.ts
│   │   │
│   │   ├── queries/
│   │   │   ├── GetOrderById/
│   │   │   │   ├── GetOrderByIdQuery.ts
│   │   │   │   └── GetOrderByIdHandler.ts
│   │   │   └── GetOrderHistory/
│   │   │       ├── GetOrderHistoryQuery.ts
│   │   │       └── GetOrderHistoryHandler.ts
│   │   │
│   │   ├── OrderController.ts
│   │   └── OrderRoutes.ts
│   │
│   └── products/
│       ├── commands/
│       │   ├── AddProduct/
│       │   └── UpdateInventory/
│       ├── queries/
│       │   ├── GetProductById/
│       │   └── ListProducts/
│       ├── ProductController.ts
│       └── ProductRoutes.ts
│
├── shared/                           # Shared infrastructure (minimal)
│   ├── database/
│   │   ├── connection.ts
│   │   └── migrations/
│   ├── middleware/
│   │   ├── authentication.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── crypto.ts
│   └── types/
│       ├── ICommand.ts
│       ├── IQuery.ts
│       ├── IHandler.ts
│       └── Result.ts
│
├── mediator/                         # MediatR-like pattern
│   ├── Mediator.ts
│   ├── IRequest.ts
│   └── IRequestHandler.ts
│
└── main.ts
```

### Python/FastAPI Structure

```
app/
├── features/
│   ├── users/
│   │   ├── commands/
│   │   │   ├── register_user/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── command.py
│   │   │   │   ├── handler.py
│   │   │   │   ├── validator.py
│   │   │   │   └── test_register_user.py
│   │   │   ├── update_profile/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── command.py
│   │   │   │   └── handler.py
│   │   │   └── deactivate_user/
│   │   │       ├── __init__.py
│   │   │       ├── command.py
│   │   │       └── handler.py
│   │   │
│   │   ├── queries/
│   │   │   ├── get_user_by_id/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── query.py
│   │   │   │   ├── handler.py
│   │   │   │   └── test_get_user.py
│   │   │   ├── list_users/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── query.py
│   │   │   │   └── handler.py
│   │   │   └── search_users/
│   │   │       ├── __init__.py
│   │   │       ├── query.py
│   │   │       └── handler.py
│   │   │
│   │   ├── __init__.py
│   │   ├── controller.py
│   │   └── router.py
│   │
│   ├── orders/
│   │   ├── commands/
│   │   │   ├── create_order/
│   │   │   ├── cancel_order/
│   │   │   └── process_payment/
│   │   ├── queries/
│   │   │   ├── get_order_by_id/
│   │   │   └── get_order_history/
│   │   ├── __init__.py
│   │   ├── controller.py
│   │   └── router.py
│   │
│   └── products/
│       ├── commands/
│       ├── queries/
│       ├── __init__.py
│       ├── controller.py
│       └── router.py
│
├── shared/
│   ├── database/
│   │   ├── __init__.py
│   │   └── session.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── error_handler.py
│   ├── utils/
│   │   ├── __init__.py
│   │   └── logger.py
│   └── types/
│       ├── __init__.py
│       ├── command.py
│       ├── query.py
│       └── result.py
│
├── mediator/
│   ├── __init__.py
│   └── mediator.py
│
└── main.py
```

## Complete Example: E-commerce Order Feature

### CQRS Command Pattern (TypeScript)

```typescript
// features/orders/commands/CreateOrder/CreateOrderCommand.ts
import { ICommand } from '../../../../shared/types/ICommand';

export interface CreateOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderCommand extends ICommand {
  userId: string;
  items: CreateOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}
```

```typescript
// features/orders/commands/CreateOrder/CreateOrderValidator.ts
import { CreateOrderCommand } from './CreateOrderCommand';
import { ValidationException } from '../../../../shared/exceptions/ValidationException';

export class CreateOrderValidator {
  validate(command: CreateOrderCommand): void {
    if (!command.userId) {
      throw new ValidationException('User ID is required');
    }

    if (!command.items || command.items.length === 0) {
      throw new ValidationException('Order must contain at least one item');
    }

    for (const item of command.items) {
      if (item.quantity <= 0) {
        throw new ValidationException('Item quantity must be positive');
      }
      if (item.price < 0) {
        throw new ValidationException('Item price cannot be negative');
      }
    }

    if (!command.shippingAddress) {
      throw new ValidationException('Shipping address is required');
    }

    if (!command.paymentMethod) {
      throw new ValidationException('Payment method is required');
    }
  }
}
```

```typescript
// features/orders/commands/CreateOrder/CreateOrderHandler.ts
import { ICommandHandler } from '../../../../shared/types/IHandler';
import { CreateOrderCommand } from './CreateOrderCommand';
import { CreateOrderValidator } from './CreateOrderValidator';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../../shared/types/Result';

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, CreateOrderResult> {
  private validator: CreateOrderValidator;

  constructor(private db: PrismaClient) {
    this.validator = new CreateOrderValidator();
  }

  async handle(command: CreateOrderCommand): Promise<Result<CreateOrderResult>> {
    try {
      // 1. Validate command
      this.validator.validate(command);

      // 2. Calculate total
      const totalAmount = command.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      // 3. Check product availability
      const productIds = command.items.map(item => item.productId);
      const products = await this.db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, stockQuantity: true },
      });

      for (const item of command.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
          return Result.fail(`Product ${item.productId} not found`);
        }
        if (product.stockQuantity < item.quantity) {
          return Result.fail(`Insufficient stock for product ${item.productId}`);
        }
      }

      // 4. Create order in transaction
      const order = await this.db.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId: command.userId,
            orderNumber: this.generateOrderNumber(),
            totalAmount,
            status: 'pending',
            shippingAddress: command.shippingAddress,
            paymentMethod: command.paymentMethod,
          },
        });

        // Create order items
        await tx.orderItem.createMany({
          data: command.items.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        // Update product inventory
        for (const item of command.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        return newOrder;
      });

      // 5. Emit domain event (optional)
      // await this.eventBus.publish(new OrderCreatedEvent(order.id));

      // 6. Return result
      return Result.ok({
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      });

    } catch (error) {
      return Result.fail(`Failed to create order: ${error.message}`);
    }
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}
```

### CQRS Query Pattern (TypeScript)

```typescript
// features/orders/queries/GetOrderById/GetOrderByIdQuery.ts
import { IQuery } from '../../../../shared/types/IQuery';

export interface GetOrderByIdQuery extends IQuery {
  orderId: string;
  userId: string; // For authorization
}
```

```typescript
// features/orders/queries/GetOrderById/GetOrderByIdHandler.ts
import { IQueryHandler } from '../../../../shared/types/IHandler';
import { GetOrderByIdQuery } from './GetOrderByIdQuery';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../../shared/types/Result';
import { NotFoundException } from '../../../../shared/exceptions/NotFoundException';
import { ForbiddenException } from '../../../../shared/exceptions/ForbiddenException';

export interface OrderDetailDTO {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery, OrderDetailDTO> {
  constructor(private db: PrismaClient) {}

  async handle(query: GetOrderByIdQuery): Promise<Result<OrderDetailDTO>> {
    try {
      // Optimized query - fetch exactly what we need
      const order = await this.db.order.findUnique({
        where: { id: query.orderId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        return Result.fail('Order not found', 404);
      }

      // Authorization check
      if (order.userId !== query.userId) {
        return Result.fail('Unauthorized access to order', 403);
      }

      // Map to DTO
      const orderDTO: OrderDetailDTO = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price,
        })),
        shippingAddress: order.shippingAddress as any,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };

      return Result.ok(orderDTO);

    } catch (error) {
      return Result.fail(`Failed to retrieve order: ${error.message}`);
    }
  }
}
```

### Complex Query with Business Logic

```typescript
// features/orders/queries/GetOrderHistory/GetOrderHistoryQuery.ts
import { IQuery } from '../../../../shared/types/IQuery';

export interface GetOrderHistoryQuery extends IQuery {
  userId: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  pageSize?: number;
}
```

```typescript
// features/orders/queries/GetOrderHistory/GetOrderHistoryHandler.ts
import { IQueryHandler } from '../../../../shared/types/IHandler';
import { GetOrderHistoryQuery } from './GetOrderHistoryQuery';
import { PrismaClient } from '@prisma/client';
import { Result } from '../../../../shared/types/Result';

export interface OrderSummaryDTO {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
}

export interface OrderHistoryResult {
  orders: OrderSummaryDTO[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  };
}

export class GetOrderHistoryHandler implements IQueryHandler<GetOrderHistoryQuery, OrderHistoryResult> {
  constructor(private db: PrismaClient) {}

  async handle(query: GetOrderHistoryQuery): Promise<Result<OrderHistoryResult>> {
    try {
      const page = query.page || 1;
      const pageSize = Math.min(query.pageSize || 20, 100);
      const skip = (page - 1) * pageSize;

      // Build where clause
      const where: any = {
        userId: query.userId,
      };

      if (query.status) {
        where.status = query.status;
      }

      if (query.dateFrom || query.dateTo) {
        where.createdAt = {};
        if (query.dateFrom) {
          where.createdAt.gte = query.dateFrom;
        }
        if (query.dateTo) {
          where.createdAt.lte = query.dateTo;
        }
      }

      // Execute queries in parallel
      const [orders, totalCount, summary] = await Promise.all([
        // Get paginated orders
        this.db.order.findMany({
          where,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
            _count: {
              select: { items: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),

        // Get total count
        this.db.order.count({ where }),

        // Get summary statistics
        this.db.order.aggregate({
          where,
          _sum: { totalAmount: true },
          _avg: { totalAmount: true },
          _count: true,
        }),
      ]);

      // Map to DTOs
      const orderDTOs: OrderSummaryDTO[] = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        itemCount: order._count.items,
        createdAt: order.createdAt,
      }));

      const totalPages = Math.ceil(totalCount / pageSize);

      const result: OrderHistoryResult = {
        orders: orderDTOs,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        summary: {
          totalOrders: summary._count,
          totalSpent: summary._sum.totalAmount || 0,
          averageOrderValue: summary._avg.totalAmount || 0,
        },
      };

      return Result.ok(result);

    } catch (error) {
      return Result.fail(`Failed to retrieve order history: ${error.message}`);
    }
  }
}
```

### Controller (Thin Layer)

```typescript
// features/orders/OrderController.ts
import { Request, Response, NextFunction } from 'express';
import { Mediator } from '../../mediator/Mediator';
import { CreateOrderCommand } from './commands/CreateOrder/CreateOrderCommand';
import { GetOrderByIdQuery } from './queries/GetOrderById/GetOrderByIdQuery';
import { GetOrderHistoryQuery } from './queries/GetOrderHistory/GetOrderHistoryQuery';

export class OrderController {
  constructor(private mediator: Mediator) {}

  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: CreateOrderCommand = {
        userId: req.user.id,
        items: req.body.items,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
      };

      const result = await this.mediator.send(command);

      if (result.isSuccess) {
        res.status(201).json({
          success: true,
          data: result.value,
        });
      } else {
        res.status(result.statusCode || 400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: GetOrderByIdQuery = {
        orderId: req.params.id,
        userId: req.user.id,
      };

      const result = await this.mediator.send(query);

      if (result.isSuccess) {
        res.json({
          success: true,
          data: result.value,
        });
      } else {
        res.status(result.statusCode || 404).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getOrderHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: GetOrderHistoryQuery = {
        userId: req.user.id,
        status: req.query.status as any,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined,
      };

      const result = await this.mediator.send(query);

      if (result.isSuccess) {
        res.json({
          success: true,
          data: result.value,
        });
      } else {
        res.status(result.statusCode || 400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
```

## MediatR Pattern Implementation

### Shared Types

```typescript
// shared/types/ICommand.ts
export interface ICommand {
  // Marker interface for commands (write operations)
}

// shared/types/IQuery.ts
export interface IQuery {
  // Marker interface for queries (read operations)
}

// shared/types/IHandler.ts
import { Result } from './Result';

export interface IRequestHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<Result<TResponse>>;
}

export interface ICommandHandler<TCommand extends ICommand, TResponse>
  extends IRequestHandler<TCommand, TResponse> {}

export interface IQueryHandler<TQuery extends IQuery, TResponse>
  extends IRequestHandler<TQuery, TResponse> {}
```

```typescript
// shared/types/Result.ts
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string | null;
  public value?: T;
  public statusCode?: number;

  private constructor(
    isSuccess: boolean,
    error: string | null,
    value?: T,
    statusCode?: number
  ) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this.value = value;
    this.statusCode = statusCode;
  }

  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  static fail<U>(error: string, statusCode?: number): Result<U> {
    return new Result<U>(false, error, undefined, statusCode);
  }

  static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok(null);
  }
}
```

### Mediator Implementation

```typescript
// mediator/Mediator.ts
import { IRequestHandler } from '../shared/types/IHandler';
import { Result } from '../shared/types/Result';

type Constructor<T = any> = new (...args: any[]) => T;

export class Mediator {
  private handlers = new Map<string, IRequestHandler<any, any>>();

  register<TRequest, TResponse>(
    requestType: Constructor<TRequest>,
    handler: IRequestHandler<TRequest, TResponse>
  ): void {
    const key = requestType.name;
    this.handlers.set(key, handler);
  }

  async send<TRequest, TResponse>(
    request: TRequest
  ): Promise<Result<TResponse>> {
    const requestType = request.constructor.name;
    const handler = this.handlers.get(requestType);

    if (!handler) {
      throw new Error(`No handler registered for ${requestType}`);
    }

    return handler.handle(request);
  }
}
```

### Dependency Injection Setup

```typescript
// infrastructure/DependencyContainer.ts
import { PrismaClient } from '@prisma/client';
import { Mediator } from '../mediator/Mediator';
import { CreateOrderHandler } from '../features/orders/commands/CreateOrder/CreateOrderHandler';
import { CreateOrderCommand } from '../features/orders/commands/CreateOrder/CreateOrderCommand';
import { GetOrderByIdHandler } from '../features/orders/queries/GetOrderById/GetOrderByIdHandler';
import { GetOrderByIdQuery } from '../features/orders/queries/GetOrderById/GetOrderByIdQuery';

export class DependencyContainer {
  private static instance: DependencyContainer;
  private mediator: Mediator;
  private db: PrismaClient;

  private constructor() {
    this.db = new PrismaClient();
    this.mediator = new Mediator();
    this.registerHandlers();
  }

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  private registerHandlers(): void {
    // Register Order handlers
    this.mediator.register(
      CreateOrderCommand,
      new CreateOrderHandler(this.db)
    );

    this.mediator.register(
      GetOrderByIdQuery,
      new GetOrderByIdHandler(this.db)
    );

    // Register other handlers...
  }

  getMediator(): Mediator {
    return this.mediator;
  }

  getDatabase(): PrismaClient {
    return this.db;
  }
}
```

## Python Implementation with Similar Pattern

```python
# features/orders/commands/create_order/command.py
from dataclasses import dataclass
from typing import List
from shared.types.command import ICommand

@dataclass
class CreateOrderItem:
    product_id: str
    quantity: int
    price: float

@dataclass
class ShippingAddress:
    street: str
    city: str
    zip_code: str
    country: str

@dataclass
class CreateOrderCommand(ICommand):
    user_id: str
    items: List[CreateOrderItem]
    shipping_address: ShippingAddress
    payment_method: str
```

```python
# features/orders/commands/create_order/handler.py
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from shared.types.handler import ICommandHandler
from shared.types.result import Result
from .command import CreateOrderCommand
from .validator import CreateOrderValidator
import uuid
from datetime import datetime

class CreateOrderResult:
    def __init__(self, order_id: str, order_number: str, total_amount: float,
                 status: str, created_at: datetime):
        self.order_id = order_id
        self.order_number = order_number
        self.total_amount = total_amount
        self.status = status
        self.created_at = created_at

class CreateOrderHandler(ICommandHandler[CreateOrderCommand, CreateOrderResult]):
    def __init__(self, db: AsyncSession):
        self.db = db
        self.validator = CreateOrderValidator()

    async def handle(self, command: CreateOrderCommand) -> Result[CreateOrderResult]:
        try:
            # 1. Validate
            validation_result = self.validator.validate(command)
            if validation_result.is_failure:
                return validation_result

            # 2. Calculate total
            total_amount = sum(item.price * item.quantity for item in command.items)

            # 3. Check product availability
            product_ids = [item.product_id for item in command.items]
            products = await self.db.execute(
                select(Product).where(Product.id.in_(product_ids))
            )
            products = products.scalars().all()

            for item in command.items:
                product = next((p for p in products if p.id == item.product_id), None)
                if not product:
                    return Result.fail(f"Product {item.product_id} not found")
                if product.stock_quantity < item.quantity:
                    return Result.fail(f"Insufficient stock for product {item.product_id}")

            # 4. Create order
            order = Order(
                id=str(uuid.uuid4()),
                user_id=command.user_id,
                order_number=self._generate_order_number(),
                total_amount=total_amount,
                status="pending",
                shipping_address=command.shipping_address.__dict__,
                payment_method=command.payment_method,
                created_at=datetime.utcnow()
            )

            self.db.add(order)

            # Create order items
            for item in command.items:
                order_item = OrderItem(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price
                )
                self.db.add(order_item)

                # Update inventory
                product = next(p for p in products if p.id == item.product_id)
                product.stock_quantity -= item.quantity

            await self.db.commit()

            result = CreateOrderResult(
                order_id=order.id,
                order_number=order.order_number,
                total_amount=order.total_amount,
                status=order.status,
                created_at=order.created_at
            )

            return Result.ok(result)

        except Exception as e:
            await self.db.rollback()
            return Result.fail(f"Failed to create order: {str(e)}")

    def _generate_order_number(self) -> str:
        import time
        import random
        timestamp = int(time.time())
        random_part = random.randint(1000, 9999)
        return f"ORD-{timestamp}-{random_part}"
```

## Testing Vertical Slices

```typescript
// features/orders/commands/CreateOrder/CreateOrder.spec.ts
import { CreateOrderHandler } from './CreateOrderHandler';
import { CreateOrderCommand } from './CreateOrderCommand';
import { PrismaClient } from '@prisma/client';

describe('CreateOrder', () => {
  let handler: CreateOrderHandler;
  let db: PrismaClient;

  beforeEach(() => {
    db = new PrismaClient();
    handler = new CreateOrderHandler(db);
  });

  afterEach(async () => {
    await db.$disconnect();
  });

  it('should create order successfully', async () => {
    // Arrange
    const command: CreateOrderCommand = {
      userId: 'user-123',
      items: [
        { productId: 'prod-1', quantity: 2, price: 29.99 },
        { productId: 'prod-2', quantity: 1, price: 49.99 },
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'credit_card',
    };

    // Act
    const result = await handler.handle(command);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.orderId).toBeDefined();
    expect(result.value?.totalAmount).toBe(109.97);
    expect(result.value?.status).toBe('pending');
  });

  it('should fail when product not found', async () => {
    // Arrange
    const command: CreateOrderCommand = {
      userId: 'user-123',
      items: [{ productId: 'invalid-id', quantity: 1, price: 29.99 }],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'credit_card',
    };

    // Act
    const result = await handler.handle(command);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('not found');
  });

  it('should fail when insufficient stock', async () => {
    // Test implementation
  });
});
```

## Best Practices

### 1. Keep Features Independent

```typescript
// Good: Feature uses its own specific query
async function getOrderSummary(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      // Only what this feature needs
    },
  });
}

// Bad: Reusing generic repository that fetches everything
async function getOrderSummary(orderId: string) {
  const order = await orderRepository.findById(orderId); // Returns full entity
}
```

### 2. Optimize Queries Per Feature

```typescript
// Good: Query optimized for specific use case
async function getOrderHistorySummary() {
  return await db.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      status: true,
      // Minimal data needed
    },
  });
}

// Good: Different feature, different optimization
async function getOrderDetailsForInvoice() {
  return await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      customer: true,
      // Everything needed for invoice
    },
  });
}
```

### 3. Allow Feature-Specific Patterns

```typescript
// Feature A: Uses raw SQL for performance
class GetDashboardMetricsHandler {
  async handle() {
    return await this.db.$queryRaw`
      SELECT COUNT(*) as total_orders, SUM(total_amount) as revenue
      FROM orders WHERE created_at >= NOW() - INTERVAL '30 days'
    `;
  }
}

// Feature B: Uses ORM for simplicity
class GetUserOrdersHandler {
  async handle(query: GetUserOrdersQuery) {
    return await this.db.order.findMany({
      where: { userId: query.userId },
    });
  }
}
```

### 4. Shared Code Guidelines

Only share when:
- Truly cross-cutting (authentication, logging)
- Stable and unlikely to change
- Used by majority of features

Don't share:
- Business logic
- Feature-specific validations
- Data access patterns

## Common Pitfalls

### Pitfall 1: Over-Sharing Between Features

```typescript
// Bad: Shared service with business logic
class OrderService {
  calculateTotal(items: OrderItem[]) { /* ... */ }
  validateOrder(order: Order) { /* ... */ }
  // Used by multiple features, creates coupling
}

// Good: Logic in each feature handler
class CreateOrderHandler {
  private calculateTotal(items: OrderItem[]) { /* ... */ }
}

class UpdateOrderHandler {
  private calculateTotal(items: OrderItem[]) { /* ... */ }
  // Duplication is OK if it prevents coupling
}
```

### Pitfall 2: Leaking Across Feature Boundaries

```typescript
// Bad: Feature directly accessing another feature
import { GetUserByIdHandler } from '../../users/queries/GetUserById/GetUserByIdHandler';

class CreateOrderHandler {
  constructor(private getUserHandler: GetUserByIdHandler) {}
  // Creates coupling between features
}

// Good: Use shared interface or duplicate code
class CreateOrderHandler {
  async handle(command: CreateOrderCommand) {
    // Query user data directly if needed
    const user = await this.db.user.findUnique({
      where: { id: command.userId },
      select: { id: true, email: true }, // Only what we need
    });
  }
}
```

### Pitfall 3: Creating Generic Abstractions Too Early

```typescript
// Bad: Premature abstraction
interface IRepository<T> {
  findById(id: string): Promise<T>;
  save(entity: T): Promise<void>;
  // Forces all features into same pattern
}

// Good: Feature-specific data access
class GetOrderByIdHandler {
  async handle(query: GetOrderByIdQuery) {
    // Direct, optimized query for this exact use case
    return await this.db.order.findUnique({
      where: { id: query.orderId },
      include: { /* exactly what we need */ },
    });
  }
}
```

## When to Choose Vertical Slice vs Clean Architecture

### Choose Vertical Slice When:
- Features are independent and change at different rates
- Team is organized by features/products
- CQRS patterns fit your domain
- Speed of feature development is critical
- Features have different technical requirements
- Minimal shared business logic

### Choose Clean Architecture When:
- Heavy shared domain logic across features
- Strict separation of concerns required
- Team organized by technical layers
- Framework independence is critical
- Complex domain with many business rules
- Long-term maintainability over initial speed

### Hybrid Approach:
Many projects combine both:
- Use Vertical Slices for feature organization
- Apply Clean Architecture principles within slices
- Keep domain entities in shared folder
- Feature handlers orchestrate domain logic

## References

- [Vertical Slice Architecture by Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/)
- [CQRS Pattern by Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [MediatR Library (.NET)](https://github.com/jbogard/MediatR)
- [Feature Slices for ASP.NET Core](https://docs.microsoft.com/en-us/archive/msdn-magazine/2016/september/asp-net-core-feature-slices-for-asp-net-core-mvc)
- [Vertical Slice Architecture vs Clean Architecture](https://www.ghyston.com/insights/architecting-for-maintainability-through-vertical-slices/)
