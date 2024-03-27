class KeywordCondition < ApplicationRecord
  belongs_to :group
  belongs_to :search_keyword
end
