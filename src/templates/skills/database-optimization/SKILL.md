---
name: Database Optimization
description: Patterns and techniques for optimizing database queries, preventing N+1 problems, proper indexing, and connection pooling for high-performance applications.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
tags:
  - database
  - performance
  - optimization
  - sql
  - queries
---

# Database Optimization Skill

Comprehensive patterns for identifying and fixing database performance issues, with focus on query optimization, indexing, and preventing common anti-patterns.

## When to Use

- Application experiencing slow database queries
- Need to optimize existing database performance
- Building new features that query large datasets
- Preventing N+1 query problems
- Database connection pool tuning needed

## Common Performance Problems

### 1. N+1 Query Problem
**Symptom**: One query to fetch parent records, then N queries to fetch related data

```sql
-- ❌ Bad: N+1 queries
SELECT * FROM users;
-- Then for each user:
SELECT * FROM posts WHERE user_id = ?;

-- ✅ Good: Use JOIN or eager loading
SELECT users.*, posts.*
FROM users
LEFT JOIN posts ON posts.user_id = users.id;
```

### 2. Missing Indexes
**Symptom**: Full table scans on frequently queried columns

```sql
-- Identify missing indexes
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
-- Look for "Seq Scan" or "table scan" in output

-- Add index
CREATE INDEX idx_users_email ON users(email);
```

### 3. Inefficient Queries
**Symptom**: SELECT * on large tables, unnecessary DISTINCT, improper JOINs

```sql
-- ❌ Bad: Fetch all columns
SELECT * FROM users WHERE id = 1;

-- ✅ Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;
```

## Optimization Techniques

### 1. Indexing Strategy

**When to Index:**
- Columns used in WHERE clauses
- Foreign keys
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Columns used in GROUP BY

**Index Types:**
```sql
-- B-Tree (default, most common)
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_users_name_email ON users(last_name, first_name);

-- Partial index (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Full-text search index
CREATE INDEX idx_posts_content ON posts USING gin(to_tsvector('english', content));
```

### 2. Query Analysis

**PostgreSQL:**
```sql
-- Analyze query plan
EXPLAIN ANALYZE
SELECT * FROM users
WHERE created_at > '2024-01-01'
ORDER BY created_at DESC
LIMIT 10;

-- Look for:
-- - Seq Scan (bad for large tables)
-- - Index Scan (good)
-- - Execution time
```

**MySQL:**
```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Check for:
-- - type: ALL (full table scan, bad)
-- - type: ref/eq_ref (index used, good)
-- - rows: number of rows examined
```

### 3. Eager Loading (ORM)

**Prisma:**
```typescript
// ❌ Bad: N+1 problem
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } });
}

// ✅ Good: Eager loading
const users = await prisma.user.findMany({
  include: { posts: true },
});
```

**TypeORM:**
```typescript
// ✅ Good: Use relations
const users = await userRepository.find({
  relations: ['posts', 'profile'],
});
```

### 4. Connection Pooling

**PostgreSQL (node-postgres):**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Prisma:**
```typescript
// In schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Connection pool settings in DATABASE_URL
// postgresql://user:password@localhost:5432/db?connection_limit=20
```

## Optimization Checklist

### Query Optimization
- [ ] Analyzed slow queries with EXPLAIN
- [ ] Removed SELECT * in favor of specific columns
- [ ] Added indexes on frequently queried columns
- [ ] Eliminated N+1 queries with eager loading
- [ ] Used pagination for large result sets
- [ ] Avoided queries in loops

### Indexing
- [ ] Indexed foreign keys
- [ ] Indexed columns used in WHERE clauses
- [ ] Created composite indexes for multi-column queries
- [ ] Removed unused indexes (they slow down writes)
- [ ] Analyzed index usage statistics

### Connection Management
- [ ] Configured connection pooling
- [ ] Set appropriate pool size (typically 10-20)
- [ ] Configured idle timeout
- [ ] Monitored connection usage
- [ ] Properly closing connections

### Data Modeling
- [ ] Normalized data appropriately
- [ ] Considered denormalization for read-heavy tables
- [ ] Used appropriate data types
- [ ] Avoided storing JSON/JSONB when relations work better

## Performance Monitoring

### Key Metrics
```sql
-- PostgreSQL: Slow query log
ALTER DATABASE mydb SET log_min_duration_statement = 1000; -- Log queries >1s

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE '%pkey%';

-- Table statistics
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch
FROM pg_stat_user_tables;
```

### Application Monitoring
```typescript
// Log slow queries (Prisma)
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    console.warn(`Slow query (${e.duration}ms): ${e.query}`);
  }
});
```

## Common Anti-Patterns

### ❌ Don't: Query in Loops
```typescript
// Bad
for (const userId of userIds) {
  const user = await db.user.findUnique({ where: { id: userId } });
}

// Good
const users = await db.user.findMany({ where: { id: { in: userIds } } });
```

### ❌ Don't: Over-Normalize
```typescript
// Bad: Separate table for user preferences (1-to-1)
// Requires JOIN for every user fetch

// Good: JSONB column for preferences
users {
  id, name, email, preferences JSONB
}
```

### ❌ Don't: Use OFFSET for Large Offsets
```sql
-- Bad: Slow for large offsets
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 10000;

-- Good: Use cursor-based pagination
SELECT * FROM posts WHERE id > 10000 ORDER BY id LIMIT 20;
```

## Framework-Specific Guides

### Prisma Optimization
```typescript
// Use select instead of include when possible
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: { select: { title: true } },
  },
});

// Use transactions for multiple operations
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.profile.create({ data: profileData }),
]);
```

### Drizzle ORM
```typescript
// Efficient queries with Drizzle
const result = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.userId))
  .where(eq(users.active, true))
  .limit(20);
```

## Load Testing

```bash
# Use pgbench for PostgreSQL
pgbench -c 10 -j 2 -t 1000 mydb

# Use Apache Bench for API load testing
ab -n 1000 -c 10 http://localhost:3000/api/users
```

## Success Metrics

- Query response time: <50ms for simple queries, <200ms for complex
- Connection pool utilization: <80% under normal load
- Index hit ratio: >95%
- Cache hit ratio: >80%
- No slow queries (>1s) in production

## References

- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Use The Index, Luke](https://use-the-index-luke.com/)
- [Prisma Performance Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [MySQL Query Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
