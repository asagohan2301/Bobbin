class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.references :group, null: false, foreign_key: true
      t.references :product_type, null: false, foreign_key: true
      t.references :customer, null: true, foreign_key: true
      t.string :product_number, null: false
      t.string :product_name, null: false
      t.references :user, null: true, foreign_key: true
      t.references :progress, null: true, foreign_key: true
      t.string :document_path

      t.timestamps
    end
    add_index :products, [:product_number, :document_path], unique: true
  end
end