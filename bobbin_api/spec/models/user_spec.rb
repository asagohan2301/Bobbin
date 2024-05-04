require 'rails_helper'

RSpec.describe User, type: :model do
  it 'is valid user' do
    group = Group.create!(group_name: 'Example Group')
    user = User.new(group_id: group.id, user_name: 'Example User', mail: 'example@mail', is_admin: true, is_active: true)
    expect(user).to be_valid
  end
end
