class AddNotNullConstraintToProductProgress < ActiveRecord::Migration[7.1]
  def change
    change_column_null :products, :progress_id, false
  end
end
