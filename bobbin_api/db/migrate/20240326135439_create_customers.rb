class CreateCustomers < ActiveRecord::Migration[7.1]
  def change
    create_table :customers do |t|
      t.references :group, null: false, foreign_key: true
      t.string :customer_name, null: false
      t.boolean :is_active, null: false

      t.timestamps
    end
    add_index :customers, [:customer_name], unique: true
  end
end
