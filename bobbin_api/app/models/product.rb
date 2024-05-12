class Product < ApplicationRecord
  belongs_to :group
  belongs_to :product_type
  belongs_to :customer, optional: true
  belongs_to :user, optional: true
  belongs_to :progress
  has_many_attached :files
  has_one_attached :product_icon
end
