class Product < ApplicationRecord
  belongs_to :group
  belongs_to :product_type
  belongs_to :customer, optional: true
  belongs_to :user
  belongs_to :progress
  has_many_attached :files
end
