class AddUniqueConstraintToProductTypeProductType < ActiveRecord::Migration[6.0]
  def change
    add_index :product_types, [:product_type], unique: true
  end
end