/**
 * TypeScript Type Definitions for Pagination
 *
 * Shared types for both cursor-based and offset-based pagination
 */

/**
 * Generic pagination metadata
 */
export interface PaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Cursor pagination metadata
 */
export interface CursorPaginationMeta extends PaginationMeta {
  nextCursor: string | null;
  previousCursor: string | null;
  pageSize: number;
}

/**
 * Offset pagination metadata
 */
export interface OffsetPaginationMeta extends PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T, M extends PaginationMeta = PaginationMeta> {
  data: T[];
  pagination: M;
}

/**
 * Cursor-based paginated response
 */
export type CursorPaginatedResponse<T> = PaginatedResponse<T, CursorPaginationMeta>;

/**
 * Offset-based paginated response
 */
export type OffsetPaginatedResponse<T> = PaginatedResponse<T, OffsetPaginationMeta>;

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: SortDirection;
}

/**
 * Pagination query parameters (from request)
 */
export interface PaginationQuery {
  // Cursor-based
  cursor?: string;
  limit?: number;

  // Offset-based
  page?: number;

  // Common
  sort?: string;
  order?: SortDirection;
}
