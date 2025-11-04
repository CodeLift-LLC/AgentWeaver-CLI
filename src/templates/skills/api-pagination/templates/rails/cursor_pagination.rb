# frozen_string_literal: true

module Pagination
  # Cursor-based pagination for efficient navigation through large datasets.
  # Uses opaque cursors to track position without offset calculations.
  #
  # Best for: Large datasets, infinite scroll, real-time data, mobile apps
  # Advantages: Consistent performance, handles data changes gracefully
  #
  # Example usage in controller:
  #
  #   class UsersController < ApplicationController
  #     include PaginationConcern
  #
  #     def index
  #       users = User.active.order(:id)
  #       result = cursor_paginate(users, params[:cursor], params[:page_size] || {{defaultPageSize}})
  #
  #       render json: result
  #     end
  #   end
  module CursorPagination
    DEFAULT_PAGE_SIZE = {{defaultPageSize}}
    MAX_PAGE_SIZE = {{maxPageSize}}

    # Encode a value as a base64 cursor
    #
    # @param value [Object] The value to encode
    # @return [String] Base64 encoded cursor
    def encode_cursor(value)
      return '' if value.nil?

      Base64.strict_encode64(value.to_s)
    end

    # Decode a base64 cursor
    #
    # @param cursor [String] The cursor to decode
    # @return [String] Decoded cursor value
    def decode_cursor(cursor)
      return '' if cursor.blank?

      Base64.strict_decode64(cursor)
    rescue ArgumentError
      ''
    end

    # Paginate an ActiveRecord relation using cursor-based pagination
    #
    # @param relation [ActiveRecord::Relation] The query to paginate
    # @param cursor [String, nil] Current cursor (nil for first page)
    # @param page_size [Integer] Number of items per page
    # @param cursor_field [Symbol] Field to use as cursor (default: :id)
    # @param direction [Symbol] Sort direction (:asc or :desc)
    # @return [Hash] Paginated result with items and metadata
    #
    # @example
    #   result = cursor_paginate(User.active, params[:cursor], 20, :id, :asc)
    #   # => {
    #   #   items: [...],
    #   #   pagination: {
    #   #     next_cursor: "...",
    #   #     previous_cursor: "...",
    #   #     has_next: true,
    #   #     has_previous: false,
    #   #     page_size: 20
    #   #   }
    #   # }
    def cursor_paginate(relation, cursor = nil, page_size = DEFAULT_PAGE_SIZE, cursor_field = :id, direction = :asc)
      # Constrain page size
      page_size = [[page_size.to_i, 1].max, MAX_PAGE_SIZE].min

      # Apply cursor filter if provided
      if cursor.present?
        decoded_cursor = decode_cursor(cursor)

        relation = if direction == :asc
                     relation.where("#{cursor_field} > ?", decoded_cursor)
                   else
                     relation.where("#{cursor_field} < ?", decoded_cursor)
                   end
      end

      # Ensure ordering
      relation = relation.order(cursor_field => direction)

      # Fetch one extra item to check for next page
      items = relation.limit(page_size + 1).to_a

      has_next = items.size > page_size
      items = items.take(page_size) if has_next

      # Generate cursors
      next_cursor = if has_next && items.any?
                      encode_cursor(items.last.send(cursor_field))
                    end

      previous_cursor = if cursor.present? && items.any?
                          encode_cursor(items.first.send(cursor_field))
                        end

      {
        items: items,
        pagination: {
          next_cursor: next_cursor,
          previous_cursor: previous_cursor,
          has_next: has_next,
          has_previous: cursor.present?,
          page_size: page_size
        }
      }
    end

    # Cursor paginate and render as JSON with custom serializer
    #
    # @param relation [ActiveRecord::Relation] The query to paginate
    # @param cursor [String, nil] Current cursor
    # @param page_size [Integer] Number of items per page
    # @param serializer [Class] Serializer class to use
    # @param cursor_field [Symbol] Field to use as cursor
    # @param direction [Symbol] Sort direction
    # @return [Hash] Serialized paginated response
    def cursor_paginate_json(relation, cursor, page_size, serializer: nil, cursor_field: :id, direction: :asc)
      result = cursor_paginate(relation, cursor, page_size, cursor_field, direction)

      items = if serializer
                result[:items].map { |item| serializer.new(item).as_json }
              else
                result[:items].as_json
              end

      {
        data: items,
        pagination: result[:pagination]
      }
    end
  end
end
