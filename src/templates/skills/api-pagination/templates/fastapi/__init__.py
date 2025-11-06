"""
Pagination utilities for FastAPI

This package provides both cursor-based and offset-based pagination.
"""

from .cursor_pagination import (
    CursorPaginationParams,
    CursorPaginationResponse,
    cursor_paginate,
    encode_cursor,
    decode_cursor
)

from .offset_pagination import (
    OffsetPaginationParams,
    OffsetPaginationMeta,
    OffsetPaginationResponse,
    offset_paginate,
    create_pagination_response
)

__all__ = [
    # Cursor pagination
    "CursorPaginationParams",
    "CursorPaginationResponse",
    "cursor_paginate",
    "encode_cursor",
    "decode_cursor",
    # Offset pagination
    "OffsetPaginationParams",
    "OffsetPaginationMeta",
    "OffsetPaginationResponse",
    "offset_paginate",
    "create_pagination_response",
]
