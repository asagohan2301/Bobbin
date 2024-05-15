class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    secret = ENV.fetch('JWT_SECRET_KEY')
    token = request.headers['Authorization'].split.last
    decoded_token = JWT.decode token, secret, true, { algorithm: 'HS256' }
    payload = decoded_token[0]

    @current_group_id = payload['group_id']
    @current_user_id = payload['user_id']
    @current_user_is_admin = payload['is_admin']
  end
end
