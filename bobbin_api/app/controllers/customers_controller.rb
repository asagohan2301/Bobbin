class CustomersController < ApplicationController
  def index
    customers = Customer.where(group_id: @current_group_id)
    formatted_customers = customers.map do |customer|
      {
        id: customer.id,
        customer_name: customer.customer_name
      }
    end
    render json: { customers: formatted_customers }, status: :ok
  end
end
