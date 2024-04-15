Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    cors_origins = ENV.fetch("CORS_ALLOWED_ORIGINS", "localhost:3000").split(',')
    origins cors_origins

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete],
      credentials: false
  end
end
