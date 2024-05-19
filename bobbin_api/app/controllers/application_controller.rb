class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    secret = ENV.fetch('JWT_SECRET_KEY')
    token = request.headers['Authorization'].split.last

    if token.blank?
      render json: { errors: ['トークンが見つかりません'] }, status: :unauthorized
      return
    end

    begin
      decoded_token = JWT.decode token, secret, true, { algorithm: 'HS256' }
      payload = decoded_token[0]

      @current_group_id = payload['group_id']
      @current_user_id = payload['user_id']
      @current_user_is_admin = payload['is_admin']

      # 存在を確認
      @current_group = Group.find(@current_group_id)
      @current_user = User.find(@current_user_id)
    rescue JWT::DecodeError
      render json: { errors: ['トークンが正しくありません'] }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { errors: ['組織またはユーザーが見つかりません'] }, status: :unauthorized
    end
  end
end
