class ProductsController < ApplicationController
  def create
    render json: { test: 'test' }
  end
end
