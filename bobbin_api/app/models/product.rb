class Product < ApplicationRecord
  belongs_to :group
  belongs_to :product_type
  belongs_to :customer
  belongs_to :user
  belongs_to :progress
end
