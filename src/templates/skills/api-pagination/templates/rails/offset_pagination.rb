# frozen_string_literal: true

module Pagination
  # Offset-based pagination for traditional page number navigation.
  #
  # Best for: Small to medium datasets, user-facing pagination with page numbers
  # Advantages: Simple to implement, familiar UX, direct page access
  #
  # Example usage in controller:
  #
  #   class ProductsController < ApplicationController
  #     include PaginationConcern
  #
  #     def index
  #       products = Product.active.order(:name)
  #       result = offset_paginate(products, params[:page], params[:page_size])
  #
  #       render json: result
  #     end
  #   end
  module OffsetPagination
    DEFAULT_PAGE_SIZE = {{defaultPageSize}}
    MAX_PAGE_SIZE = {{maxPageSize}}

    # Paginate an ActiveRecord relation using offset-based pagination
    #
    # @param relation [ActiveRecord::Relation] The query to paginate
    # @param page [Integer] Page number (1-indexed)
    # @param page_size [Integer] Number of items per page
    # @return [Hash] Paginated result with items and metadata
    #
    # @example
    #   result = offset_paginate(Product.active, 1, 20)
    #   # => {
    #   #   items: [...],
    #   #   pagination: {
    #   #     current_page: 1,
    #   #     page_size: 20,
    #   #     total_items: 150,
    #   #     total_pages: 8,
    #   #     has_next: true,
    #   #     has_previous: false
    #   #   }
    #   # }
    def offset_paginate(relation, page = 1, page_size = DEFAULT_PAGE_SIZE)
      # Validate and constrain parameters
      page = [page.to_i, 1].max
      page_size = [[page_size.to_i, 1].max, MAX_PAGE_SIZE].min

      # Get total count
      total_items = relation.count

      # Calculate offset
      offset = (page - 1) * page_size

      # Get items for current page
      items = relation.limit(page_size).offset(offset).to_a

      # Calculate total pages
      total_pages = (total_items.to_f / page_size).ceil

      {
        items: items,
        pagination: {
          current_page: page,
          page_size: page_size,
          total_items: total_items,
          total_pages: total_pages,
          has_next: page < total_pages,
          has_previous: page > 1
        }
      }
    end

    # Paginate with optimized count query
    # Use this when you have a complex query and want to optimize the count operation
    #
    # @param relation [ActiveRecord::Relation] The main query
    # @param count_relation [ActiveRecord::Relation] Optimized count query
    # @param page [Integer] Page number (1-indexed)
    # @param page_size [Integer] Number of items per page
    # @return [Hash] Paginated result
    #
    # @example
    #   # Main query with joins
    #   products = Product.joins(:category).where(active: true).order(:name)
    #
    #   # Optimized count query without joins
    #   count_query = Product.where(active: true)
    #
    #   result = offset_paginate_with_count(products, count_query, 1, 20)
    def offset_paginate_with_count(relation, count_relation, page = 1, page_size = DEFAULT_PAGE_SIZE)
      # Validate and constrain parameters
      page = [page.to_i, 1].max
      page_size = [[page_size.to_i, 1].max, MAX_PAGE_SIZE].min

      # Get total count using optimized query
      total_items = count_relation.count

      # Calculate offset
      offset = (page - 1) * page_size

      # Get items for current page
      items = relation.limit(page_size).offset(offset).to_a

      # Calculate total pages
      total_pages = (total_items.to_f / page_size).ceil

      {
        items: items,
        pagination: {
          current_page: page,
          page_size: page_size,
          total_items: total_items,
          total_pages: total_pages,
          has_next: page < total_pages,
          has_previous: page > 1
        }
      }
    end

    # Offset paginate and render as JSON with custom serializer
    #
    # @param relation [ActiveRecord::Relation] The query to paginate
    # @param page [Integer] Page number
    # @param page_size [Integer] Number of items per page
    # @param serializer [Class] Serializer class to use
    # @return [Hash] Serialized paginated response
    def offset_paginate_json(relation, page, page_size, serializer: nil)
      result = offset_paginate(relation, page, page_size)

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

    # Generate pagination links (HATEOAS)
    #
    # @param base_url [String] Base URL for the endpoint
    # @param pagination [Hash] Pagination metadata
    # @return [Hash] Links hash
    def pagination_links(base_url, pagination)
      page = pagination[:current_page]
      page_size = pagination[:page_size]
      total_pages = pagination[:total_pages]

      links = {
        first: "#{base_url}?page=1&page_size=#{page_size}",
        last: "#{base_url}?page=#{total_pages}&page_size=#{page_size}"
      }

      links[:previous] = "#{base_url}?page=#{page - 1}&page_size=#{page_size}" if pagination[:has_previous]
      links[:next] = "#{base_url}?page=#{page + 1}&page_size=#{page_size}" if pagination[:has_next]

      links
    end
  end
end
