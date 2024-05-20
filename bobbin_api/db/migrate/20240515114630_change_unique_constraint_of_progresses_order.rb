class ChangeUniqueConstraintOfProgressesOrder < ActiveRecord::Migration[7.1]
  def change
    remove_index :progresses, name: 'index_progresses_on_order'
    add_index :progresses, [:group_id, :order], unique: true
  end
end
