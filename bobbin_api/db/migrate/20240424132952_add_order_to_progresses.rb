class AddOrderToProgresses < ActiveRecord::Migration[7.1]
  def change
    add_column :progresses, :order, :integer
  end
end