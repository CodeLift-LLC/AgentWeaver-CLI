# frozen_string_literal: true

# Base serializer for paginated responses
# Wraps data with pagination metadata in a consistent format
#
# Example usage:
#
#   class UsersController < ApplicationController
#     def index
#       users = User.active.order(:created_at)
#       result = offset_paginate(users, params[:page], params[:page_size])
#
#       render json: PaginatedSerializer.new(
#         result[:items],
#         result[:pagination],
#         serializer: UserSerializer
#       )
#     end
#   end
class PaginatedSerializer
  attr_reader :items, :pagination, :serializer, :links

  # Initialize paginated serializer
  #
  # @param items [Array] Collection of items to serialize
  # @param pagination [Hash] Pagination metadata
  # @param serializer [Class, nil] Optional item serializer class
  # @param links [Hash, nil] Optional HATEOAS links
  def initialize(items, pagination, serializer: nil, links: nil)
    @items = items
    @pagination = pagination
    @serializer = serializer
    @links = links
  end

  # Serialize to JSON
  #
  # @return [Hash] Serialized response
  def as_json(*)
    response = {
      data: serialize_items,
      pagination: pagination
    }

    response[:links] = links if links.present?

    response
  end

  # Convert to JSON string
  #
  # @param options [Hash] JSON generation options
  # @return [String] JSON string
  def to_json(options = {})
    as_json.to_json(options)
  end

  private

  # Serialize individual items
  def serialize_items
    return items.as_json unless serializer

    if items.respond_to?(:map)
      items.map { |item| serializer.new(item).as_json }
    else
      serializer.new(items).as_json
    end
  end
end

# Example item serializer (using ActiveModel::Serializer pattern)
#
# class UserSerializer
#   def initialize(user)
#     @user = user
#   end
#
#   def as_json(*)
#     {
#       id: @user.id,
#       name: @user.name,
#       email: @user.email,
#       created_at: @user.created_at.iso8601,
#       updated_at: @user.updated_at.iso8601
#     }
#   end
# end
