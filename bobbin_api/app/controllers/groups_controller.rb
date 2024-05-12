class GroupsController < ApplicationController
  def create
    group = Group.new(group_params)

    ActiveRecord::Base.transaction do
      group.save!
    end

    render json: { id: group.id }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { errors: [e.message] }, status: :unprocessable_entity
  end

  private

  def group_params
    params.permit(:group_name)
    # paramsの値がなぜか "group"=>{"group_name"=>"xxx"} のようにラップされる現象が起きている
    # 続くようなら以下にする?
    # params.require(:group).permit(:group_name)
  end
end
