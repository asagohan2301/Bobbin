class AddNotNullAndUniqueConstraintToProgressOrder < ActiveRecord::Migration[7.1]
  def change
    add_index :progresses, :order, unique: true
    change_column_null :progresses, :order, false
  end
end
