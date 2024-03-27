class CreateKeywordConditions < ActiveRecord::Migration[7.1]
  def change
    create_table :keyword_conditions do |t|
      t.references :group, null: false, foreign_key: true
      t.references :search_keyword, null: false, foreign_key: true
      t.string :target_column, null: false
      t.string :target_value, null: false

      t.timestamps
    end
  end
end