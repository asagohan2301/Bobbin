class CreateProductTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :product_types do |t|
      t.references :group, null: false, foreign_key: true
      t.string :product_type, null: false

      t.timestamps
    end
  end
end
