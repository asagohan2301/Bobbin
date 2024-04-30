class CreateFilters < ActiveRecord::Migration[7.1]
  def change
    create_table :filters do |t|
      t.references :group, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :filter_name, null: false
      t.string :target_column
      t.string :target_value

      t.timestamps
    end
    add_index :filters, [:user_id, :filter_name], unique: true
  end
end