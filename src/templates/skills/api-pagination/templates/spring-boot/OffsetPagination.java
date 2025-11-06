package {{packageName}}.pagination;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * Offset-based pagination for Spring Boot with Spring Data
 * Best for: Small to medium datasets, user-facing pagination with page numbers
 */
public class OffsetPagination<T> {
    private final List<T> items;
    private final int currentPage;
    private final int pageSize;
    private final long totalItems;
    private final int totalPages;
    private final boolean hasNext;
    private final boolean hasPrevious;

    public OffsetPagination(List<T> items, int currentPage, int pageSize, long totalItems) {
        this.items = items;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = (int) Math.ceil((double) totalItems / pageSize);
        this.hasNext = currentPage < totalPages;
        this.hasPrevious = currentPage > 1;
    }

    /**
     * Create from Spring Data Page
     */
    public static <T> OffsetPagination<T> fromPage(Page<T> page) {
        return new OffsetPagination<>(
            page.getContent(),
            page.getNumber() + 1, // Spring Data uses 0-indexed pages
            page.getSize(),
            page.getTotalElements()
        );
    }

    /**
     * Create a Pageable request with validation
     */
    public static Pageable createPageable(int page, int size) {
        page = Math.max(page, 1);
        size = Math.min(Math.max(size, 1), {{maxPageSize}});
        return PageRequest.of(page - 1, size); // Spring Data uses 0-indexed pages
    }

    /**
     * Create a Pageable request with sorting
     */
    public static Pageable createPageable(int page, int size, Sort sort) {
        page = Math.max(page, 1);
        size = Math.min(Math.max(size, 1), {{maxPageSize}});
        return PageRequest.of(page - 1, size, sort);
    }

    // Getters
    public List<T> getItems() {
        return items;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }
}
