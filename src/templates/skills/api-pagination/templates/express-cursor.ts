/**
 * Cursor-based pagination implementation for Express.js + TypeScript
 *
 * Usage:
 * router.get('/items', paginateItems);
 */

import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schema for pagination params
const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Cursor structure (base64 encoded)
interface Cursor {
  id: number;
  createdAt?: string;
}

// Helper: Encode cursor
function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
}

// Helper: Decode cursor
function decodeCursor(cursorString: string): Cursor | null {
  try {
    const decoded = Buffer.from(cursorString, 'base64').toString('utf-8');
    return JSON.parse(decoded) as Cursor;
  } catch {
    return null;
  }
}

// Example: Paginate items from database
export async function paginateItems(req: Request, res: Response) {
  try {
    // Validate query parameters
    const { cursor, limit } = paginationSchema.parse(req.query);

    // Decode cursor if provided
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    // Build database query (example with Prisma)
    const items = await prisma.item.findMany({
      take: limit + 1, // Fetch one extra to determine if there are more
      ...(decodedCursor && {
        cursor: { id: decodedCursor.id },
        skip: 1, // Skip the cursor item itself
      }),
      orderBy: { id: 'asc' }, // Consistent ordering is crucial!
    });

    // Determine if there are more items
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;

    // Generate next cursor
    const nextCursor = hasMore && data.length > 0
      ? encodeCursor({ id: data[data.length - 1].id })
      : null;

    // Return paginated response
    res.json({
      data,
      pagination: {
        nextCursor,
        hasMore,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid pagination parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Alternative: Generic pagination function
export async function paginateCursor<T extends { id: number }>(
  query: (cursor: number | null, limit: number) => Promise<T[]>,
  cursor: string | undefined,
  limit: number
) {
  const decodedCursor = cursor ? decodeCursor(cursor) : null;
  const items = await query(decodedCursor?.id || null, limit + 1);

  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;

  const nextCursor = hasMore && data.length > 0
    ? encodeCursor({ id: data[data.length - 1].id })
    : null;

  return {
    data,
    pagination: {
      nextCursor,
      hasMore,
    },
  };
}
