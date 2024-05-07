class UsersController < ApplicationController
  def index
    users = User.where(group_id: 1)
    formatted_users = users.map do |user|
      {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name
      }
    end
    render json: { users: formatted_users }, status: :ok
  end
end
