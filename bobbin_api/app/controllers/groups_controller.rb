class GroupsController < ApplicationController
  def create
    ActiveRecord::Base.transaction do
      group = Group.create!(group_params)
      user = User.create!(user_params.merge(group_id: group.id))
      render json: { group:, user: }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  private

  def group_params
    params.require(:group).permit(:group_name)
  end

  def user_params
    params.require(:user).permit(
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
