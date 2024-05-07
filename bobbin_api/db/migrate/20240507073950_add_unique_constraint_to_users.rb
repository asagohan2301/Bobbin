class AddUniqueConstraintToUsers < ActiveRecord::Migration[7.1]
  def change
    add_index :users, [:group_id, :first_name, :last_name], unique: true
  end
end
