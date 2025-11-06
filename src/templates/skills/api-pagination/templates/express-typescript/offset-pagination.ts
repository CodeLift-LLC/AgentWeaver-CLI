/**
 * Offset-based Pagination Utility for Express + TypeScript
 *
 * Simple page-based pagination using offset and limit.
 * Best for: Small to medium datasets, user-facing pagination with page numbers
 */

import { Request, Response } from 'express';

export interface OffsetPaginationParams {
  page?: number;
  limit?: number;
}

export interface OffsetPaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface OffsetPaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

const DEFAULT_OPTIONS: Required<OffsetPaginationOptions> = {
  defaultLimit: {{defaultPageSize}},
  maxLimit: 100,
};

/**
 * Parse pagination parameters from Express request
 */
export function parseOffsetParams(
  req: Request,
  options: OffsetPaginationOptions = {}
): { offset: number; limit: number; page: number } {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || opts.defaultLimit;

  // Validate and constrain
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), opts.maxLimit);

  const offset = (page - 1) * limit;

  return { offset, limit, page };
}

/**
 * Create paginated response
 */
export function createOffsetPaginationResponse<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number
): OffsetPaginationResult<T> {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Helper to send paginated response
 */
export function sendOffsetPaginationResponse<T>(
  res: Response,
  result: OffsetPaginationResult<T>
): Response {
  return res.json(result);
}

/**
 * Express middleware for offset pagination
 *
 * Usage:
 * ```typescript
 * import { offsetPaginationMiddleware } from './utils/pagination';
 *
 * router.get('/items', offsetPaginationMiddleware(), async (req, res) => {
 *   const { offset, limit, page } = req.pagination;
 *   const items = await db.getItems(offset, limit);
 *   const total = await db.countItems();
 *
 *   return sendOffsetPaginationResponse(
 *     res,
 *     createOffsetPaginationResponse(items, total, page, limit)
 *   );
 * });
 * ```
 */
export function offsetPaginationMiddleware(options: OffsetPaginationOptions = {}) {
  return (req: Request, res: Response, next: Function) => {
    req.pagination = parseOffsetParams(req, options);
    next();
  };
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      pagination?: { offset: number; limit: number; page: number };
    }
  }
}
