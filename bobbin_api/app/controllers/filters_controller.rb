class FiltersController < ApplicationController
  def index
    filters = Filter.where(user_id: 1)
    formatted_filters = filters.map do |filter|
      {
        id: filter.id,
        filter_name: filter.filter_name,
        target_column: filter.target_column,
        target_value: filter.target_value
      }
    end
    render json: { filters: formatted_filters }, status: :ok
  end
end
