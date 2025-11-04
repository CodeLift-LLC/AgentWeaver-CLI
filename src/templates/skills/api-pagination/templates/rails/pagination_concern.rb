# frozen_string_literal: true

# Controller concern for easy pagination integration
#
# Include this concern in your ApplicationController or individual controllers
# to get access to pagination helper methods.
#
# Usage:
#
#   class ApplicationController < ActionController::API
#     include PaginationConcern
#   end
#
#   class UsersController < ApplicationController
#     def index
#       users = User.active.order(:created_at)
#
#       # Offset pagination
#       result = offset_paginate(users, page_param, page_size_param)
#       render json: paginated_response(result)
#
#       # OR cursor pagination
#       result = cursor_paginate(users, cursor_param, page_size_param)
#       render json: paginated_response(result)
#     end
#
#     # Automatic response rendering
#     def search
#       users = User.where('name LIKE ?', "%#{params[:q]}%").order(:name)
#
#       render_paginated(users, serializer: UserSerializer)
#     end
#   end
module PaginationConcern
  extend ActiveSupport::Concern

  include Pagination::OffsetPagination
  include Pagination::CursorPagination

  # Get page parameter from request (defaults to 1)
  #
  # @return [Integer] Page number
  def page_param
    [params[:page].to_i, 1].max
  end

  # Get page size parameter from request with validation
  #
  # @return [Integer] Page size
  def page_size_param
    size = params[:page_size] || params[:limit] || Pagination::OffsetPagination::DEFAULT_PAGE_SIZE
    size = size.to_i
    [[size, 1].max, Pagination::OffsetPagination::MAX_PAGE_SIZE].min
  end

  # Get cursor parameter from request
  #
  # @return [String, nil] Cursor value
  def cursor_param
    params[:cursor]
  end

  # Determine pagination type from request parameters
  #
  # @return [Symbol] :cursor or :offset
  def pagination_type
    params[:cursor].present? ? :cursor : :offset
  end

  # Create a standardized paginated response
  #
  # @param result [Hash] Result from offset_paginate or cursor_paginate
  # @param serializer [Class, nil] Optional serializer class
  # @param links [Boolean] Whether to include HATEOAS links
  # @return [Hash] Formatted response
  def paginated_response(result, serializer: nil, links: false)
    response = {
      data: serialize_items(result[:items], serializer),
      pagination: result[:pagination]
    }

    response[:links] = generate_links(result[:pagination]) if links

    response
  end

  # Automatically paginate and render a relation
  #
  # @param relation [ActiveRecord::Relation] Query to paginate
  # @param serializer [Class, nil] Optional serializer
  # @param type [Symbol, nil] Force pagination type (:cursor or :offset)
  # @param links [Boolean] Include HATEOAS links
  def render_paginated(relation, serializer: nil, type: nil, links: false)
    type ||= pagination_type

    result = case type
             when :cursor
               cursor_paginate(relation, cursor_param, page_size_param)
             else
               offset_paginate(relation, page_param, page_size_param)
             end

    render json: paginated_response(result, serializer: serializer, links: links)
  end

  private

  # Serialize items using provided serializer or as_json
  def serialize_items(items, serializer)
    return items.as_json unless serializer

    items.map { |item| serializer.new(item).as_json }
  end

  # Generate HATEOAS links for pagination
  def generate_links(pagination)
    base_url = request.original_url.split('?').first

    if pagination[:next_cursor]
      # Cursor pagination links
      {
        previous: pagination[:has_previous] ? "#{base_url}?cursor=#{pagination[:previous_cursor]}&page_size=#{pagination[:page_size]}" : nil,
        next: pagination[:has_next] ? "#{base_url}?cursor=#{pagination[:next_cursor]}&page_size=#{pagination[:page_size]}" : nil
      }.compact
    else
      # Offset pagination links
      {
        first: "#{base_url}?page=1&page_size=#{pagination[:page_size]}",
        previous: pagination[:has_previous] ? "#{base_url}?page=#{pagination[:current_page] - 1}&page_size=#{pagination[:page_size]}" : nil,
        next: pagination[:has_next] ? "#{base_url}?page=#{pagination[:current_page] + 1}&page_size=#{pagination[:page_size]}" : nil,
        last: "#{base_url}?page=#{pagination[:total_pages]}&page_size=#{pagination[:page_size]}"
      }.compact
    end
  end
end
