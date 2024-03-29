class CreateSearchKeywords < ActiveRecord::Migration[7.1]
  def change
    create_table :search_keywords do |t|
      t.references :group, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :keyword, null: false

      t.timestamps
    end
  end
end
