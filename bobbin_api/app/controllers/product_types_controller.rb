class ProductTypesController < ApplicationController
  def index
    product_types = ProductType.where(group_id: @current_group_id)
    formatted_product_types = product_types.map do |product_type|
      {
        id: product_type.id,
        product_type: product_type.product_type
      }
    end
    render json: { product_types: formatted_product_types }, status: :ok
  end
end
