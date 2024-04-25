class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]
  rescue_from ActiveRecord::RecordNotFound, with: :product_not_found
  rescue_from ActiveRecord::RecordNotUnique, with: :handle_unique_constraint_violation

  def index
    products = Product.all
    formatted_products = products.map { |product| format_product_response(product) }
    render json: { products: formatted_products }, status: :ok
  end

  def show
    render json: { product: format_product_response(@product) }, status: :ok
  end

  def create
    product = Product.new(product_params)

    ActiveRecord::Base.transaction do
      product.save!
      product.files.attach(params[:files]) if params[:files].present?
    end

    render json: { id: product.id }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  def update
    ActiveRecord::Base.transaction do
      @product.update!(product_params)
    end

    render json: { product: format_product_response(@product) }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  def destroy
    @product.destroy
    head :no_content
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def format_product_response(product)
    file_urls = product.files.map { |file| url_for(file) } if product.files.attached?
    {
      id: product.id,
      group_name: product.group.group_name,
      product_type: product.product_type.product_type,
      customer_name: product.customer.customer_name,
      product_number: product.product_number,
      product_name: product.product_name,
      user_name: product.user.user_name,
      progress_order: product.progress.order,
      progress_status: product.progress.progress_status,
      file_urls:
    }
  end

  def product_params
    params.permit(
      :id,
      :group_id,
      :product_type_id,
      :customer_id,
      :product_number,
      :product_name,
      :user_id,
      :progress_id
    )
  end

  # エラー処理

  # show, update, destroy で該当製品が見つからない
  def product_not_found
    render json: { errors: ['製品が見つかりませんでした'] }, status: :not_found
  end

  # ユニークキー制約違反 (データベースレベル)
  def handle_unique_constraint_violation
    render json: { errors: ['同じ品番または品名がすでに存在しています'] }, status: :unprocessable_entity
  end
end
