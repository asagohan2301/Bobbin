class ProductsController < ApplicationController
  rescue_from ActiveRecord::RecordNotUnique, with: :handle_unique_constraint_violation

  def index
  end

  def show
    product = Product.find(params[:id])
    if product
      render json: { product: format_product_response(product) }, status: :ok
    else
      render json: { errors: ['Product not found'] }, status: :not_found
    end
  end

  def create
    product = Product.new(product_params)
    product.files.attach(params[:files])
    if product.save
      render json: { id: product.id }, status: :created
    else
      render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    product = Product.find(params[:id])
    if product.destroy
      head :no_content
    else
      render json: { errors: ['Product not found'] }, status: :not_found
    end
  end

  private

  def handle_unique_constraint_violation
    render json: { errors: ['Unique constraint violation'] }, status: :unprocessable_entity
  end

  def format_product_response(product)
    file_urls = product.files.map { |file| url_for(file) } if product.files.attached?
    {
      id: product.id,
      group: product.group.group_name,
      product_type: product.product_type.product_type,
      customer: product.customer.customer_name,
      product_number: product.product_number,
      product_name: product.product_name,
      user: product.user.user_name,
      progress: product.progress.progress_status,
      file_urls:
      # document_path: product.document_path,
    }
  end

  def product_params
    params.permit(
      :group_id,
      :product_type_id,
      :customer_id,
      :product_number,
      :product_name,
      :user_id,
      :progress_id
      # :document_path
    )
  end
end