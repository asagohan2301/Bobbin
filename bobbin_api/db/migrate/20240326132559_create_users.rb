class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.references :group, null: false, foreign_key: true
      t.string :user_name, null: false
      t.string :mail, null: false
      t.boolean :is_admin, null: false
      t.boolean :is_active, null: false

      t.timestamps
    end
    add_index :users, [:user_name, :mail], unique: true
  end
end
