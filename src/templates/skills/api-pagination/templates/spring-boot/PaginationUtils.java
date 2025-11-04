package {{packageName}}.util;

import {{packageName}}.dto.PaginationResponse;
import {{packageName}}.pagination.OffsetPagination;

import java.util.Base64;
import java.nio.charset.StandardCharsets;

/**
 * Utility methods for pagination
 */
public class PaginationUtils {

    /**
     * Encode a cursor value to base64
     */
    public static String encodeCursor(Object value) {
        if (value == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(value.toString().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Decode a cursor from base64
     */
    public static String decodeCursor(String cursor) {
        if (cursor == null || cursor.isEmpty()) {
            return null;
        }
        try {
            return new String(Base64.getDecoder().decode(cursor), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Convert OffsetPagination to PaginationResponse
     */
    public static <T> PaginationResponse<T> toResponse(OffsetPagination<T> pagination) {
        PaginationResponse.PaginationMeta meta = new PaginationResponse.PaginationMeta();
        meta.setCurrentPage(pagination.getCurrentPage());
        meta.setPageSize(pagination.getPageSize());
        meta.setTotalItems(pagination.getTotalItems());
        meta.setTotalPages(pagination.getTotalPages());
        meta.setHasNext(pagination.isHasNext());
        meta.setHasPrevious(pagination.isHasPrevious());

        return new PaginationResponse<>(pagination.getItems(), meta);
    }

    /**
     * Convert OffsetPagination to PaginationResponse with HATEOAS links
     */
    public static <T> PaginationResponse<T> toResponse(OffsetPagination<T> pagination, String baseUrl) {
        PaginationResponse<T> response = toResponse(pagination);

        PaginationResponse.PaginationLinks links = new PaginationResponse.PaginationLinks();
        links.setFirst(String.format("%s?page=1&pageSize=%d", baseUrl, pagination.getPageSize()));
        links.setLast(String.format("%s?page=%d&pageSize=%d", baseUrl, pagination.getTotalPages(), pagination.getPageSize()));

        if (pagination.isHasPrevious()) {
            links.setPrevious(String.format("%s?page=%d&pageSize=%d", baseUrl, pagination.getCurrentPage() - 1, pagination.getPageSize()));
        }

        if (pagination.isHasNext()) {
            links.setNext(String.format("%s?page=%d&pageSize=%d", baseUrl, pagination.getCurrentPage() + 1, pagination.getPageSize()));
        }

        response.setLinks(links);
        return response;
    }

    /**
     * Validate and constrain page number
     */
    public static int validatePage(Integer page) {
        return page != null && page > 0 ? page : 1;
    }

    /**
     * Validate and constrain page size
     */
    public static int validatePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return {{defaultPageSize}};
        }
        return Math.min(pageSize, {{maxPageSize}});
    }
}
