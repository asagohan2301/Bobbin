class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]
  rescue_from ActiveRecord::RecordNotFound, with: :product_not_found
  rescue_from ActiveRecord::RecordNotUnique, with: :handle_unique_constraint_violation

  def index
    products = Product.where(group_id: @current_group_id)
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
      product.product_icon.attach(params[:product_icon]) if params[:product_icon].present?
    end

    render json: { id: product.id }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    if e.message.include?('Duplicate entry')
      handle_unique_constraint_violation(e)
    else
      render json: { errors: [e.message] }, status: :unprocessable_entity
    end
  end

  def update
    ActiveRecord::Base.transaction do
      @product.update!(product_params)
      @product.files.attach(params[:files]) if params[:files].present?
    end

    render json: { product: format_product_response(@product) }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    if e.message.include?('Duplicate entry')
      handle_unique_constraint_violation(e)
    else
      render json: { errors: [e.message] }, status: :unprocessable_entity
    end
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
    files = format_files_response(product)
    product_icon = format_product_icon_response(product)
    {
      id: product.id,
      group_name: product.group.group_name,
      product_type_id: product.product_type.id,
      product_type: product.product_type.product_type,
      customer_id: product.customer&.id,
      customer_name: product.customer&.customer_name,
      product_number: product.product_number,
      product_name: product.product_name,
      user_id: product.user&.id,
      user_first_name: product.user&.first_name,
      user_last_name: product.user&.last_name,
      progress_id: product.progress.id,
      progress_order: product.progress.order,
      progress_status: product.progress.progress_status,
      files:,
      product_icon:
    }
  end

  def format_files_response(product)
    files = []
    if product.files.attached?
      files = product.files.map do |file|
        {
          id: file.id,
          url: url_for(file),
          name: file.filename.to_s,
          type: file.content_type,
          size: file.byte_size
        }
      end
    end
    files
  end

  def format_product_icon_response(product)
    if product.product_icon.attached?
      product_icon = {
        id: product.product_icon.id,
        url: url_for(product.product_icon),
        name: product.product_icon.filename.to_s,
        type: product.product_icon.content_type,
        size: product.product_icon.byte_size
      }
    end
    product_icon
  end

  def product_params
    permitted_params = params.permit(
      :id,
      :product_type_id,
      :customer_id,
      :product_number,
      :product_name,
      :user_id,
      :progress_id,
      :files,
      :product_icon
    )
    permitted_params[:customer_id] = nil if permitted_params[:customer_id] == 'null'
    permitted_params[:user_id] = nil if permitted_params[:user_id] == 'null'
    permitted_params[:group_id] = @current_group_id
    permitted_params
  end

  # エラー処理

  # show, update, destroy で該当製品が見つからない
  def product_not_found
    render json: { errors: ['製品が見つかりませんでした'] }, status: :not_found
  end

  # ユニークキー制約違反 (データベースレベル)
  def handle_unique_constraint_violation(exception)
    error_message = if exception.message.include?('index_products_on_group_id_and_product_number')
                      '同じ品番がすでに存在しています'
                    elsif exception.message.include?('index_products_on_group_id_and_product_name')
                      '同じ品名がすでに存在しています'
                    else
                      'データが重複しています'
                    end

    render json: { errors: [error_message] }, status: :unprocessable_entity
  end
end
