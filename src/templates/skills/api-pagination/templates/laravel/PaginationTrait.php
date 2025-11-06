<?php

namespace {{namespace}}\Http\Controllers;

use Illuminate\Http\Request;
use {{namespace}}\Pagination\CursorPaginator;
use {{namespace}}\Pagination\OffsetPaginator;

/**
 * Controller trait for easy pagination integration
 *
 * Include this trait in your controllers to get helper methods for pagination.
 *
 * Usage:
 *
 * ```php
 * class UserController extends Controller
 * {
 *     use PaginationTrait;
 *
 *     public function index(Request $request)
 *     {
 *         $query = User::where('active', true)->orderBy('created_at');
 *
 *         // Automatic pagination based on request params
 *         return $this->paginatedResponse($query);
 *
 *         // Or with resource transformation
 *         return $this->paginatedResponse($query, UserResource::class);
 *     }
 * }
 * ```
 */
trait PaginationTrait
{
    /**
     * Get page number from request (defaults to 1)
     *
     * @param Request $request
     * @return int
     */
    protected function getPage(Request $request): int
    {
        return max((int) $request->input('page', 1), 1);
    }

    /**
     * Get page size from request with validation
     *
     * @param Request $request
     * @return int
     */
    protected function getPageSize(Request $request): int
    {
        $pageSize = (int) $request->input('page_size', $request->input('limit', {{defaultPageSize}}));
        return min(max($pageSize, 1), {{maxPageSize}});
    }

    /**
     * Get cursor from request
     *
     * @param Request $request
     * @return string|null
     */
    protected function getCursor(Request $request): ?string
    {
        return $request->input('cursor');
    }

    /**
     * Determine pagination type from request
     *
     * @param Request $request
     * @return string 'cursor' or 'offset'
     */
    protected function getPaginationType(Request $request): string
    {
        return $request->has('cursor') ? 'cursor' : 'offset';
    }

    /**
     * Get the base URL for pagination links
     *
     * @param Request $request
     * @return string
     */
    protected function getBaseUrl(Request $request): string
    {
        return $request->url();
    }

    /**
     * Create a paginated JSON response automatically
     *
     * Detects pagination type from request parameters and applies appropriate pagination.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $resourceClass Optional API resource class
     * @param bool $includeLinks Whether to include HATEOAS links
     * @param string|null $type Force pagination type ('cursor' or 'offset')
     * @return \Illuminate\Http\JsonResponse
     */
    protected function paginatedResponse(
        $query,
        ?string $resourceClass = null,
        bool $includeLinks = false,
        ?string $type = null
    ) {
        $request = request();
        $type = $type ?? $this->getPaginationType($request);

        if ($type === 'cursor') {
            $result = $this->cursorPaginate($query, $request, $resourceClass, $includeLinks);
        } else {
            $result = $this->offsetPaginate($query, $request, $resourceClass, $includeLinks);
        }

        return response()->json($result);
    }

    /**
     * Perform cursor-based pagination
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Request $request
     * @param string|null $resourceClass
     * @param bool $includeLinks
     * @return array
     */
    protected function cursorPaginate(
        $query,
        Request $request,
        ?string $resourceClass = null,
        bool $includeLinks = false
    ): array {
        $cursor = $this->getCursor($request);
        $pageSize = $this->getPageSize($request);
        $cursorField = $request->input('cursor_field', 'id');

        if ($includeLinks) {
            $baseUrl = $this->getBaseUrl($request);
            $result = CursorPaginator::paginateWithLinks(
                $query,
                $cursor,
                $pageSize,
                $baseUrl,
                $cursorField
            );
        } else {
            $result = CursorPaginator::paginate($query, $cursor, $pageSize, $cursorField);
        }

        if ($resourceClass) {
            $result['data'] = $resourceClass::collection(collect($result['items']))->resolve();
            unset($result['items']);
        } else {
            $result['data'] = $result['items'];
            unset($result['items']);
        }

        return $result;
    }

    /**
     * Perform offset-based pagination
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Request $request
     * @param string|null $resourceClass
     * @param bool $includeLinks
     * @return array
     */
    protected function offsetPaginate(
        $query,
        Request $request,
        ?string $resourceClass = null,
        bool $includeLinks = false
    ): array {
        $page = $this->getPage($request);
        $pageSize = $this->getPageSize($request);

        if ($includeLinks) {
            $baseUrl = $this->getBaseUrl($request);
            $result = OffsetPaginator::paginateWithLinks($query, $page, $pageSize, $baseUrl);
        } else {
            $result = OffsetPaginator::paginate($query, $page, $pageSize);
        }

        if ($resourceClass) {
            $result['data'] = $resourceClass::collection(collect($result['items']))->resolve();
            unset($result['items']);
        } else {
            $result['data'] = $result['items'];
            unset($result['items']);
        }

        return $result;
    }
}
