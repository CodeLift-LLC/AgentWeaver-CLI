import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:your-super-secret-password@localhost:54322/postgres',
  },
  verbose: true,
  strict: true,
} satisfies Config;
