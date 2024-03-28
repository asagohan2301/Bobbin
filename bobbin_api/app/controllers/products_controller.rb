class ProductsController < ApplicationController
  rescue_from ActiveRecord::RecordNotUnique, with: :handle_unique_constraint_violation

  def index
  end

  def create
    product = Product.new(product_params)
    if product.save
      render json: { product: format_product_response(product) }, status: :created
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def handle_unique_constraint_violation
    render json: { errors: 'Unique constraint violation' }, status: :unprocessable_entity
  end

  def format_product_response(product)
    {
      group: product.group.group_name,
      product_type: product.product_type.product_type,
      customer: product.customer.customer_name,
      product_number: product.product_number,
      product_name: product.product_name,
      user: product.user.user_name,
      progress: product.progress.progress_status
      # ,
      # document_path: product.document_path,
    }
  end

  def product_params
    params.require(:product).permit(
      :group_id,
      :product_type_id,
      :customer_id,
      :product_number,
      :product_name,
      :user_id,
      :progress_id,
      :document_path
    )
  end
end
