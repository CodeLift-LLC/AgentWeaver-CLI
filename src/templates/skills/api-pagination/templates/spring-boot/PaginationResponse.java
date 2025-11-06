package {{packageName}}.dto;

import java.util.List;

/**
 * Generic pagination response DTO for API responses
 */
public class PaginationResponse<T> {
    private List<T> data;
    private PaginationMeta pagination;
    private PaginationLinks links;

    public PaginationResponse() {
    }

    public PaginationResponse(List<T> data, PaginationMeta pagination) {
        this.data = data;
        this.pagination = pagination;
    }

    public PaginationResponse(List<T> data, PaginationMeta pagination, PaginationLinks links) {
        this.data = data;
        this.pagination = pagination;
        this.links = links;
    }

    // Getters and Setters
    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public PaginationMeta getPagination() {
        return pagination;
    }

    public void setPagination(PaginationMeta pagination) {
        this.pagination = pagination;
    }

    public PaginationLinks getLinks() {
        return links;
    }

    public void setLinks(PaginationLinks links) {
        this.links = links;
    }

    /**
     * Pagination metadata
     */
    public static class PaginationMeta {
        private Integer currentPage;
        private Integer pageSize;
        private Long totalItems;
        private Integer totalPages;
        private Boolean hasNext;
        private Boolean hasPrevious;
        private String nextCursor;
        private String previousCursor;

        public PaginationMeta() {
        }

        // Getters and Setters
        public Integer getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(Integer currentPage) {
            this.currentPage = currentPage;
        }

        public Integer getPageSize() {
            return pageSize;
        }

        public void setPageSize(Integer pageSize) {
            this.pageSize = pageSize;
        }

        public Long getTotalItems() {
            return totalItems;
        }

        public void setTotalItems(Long totalItems) {
            this.totalItems = totalItems;
        }

        public Integer getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(Integer totalPages) {
            this.totalPages = totalPages;
        }

        public Boolean getHasNext() {
            return hasNext;
        }

        public void setHasNext(Boolean hasNext) {
            this.hasNext = hasNext;
        }

        public Boolean getHasPrevious() {
            return hasPrevious;
        }

        public void setHasPrevious(Boolean hasPrevious) {
            this.hasPrevious = hasPrevious;
        }

        public String getNextCursor() {
            return nextCursor;
        }

        public void setNextCursor(String nextCursor) {
            this.nextCursor = nextCursor;
        }

        public String getPreviousCursor() {
            return previousCursor;
        }

        public void setPreviousCursor(String previousCursor) {
            this.previousCursor = previousCursor;
        }
    }

    /**
     * HATEOAS pagination links
     */
    public static class PaginationLinks {
        private String first;
        private String previous;
        private String next;
        private String last;

        public PaginationLinks() {
        }

        // Getters and Setters
        public String getFirst() {
            return first;
        }

        public void setFirst(String first) {
            this.first = first;
        }

        public String getPrevious() {
            return previous;
        }

        public void setPrevious(String previous) {
            this.previous = previous;
        }

        public String getNext() {
            return next;
        }

        public void setNext(String next) {
            this.next = next;
        }

        public String getLast() {
            return last;
        }

        public void setLast(String last) {
            this.last = last;
        }
    }
}
