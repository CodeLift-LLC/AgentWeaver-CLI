<?php

namespace {{namespace}}\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * API Resource for paginated responses
 *
 * Wraps paginated data in a consistent format with metadata.
 *
 * Example usage:
 *
 * ```php
 * // In your controller
 * use App\Http\Resources\PaginatedResource;
 * use App\Http\Resources\UserResource;
 *
 * public function index(Request $request)
 * {
 *     $users = User::where('active', true)->orderBy('name');
 *     $result = OffsetPaginator::paginate($users, $this->getPage($request), $this->getPageSize($request));
 *
 *     return new PaginatedResource(
 *         $result['items'],
 *         $result['pagination'],
 *         UserResource::class
 *     );
 * }
 * ```
 */
class PaginatedResource extends JsonResource
{
    /**
     * The resource collection
     *
     * @var mixed
     */
    protected $collection;

    /**
     * Pagination metadata
     *
     * @var array
     */
    protected $pagination;

    /**
     * Optional resource class for items
     *
     * @var string|null
     */
    protected $resourceClass;

    /**
     * Optional HATEOAS links
     *
     * @var array|null
     */
    protected $links;

    /**
     * Create a new paginated resource instance
     *
     * @param mixed $collection
     * @param array $pagination
     * @param string|null $resourceClass
     * @param array|null $links
     */
    public function __construct(
        $collection,
        array $pagination,
        ?string $resourceClass = null,
        ?array $links = null
    ) {
        parent::__construct($collection);

        $this->collection = $collection;
        $this->pagination = $pagination;
        $this->resourceClass = $resourceClass;
        $this->links = $links;
    }

    /**
     * Transform the resource into an array
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $response = [
            'data' => $this->transformItems(),
            'pagination' => $this->pagination,
        ];

        if ($this->links !== null) {
            $response['links'] = $this->links;
        }

        return $response;
    }

    /**
     * Transform items using the resource class or return as-is
     *
     * @return array
     */
    protected function transformItems(): array
    {
        if ($this->resourceClass === null) {
            // Return items as-is (will be serialized by Laravel)
            return is_array($this->collection)
                ? $this->collection
                : $this->collection->toArray();
        }

        // Transform using resource class
        $resourceClass = $this->resourceClass;
        $collection = collect($this->collection);

        return $collection->map(function ($item) use ($resourceClass) {
            return (new $resourceClass($item))->toArray(request());
        })->all();
    }

    /**
     * Get additional data that should be returned with the resource array
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function with($request): array
    {
        return [
            'meta' => [
                'timestamp' => now()->toIso8601String(),
            ],
        ];
    }
}

/**
 * Collection resource for paginated data
 *
 * Alternative approach using ResourceCollection
 */
class PaginatedCollection extends ResourceCollection
{
    /**
     * Pagination metadata
     *
     * @var array
     */
    protected $paginationMeta;

    /**
     * Optional HATEOAS links
     *
     * @var array|null
     */
    protected $paginationLinks;

    /**
     * Create a new resource collection
     *
     * @param mixed $resource
     * @param array $pagination
     * @param array|null $links
     */
    public function __construct($resource, array $pagination, ?array $links = null)
    {
        parent::__construct($resource);

        $this->paginationMeta = $pagination;
        $this->paginationLinks = $links;
    }

    /**
     * Transform the resource collection into an array
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request): array
    {
        $response = [
            'data' => $this->collection,
            'pagination' => $this->paginationMeta,
        ];

        if ($this->paginationLinks !== null) {
            $response['links'] = $this->paginationLinks;
        }

        return $response;
    }
}
