class RemoveUniqueConstraintFromUsersUserName < ActiveRecord::Migration[7.1]
  def change
    remove_index :users, name: 'index_users_on_user_name_and_mail'
    add_index :users, :mail, unique: true
    add_index :users, [:group_id, :user_name], unique: true
  end
end