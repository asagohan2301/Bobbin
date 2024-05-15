class UsersController < ApplicationController
  def index
    users = User.where(group_id: @current_group_id)
    formatted_users = users.map do |user|
      {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name
      }
    end
    render json: { users: formatted_users }, status: :ok
  end

  def create
    user = User.new(user_params)

    ActiveRecord::Base.transaction do
      user.save!
    end

    render json: { id: user.id }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  private

  def user_params
    params.require(:user).permit(
      :group_id,
      :first_name,
      :last_name,
      :mail,
      :is_admin,
      :is_active,
      :password,
      :password_confirmation
    )
  end
end
