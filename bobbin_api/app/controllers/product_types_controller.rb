class ProductTypesController < ApplicationController
  def index
    product_types = ProductType.where(group_id: 1)
    formatted_product_types = product_types.map do |product_type|
      {
        id: product_type.id,
        product_type: product_type.product_type
      }
    end
    render json: { product_types: formatted_product_types }
  end
end
