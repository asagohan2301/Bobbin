# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_03_29_065334) do
  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "customers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.string "customer_name", null: false
    t.boolean "is_active", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id", "customer_name"], name: "index_customers_on_group_id_and_customer_name", unique: true
    t.index ["group_id"], name: "index_customers_on_group_id"
  end

  create_table "groups", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "group_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_name"], name: "index_groups_on_group_name", unique: true
  end

  create_table "keyword_conditions", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "search_keyword_id", null: false
    t.string "target_column", null: false
    t.string "target_value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_keyword_conditions_on_group_id"
    t.index ["search_keyword_id"], name: "index_keyword_conditions_on_search_keyword_id"
  end

  create_table "product_types", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.string "product_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id", "product_type"], name: "index_product_types_on_group_id_and_product_type", unique: true
    t.index ["group_id"], name: "index_product_types_on_group_id"
  end

  create_table "products", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "product_type_id", null: false
    t.bigint "customer_id"
    t.string "product_number", null: false
    t.string "product_name", null: false
    t.bigint "user_id"
    t.bigint "progress_id"
    t.string "document_path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_products_on_customer_id"
    t.index ["document_path"], name: "index_products_on_document_path", unique: true
    t.index ["group_id", "product_name"], name: "index_products_on_group_id_and_product_name", unique: true
    t.index ["group_id", "product_number"], name: "index_products_on_group_id_and_product_number", unique: true
    t.index ["group_id"], name: "index_products_on_group_id"
    t.index ["product_type_id"], name: "index_products_on_product_type_id"
    t.index ["progress_id"], name: "index_products_on_progress_id"
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "progresses", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.string "progress_status", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id", "progress_status"], name: "index_progresses_on_group_id_and_progress_status", unique: true
    t.index ["group_id"], name: "index_progresses_on_group_id"
  end

  create_table "search_keywords", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "user_id", null: false
    t.string "keyword", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_search_keywords_on_group_id"
    t.index ["user_id"], name: "index_search_keywords_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.string "user_name", null: false
    t.string "mail", null: false
    t.boolean "is_admin", null: false
    t.boolean "is_active", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id", "user_name"], name: "index_users_on_group_id_and_user_name", unique: true
    t.index ["group_id"], name: "index_users_on_group_id"
    t.index ["mail"], name: "index_users_on_mail", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "customers", "groups"
  add_foreign_key "keyword_conditions", "groups"
  add_foreign_key "keyword_conditions", "search_keywords"
  add_foreign_key "product_types", "groups"
  add_foreign_key "products", "customers"
  add_foreign_key "products", "groups"
  add_foreign_key "products", "product_types"
  add_foreign_key "products", "progresses"
  add_foreign_key "products", "users"
  add_foreign_key "progresses", "groups"
  add_foreign_key "search_keywords", "groups"
  add_foreign_key "search_keywords", "users"
  add_foreign_key "users", "groups"
end
