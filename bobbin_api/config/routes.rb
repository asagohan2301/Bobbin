Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  scope '/api' do
    resources :groups do
      resources :users
    end
    resources :products do
      resources :files, only: [:destroy] do
        member do
          get 'proxy', to: 'files#proxy'
        end
      end
    end
    resources :product_types, path: 'product-types'
    resources :customers
    resources :progresses
    resources :filters
  end
end