class RemoveUniqueConstraintFromUsersGroupAndUserName < ActiveRecord::Migration[7.1]
  def change
    remove_index :users, name: 'index_users_on_group_id_and_user_name'
  end
end
