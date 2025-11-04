---
name: Database Migrations
description: Battle-tested patterns for database schema migrations, versioning strategies, rollback procedures, and zero-downtime deployments across Prisma, TypeORM, Alembic, and other migration tools.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
tags:
  - database
  - migrations
  - schema
  - versioning
  - deployment
---

# Database Migrations Skill

Comprehensive guide for managing database schema changes safely and reliably through migrations, with support for multiple frameworks and databases.

## When to Use

- Adding, modifying, or removing database tables/columns
- Changing data types or constraints
- Creating or dropping indexes
- Seeding initial data
- Rolling back problematic changes
- Deploying schema changes to production
- Managing database versions across environments

## Migration Frameworks

### 1. Prisma Migrate (Node.js/TypeScript)

**Best for**: Modern TypeScript projects with PostgreSQL, MySQL, SQLite, SQL Server

```bash
# Create a new migration
npx prisma migrate dev --name add_user_avatar

# Apply migrations to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --applied "20240101000000_migration_name"
npx prisma migrate resolve --rolled-back "20240101000000_migration_name"
```

**Migration File Structure:**
```
prisma/
├── schema.prisma
└── migrations/
    ├── 20240101120000_init/
    │   └── migration.sql
    ├── 20240102130000_add_user_avatar/
    │   └── migration.sql
    └── migration_lock.toml
```

**Example Migration:**
```sql
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### 2. TypeORM (Node.js/TypeScript)

**Best for**: Enterprise Node.js apps, supports all major databases

```bash
# Generate migration from entity changes
npm run typeorm migration:generate -- -n AddUserAvatar

# Create empty migration
npm run typeorm migration:create -- -n CustomDataMigration

# Run pending migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert

# Show migration status
npm run typeorm migration:show
```

**Migration Example:**
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class AddUserAvatar1704110400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "avatar_url",
            type: "varchar",
            length: "500",
            isNullable: true,
        }));

        await queryRunner.createIndex("user", new TableIndex({
            name: "IDX_USER_EMAIL",
            columnNames: ["email"],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("user", "IDX_USER_EMAIL");
        await queryRunner.dropColumn("user", "avatar_url");
    }
}
```

### 3. Alembic (Python)

**Best for**: Python applications with SQLAlchemy

```bash
# Initialize Alembic
alembic init alembic

# Generate migration from models
alembic revision --autogenerate -m "add user avatar"

# Create empty migration
alembic revision -m "custom data migration"

# Upgrade to latest
alembic upgrade head

# Upgrade to specific version
alembic upgrade ae1027a6acf

# Downgrade one version
alembic downgrade -1

# Show current version
alembic current

# Show migration history
alembic history
```

**Migration Example:**
```python
"""add user avatar

Revision ID: ae1027a6acf
Revises: 1975ea83b712
Create Date: 2024-01-01 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'ae1027a6acf'
down_revision = '1975ea83b712'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('user',
        sa.Column('avatar_url', sa.String(500), nullable=True)
    )
    op.create_index('ix_user_email', 'user', ['email'], unique=True)

def downgrade():
    op.drop_index('ix_user_email', table_name='user')
    op.drop_column('user', 'avatar_url')
```

### 4. Knex.js (Node.js)

**Migration Example:**
```javascript
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('email', 255).notNullable().unique();
      table.string('name', 255);
      table.string('avatar_url', 500);
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

## Migration Patterns

### 1. Adding a Column

**Safe Pattern (Zero-Downtime):**
```sql
-- Step 1: Add column as nullable
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Step 2: Backfill data (in batches)
UPDATE users SET phone = default_phone WHERE phone IS NULL;

-- Step 3: Add constraint (separate migration)
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

### 2. Removing a Column

**Safe Pattern (Multi-Phase):**
```sql
-- Phase 1: Deploy code that doesn't use the column
-- Phase 2: Remove column in migration
ALTER TABLE users DROP COLUMN deprecated_field;
```

### 3. Renaming a Column

**Zero-Downtime Pattern:**
```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN new_name VARCHAR(255);

-- Step 2: Copy data
UPDATE users SET new_name = old_name;

-- Step 3: Deploy code reading from both columns
-- Step 4: Deploy code writing to both columns

-- Step 5: Deploy code using only new column
-- Step 6: Drop old column
ALTER TABLE users DROP COLUMN old_name;
```

### 4. Changing Column Type

**Safe Pattern:**
```sql
-- PostgreSQL: Using USING clause
ALTER TABLE users
ALTER COLUMN age TYPE INTEGER USING age::INTEGER;

-- MySQL: Direct conversion
ALTER TABLE users MODIFY COLUMN age INT;

-- Safe multi-step for large tables:
-- 1. Add new column with new type
ALTER TABLE users ADD COLUMN age_new INTEGER;

-- 2. Backfill in batches
UPDATE users SET age_new = CAST(age AS INTEGER)
WHERE age_new IS NULL LIMIT 10000;

-- 3. Swap columns (requires downtime or careful coordination)
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users RENAME COLUMN age_new TO age;
```

### 5. Data Migrations

**Example: Splitting Name Field**
```typescript
// TypeORM Migration
export class SplitUserName1704110400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns
        await queryRunner.addColumn("user", new TableColumn({
            name: "first_name",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.addColumn("user", new TableColumn({
            name: "last_name",
            type: "varchar",
            isNullable: true,
        }));

        // Migrate data in batches
        const users = await queryRunner.query(
            `SELECT id, name FROM "user" WHERE first_name IS NULL`
        );

        for (const user of users) {
            const [firstName, ...lastNameParts] = user.name.split(' ');
            const lastName = lastNameParts.join(' ');

            await queryRunner.query(
                `UPDATE "user" SET first_name = $1, last_name = $2 WHERE id = $3`,
                [firstName, lastName, user.id]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "first_name");
        await queryRunner.dropColumn("user", "last_name");
    }
}
```

