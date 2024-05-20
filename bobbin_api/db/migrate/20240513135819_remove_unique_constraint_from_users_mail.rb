class RemoveUniqueConstraintFromUsersMail < ActiveRecord::Migration[7.1]
  def change
    remove_index :users, name: 'index_users_on_mail'
    add_index :users, [:group_id, :mail], unique: true
  end
end
