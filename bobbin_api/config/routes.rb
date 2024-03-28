Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  scope '/api' do
    resources :products
    resources :product_types, path: 'product-types'
    resources :customers
    resources :users
    resources :progresses
  end
end
