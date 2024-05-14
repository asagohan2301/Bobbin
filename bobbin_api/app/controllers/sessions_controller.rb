class SessionsController < ApplicationController
  wrap_parameters false

  def create
    user = User.includes(:group).find_by(mail: params[:mail])

    if user&.authenticate(params[:password])
      payload = { group_id: user.group_id, user_id: user.id, is_admin: user.is_admin }
      secret = ENV.fetch('JWT_SECRET_KEY')
      token = JWT.encode payload, secret, 'HS256'

      render json: { user: format_login_user_response(user, token) }, status: :ok
    else
      render json: { errors: ['メールアドレスまたはパスワードが正しくありません'] }, status: :unauthorized
    end
  end

  private

  def format_login_user_response(user, token)
    {
      group_id: user.group_id,
      user_id: user.id,
      group_name: user.group.group_name,
      first_name: user.first_name,
      last_name: user.last_name,
      token:
    }
  end
end