## Rollback Strategies

### 1. Forward-Only Migrations
**Philosophy**: Never rollback, always roll forward

```sql
-- Instead of reverting a bad migration, create a fix migration
-- migrations/20240102_add_column.sql (bad)
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';

-- migrations/20240103_fix_status.sql (fix)
ALTER TABLE users ALTER COLUMN status DROP NOT NULL;
```

### 2. Reversible Migrations
**Always implement down() migrations:**

```typescript
// Good: Fully reversible
export class AddUserStatus implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "status",
            type: "varchar",
            default: "'active'",
        }));
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user", "status");
    }
}
```

### 3. Testing Rollbacks

```bash
# Test rollback locally before production
npm run typeorm migration:run      # Apply
npm run typeorm migration:revert   # Rollback
npm run typeorm migration:run      # Re-apply

# Verify data integrity after each step
```

## Best Practices

### 1. Migration Naming
```
✅ Good:
- 20240101120000_create_users_table
- 20240102130000_add_user_email_index
- 20240103140000_backfill_user_preferences

❌ Bad:
- migration_1
- update_db
- changes
```

### 2. Keep Migrations Small
```
✅ One migration = One logical change
❌ One migration = Multiple unrelated changes
```

### 3. Test Migrations

```typescript
// Migration test example (Jest)
describe('AddUserAvatar Migration', () => {
    beforeEach(async () => {
        await resetDatabase();
        await runMigrationsUpTo('20240101120000_init');
    });

    it('should add avatar_url column', async () => {
        await runMigration('20240102130000_add_user_avatar');

        const columns = await getTableColumns('user');
        expect(columns).toContain('avatar_url');
    });

    it('should rollback cleanly', async () => {
        await runMigration('20240102130000_add_user_avatar');
        await rollbackMigration('20240102130000_add_user_avatar');

        const columns = await getTableColumns('user');
        expect(columns).not.toContain('avatar_url');
    });
});
```

### 4. Lock Migrations in Production

```sql
-- Use advisory locks to prevent concurrent migrations
-- PostgreSQL
SELECT pg_advisory_lock(123456789);
-- Run migrations
SELECT pg_advisory_unlock(123456789);
```

### 5. Batch Large Updates

```typescript
// Good: Batch processing for large tables
async function backfillInBatches(queryRunner: QueryRunner) {
    let offset = 0;
    const batchSize = 10000;

    while (true) {
        const result = await queryRunner.query(`
            UPDATE users
            SET normalized_email = LOWER(email)
            WHERE normalized_email IS NULL
            LIMIT ${batchSize}
        `);

        if (result.affectedRows === 0) break;

        offset += batchSize;
        console.log(`Processed ${offset} rows`);

        // Pause to avoid overwhelming the database
        await sleep(100);
    }
}
```

## Common Pitfalls

### ❌ Don't: Modify Existing Migrations
```
Bad: Editing a migration that's already in production
Good: Create a new migration to fix issues
```

### ❌ Don't: Skip Version Control
```
Bad: Manually running SQL in production
Good: Always use migration files checked into git
```

### ❌ Don't: Ignore Migration Order
```
Bad: Migrations with inconsistent dependencies
Good: Linear, ordered migration chain
```

### ❌ Don't: Use NOT NULL Without Default
```sql
-- Bad: Will fail on existing rows
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL;

-- Good: Add with default or nullable first
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
```

### ❌ Don't: Drop Columns Immediately
```sql
-- Bad: Code still references the column
ALTER TABLE users DROP COLUMN deprecated_field;

-- Good: Multi-phase approach
-- 1. Deploy code that doesn't use column
-- 2. Wait for deployment
-- 3. Drop column in next migration
```

## Zero-Downtime Deployment

### Strategy 1: Expand-Contract Pattern

```
Phase 1 (Expand): Add new schema elements
  ↓
Phase 2 (Migrate): Dual-write to old and new
  ↓
Phase 3 (Contract): Remove old schema elements
```

**Example:**
```sql
-- Phase 1: Add new table
CREATE TABLE user_preferences_v2 (
    user_id INT PRIMARY KEY,
    settings JSONB NOT NULL
);

-- Phase 2: Application writes to both tables
-- (Deployed in application code)

-- Phase 3: Drop old table
DROP TABLE user_preferences;
ALTER TABLE user_preferences_v2 RENAME TO user_preferences;
```

### Strategy 2: Feature Flags

```typescript
// Use feature flags to control migration rollout
if (featureFlags.useNewSchema) {
    // Read from new column
    return user.new_field;
} else {
    // Read from old column
    return user.old_field;
}
```

## Monitoring and Validation

### Pre-Migration Checklist
- [ ] Migration tested in development environment
- [ ] Migration tested with production-like data volume
- [ ] Rollback tested and verified
- [ ] Database backup created
- [ ] Migration duration estimated
- [ ] Downtime window scheduled (if needed)
- [ ] Team notified of deployment

### Post-Migration Validation
```sql
-- Verify data integrity
SELECT COUNT(*) FROM users WHERE email IS NULL; -- Should be 0

-- Check constraint violations
SELECT * FROM users WHERE created_at > updated_at; -- Should be empty

-- Verify indexes exist
SELECT indexname FROM pg_indexes WHERE tablename = 'users';
```

## References

- [Prisma Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Zero-Downtime Migrations](https://www.braintreepayments.com/blog/safe-operations-for-high-volume-postgresql/)
- [PostgreSQL ALTER TABLE Performance](https://www.postgresql.org/docs/current/sql-altertable.html)
