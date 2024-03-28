class CustomersController < ApplicationController
  def index
    customers = Customer.where(group_id: 1)
    formatted_customers = customers.map do |customer|
      {
        id: customer.id,
        customer_name: customer.customer_name
      }
    end
    render json: { customers: formatted_customers }
  end
end
