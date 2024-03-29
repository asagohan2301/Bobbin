class ReviseUniqueConstraint < ActiveRecord::Migration[7.1]
  def change
    remove_index :customers, name: 'index_customers_on_customer_name'
    add_index :customers, [:group_id, :customer_name], unique: true

    remove_index :product_types, name: 'index_product_types_on_product_type'
    add_index :product_types, [:group_id, :product_type], unique: true

    remove_index :products, name: 'index_products_on_product_number_and_document_path'
    add_index :products, :document_path, unique: true
    add_index :products, [:group_id, :product_number], unique: true
    add_index :products, [:group_id, :product_name], unique: true

    remove_index :progresses, name: 'index_progresses_on_progress_status'
    add_index :progresses, [:group_id, :progress_status], unique: true
  end
end
