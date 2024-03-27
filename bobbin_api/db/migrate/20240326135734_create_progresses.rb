class CreateProgresses < ActiveRecord::Migration[7.1]
  def change
    create_table :progresses do |t|
      t.references :group, null: false, foreign_key: true
      t.string :progress_status, null: false

      t.timestamps
    end
    add_index :progresses, [:progress_status], unique: true
  end
end
