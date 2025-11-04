<?php

namespace {{namespace}}\Pagination;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Offset-based pagination helper for Laravel.
 * Wraps Laravel's built-in pagination with a consistent API.
 *
 * Best for: Small to medium datasets, user-facing pagination with page numbers
 * Advantages: Simple to implement, familiar UX, direct page access
 *
 * Example usage in controller:
 *
 * ```php
 * use App\Models\Product;
 * use App\Pagination\OffsetPaginator;
 *
 * class ProductController extends Controller
 * {
 *     public function index(Request $request)
 *     {
 *         $query = Product::where('active', true)->orderBy('name');
 *
 *         $result = OffsetPaginator::paginate(
 *             $query,
 *             $request->input('page', 1),
 *             $request->input('page_size', {{defaultPageSize}})
 *         );
 *
 *         return response()->json($result);
 *     }
 * }
 * ```
 */
class OffsetPaginator
{
    const DEFAULT_PAGE_SIZE = {{defaultPageSize}};
    const MAX_PAGE_SIZE = {{maxPageSize}};

    /**
     * Paginate a query using offset-based pagination
     *
     * @param Builder $query The Eloquent query builder
     * @param int $page Page number (1-indexed)
     * @param int $pageSize Number of items per page
     * @return array Paginated result with items and metadata
     */
    public static function paginate(
        Builder $query,
        int $page = 1,
        int $pageSize = self::DEFAULT_PAGE_SIZE
    ): array {
        // Validate and constrain parameters
        $page = max($page, 1);
        $pageSize = min(max($pageSize, 1), self::MAX_PAGE_SIZE);

        // Use Laravel's built-in pagination
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        return self::formatPaginator($paginator);
    }

    /**
     * Format a Laravel LengthAwarePaginator into our standard format
     *
     * @param LengthAwarePaginator $paginator
     * @return array
     */
    public static function formatPaginator(LengthAwarePaginator $paginator): array
    {
        return [
            'items' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'page_size' => $paginator->perPage(),
                'total_items' => $paginator->total(),
                'total_pages' => $paginator->lastPage(),
                'has_next' => $paginator->hasMorePages(),
                'has_previous' => $paginator->currentPage() > 1,
            ],
        ];
    }

    /**
     * Paginate and transform items using a resource class
     *
     * @param Builder $query
     * @param int $page
     * @param int $pageSize
     * @param string $resourceClass API resource class name
     * @return array
     */
    public static function paginateWithResource(
        Builder $query,
        int $page,
        int $pageSize,
        string $resourceClass
    ): array {
        $result = self::paginate($query, $page, $pageSize);

        return [
            'data' => $resourceClass::collection(collect($result['items']))->resolve(),
            'pagination' => $result['pagination'],
        ];
    }

    /**
     * Create a paginated response with HATEOAS links
     *
     * @param Builder $query
     * @param int $page
     * @param int $pageSize
     * @param string $baseUrl
     * @return array
     */
    public static function paginateWithLinks(
        Builder $query,
        int $page,
        int $pageSize,
        string $baseUrl
    ): array {
        $result = self::paginate($query, $page, $pageSize);

        $currentPage = $result['pagination']['current_page'];
        $totalPages = $result['pagination']['total_pages'];

        $links = [
            'first' => sprintf('%s?page=1&page_size=%d', $baseUrl, $pageSize),
            'last' => sprintf('%s?page=%d&page_size=%d', $baseUrl, $totalPages, $pageSize),
        ];

        if ($result['pagination']['has_previous']) {
            $links['previous'] = sprintf(
                '%s?page=%d&page_size=%d',
                $baseUrl,
                $currentPage - 1,
                $pageSize
            );
        }

        if ($result['pagination']['has_next']) {
            $links['next'] = sprintf(
                '%s?page=%d&page_size=%d',
                $baseUrl,
                $currentPage + 1,
                $pageSize
            );
        }

        $result['links'] = $links;

        return $result;
    }

    /**
     * Simple paginate (without total count) for better performance
     * Use this when you don't need total pages/items count
     *
     * @param Builder $query
     * @param int $page
     * @param int $pageSize
     * @return array
     */
    public static function simplePaginate(
        Builder $query,
        int $page = 1,
        int $pageSize = self::DEFAULT_PAGE_SIZE
    ): array {
        // Validate and constrain parameters
        $page = max($page, 1);
        $pageSize = min(max($pageSize, 1), self::MAX_PAGE_SIZE);

        $paginator = $query->simplePaginate($pageSize, ['*'], 'page', $page);

        return [
            'items' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'page_size' => $paginator->perPage(),
                'has_next' => $paginator->hasMorePages(),
                'has_previous' => $paginator->currentPage() > 1,
            ],
        ];
    }
}
