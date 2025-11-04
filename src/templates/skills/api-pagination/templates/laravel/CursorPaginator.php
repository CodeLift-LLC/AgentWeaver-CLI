<?php

namespace {{namespace}}\Pagination;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Cursor-based pagination for efficient navigation through large datasets.
 * Uses opaque cursors to track position without offset calculations.
 *
 * Best for: Large datasets, infinite scroll, real-time data, mobile apps
 * Advantages: Consistent performance, handles data changes gracefully
 *
 * Example usage in controller:
 *
 * ```php
 * use App\Models\User;
 * use App\Pagination\CursorPaginator;
 *
 * class UserController extends Controller
 * {
 *     public function index(Request $request)
 *     {
 *         $query = User::where('active', true)->orderBy('id');
 *
 *         $result = CursorPaginator::paginate(
 *             $query,
 *             $request->input('cursor'),
 *             $request->input('page_size', {{defaultPageSize}}),
 *             'id'
 *         );
 *
 *         return response()->json($result);
 *     }
 * }
 * ```
 */
class CursorPaginator
{
    const DEFAULT_PAGE_SIZE = {{defaultPageSize}};
    const MAX_PAGE_SIZE = {{maxPageSize}};

    /**
     * Encode a value as a base64 cursor
     *
     * @param mixed $value
     * @return string
     */
    public static function encodeCursor($value): string
    {
        if ($value === null) {
            return '';
        }

        return base64_encode((string) $value);
    }

    /**
     * Decode a base64 cursor
     *
     * @param string|null $cursor
     * @return string
     */
    public static function decodeCursor(?string $cursor): string
    {
        if (empty($cursor)) {
            return '';
        }

        $decoded = base64_decode($cursor, true);
        return $decoded !== false ? $decoded : '';
    }

    /**
     * Paginate a query using cursor-based pagination
     *
     * @param Builder $query The Eloquent query builder
     * @param string|null $cursor Current cursor (null for first page)
     * @param int $pageSize Number of items per page
     * @param string $cursorField Field to use as cursor (default: 'id')
     * @param string $direction Sort direction ('asc' or 'desc')
     * @return array Paginated result with items and metadata
     */
    public static function paginate(
        Builder $query,
        ?string $cursor = null,
        int $pageSize = self::DEFAULT_PAGE_SIZE,
        string $cursorField = 'id',
        string $direction = 'asc'
    ): array {
        // Constrain page size
        $pageSize = min(max($pageSize, 1), self::MAX_PAGE_SIZE);

        // Apply cursor filter if provided
        if (!empty($cursor)) {
            $decodedCursor = self::decodeCursor($cursor);

            if ($direction === 'asc') {
                $query->where($cursorField, '>', $decodedCursor);
            } else {
                $query->where($cursorField, '<', $decodedCursor);
            }
        }

        // Ensure ordering
        $query->orderBy($cursorField, $direction);

        // Fetch one extra item to check for next page
        $items = $query->limit($pageSize + 1)->get();

        $hasNext = $items->count() > $pageSize;

        if ($hasNext) {
            $items = $items->take($pageSize);
        }

        // Generate cursors
        $nextCursor = null;
        $previousCursor = null;

        if ($hasNext && $items->isNotEmpty()) {
            $nextCursor = self::encodeCursor($items->last()->{$cursorField});
        }

        if (!empty($cursor) && $items->isNotEmpty()) {
            $previousCursor = self::encodeCursor($items->first()->{$cursorField});
        }

        return [
            'items' => $items->values()->all(),
            'pagination' => [
                'next_cursor' => $nextCursor,
                'previous_cursor' => $previousCursor,
                'has_next' => $hasNext,
                'has_previous' => !empty($cursor),
                'page_size' => $pageSize,
            ],
        ];
    }

    /**
     * Paginate and transform items using a resource class
     *
     * @param Builder $query
     * @param string|null $cursor
     * @param int $pageSize
     * @param string $resourceClass API resource class name
     * @param string $cursorField
     * @param string $direction
     * @return array
     */
    public static function paginateWithResource(
        Builder $query,
        ?string $cursor,
        int $pageSize,
        string $resourceClass,
        string $cursorField = 'id',
        string $direction = 'asc'
    ): array {
        $result = self::paginate($query, $cursor, $pageSize, $cursorField, $direction);

        return [
            'data' => $resourceClass::collection(collect($result['items']))->resolve(),
            'pagination' => $result['pagination'],
        ];
    }

    /**
     * Create a paginated response with HATEOAS links
     *
     * @param Builder $query
     * @param string|null $cursor
     * @param int $pageSize
     * @param string $baseUrl
     * @param string $cursorField
     * @param string $direction
     * @return array
     */
    public static function paginateWithLinks(
        Builder $query,
        ?string $cursor,
        int $pageSize,
        string $baseUrl,
        string $cursorField = 'id',
        string $direction = 'asc'
    ): array {
        $result = self::paginate($query, $cursor, $pageSize, $cursorField, $direction);

        $links = [];

        if ($result['pagination']['has_previous'] && $result['pagination']['previous_cursor']) {
            $links['previous'] = sprintf(
                '%s?cursor=%s&page_size=%d',
                $baseUrl,
                $result['pagination']['previous_cursor'],
                $pageSize
            );
        }

        if ($result['pagination']['has_next'] && $result['pagination']['next_cursor']) {
            $links['next'] = sprintf(
                '%s?cursor=%s&page_size=%d',
                $baseUrl,
                $result['pagination']['next_cursor'],
                $pageSize
            );
        }

        $result['links'] = !empty($links) ? $links : null;

        return $result;
    }
}
