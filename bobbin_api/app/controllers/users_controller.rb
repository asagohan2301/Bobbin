class UsersController < ApplicationController
  def index
    users = User.where(group_id: 1)
    formatted_users = users.map do |user|
      {
        id: user.id,
        user_name: user.user_name
      }
    end
    render json: { users: formatted_users }, status: :ok
  end
end
