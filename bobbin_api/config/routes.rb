Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  scope '/api' do
    resources :products do
      resources :files, only: [] do
        member do
          get 'proxy', to: 'files#proxy'
        end
      end
    end
    resources :product_types, path: 'product-types'
    resources :customers
    resources :users
    resources :progresses
    resources :filters
  end
end