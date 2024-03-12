# 設計

## 1. 業務フロー

### 1-1. 利用開始までのフロー

![alt text](/documents/images/business_flow_1.png)

### 1-2. 製品管理フロー

![alt text](/documents/images/business_flow_2.png)

## 2. 画面遷移図

### 2-1. 認証機能に関するページ

![alt text](/documents/images/screen_transition_1.png)

### 2-2. 製品管理機能に関するページ

![alt text](/documents/images/screen_transition_2.png)

## 3. ワイヤーフレーム

**実装の優先度について**

- 必須機能 (優先度 A)：プロダクトに必須の機能。
- 追加機能 (優先度 B)：追加機能。必須機能実装後に追加していく。
- 追加予定機能 (優先度 C)：今回の開発期間での実装予定無し。今後追加予定の機能。

![alt text](/documents/images/wireframe_1.png)
![alt text](/documents/images/wireframe_2.png)
![alt text](/documents/images/wireframe_3.png)
![alt text](/documents/images/wireframe_4.png)
![alt text](/documents/images/wireframe_5.png)
![alt text](/documents/images/wireframe_6.png)
![alt text](/documents/images/wireframe_7.png)
![alt text](/documents/images/wireframe_8.png)
![alt text](/documents/images/wireframe_9.png)
![alt text](/documents/images/wireframe_10.png)
![alt text](/documents/images/wireframe_11.png)
![alt text](/documents/images/wireframe_12.png)
![alt text](/documents/images/wireframe_13.png)
![alt text](/documents/images/wireframe_14.png)
![alt text](/documents/images/wireframe_15.png)
![alt text](/documents/images/wireframe_16.png)
![alt text](/documents/images/wireframe_17.png)

## 4. テーブル定義書

### groups

| カラム名   | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要   |
| ---------- | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | ------ |
| id         | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー |
| group_name | string   |      | 〇       |        |                | maximum: 50    |       | 組織名 |

### users

| カラム名  | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション         | INDEX | 概要                   |
| --------- | -------- | ---- | -------- | ------ | -------------- | ---------------------- | ----- | ---------------------- |
| id        | integer  | PK   | 〇       |        | 〇             |                        | 〇    | 主キー                 |
| group_id  | integer  | FK   | 〇       |        |                |                        |       | 組織 ID                |
| user_name | string   |      | 〇       |        |                | maximum: 50            |       | ユーザー名             |
| mail      | string   |      | 〇       |        |                | メールアドレスの書式   |       | メールアドレス         |
| password  | string   |      | 〇       |        |                | minimum: 8 maximum: 20 |       | パスワード(ハッシュ値) |
| is_admin  | boolean  |      | 〇       |        |                |                        |       | 組織の管理者か         |
| is_active | boolean  |      | 〇       |        |                |                        |       | 現役のユーザーか       |

### products

| カラム名        | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要                           |
| --------------- | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | ------------------------------ |
| id              | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー                         |
| group_id        | integer  | FK   | 〇       |        |                |                |       | 組織 ID                        |
| product_type_id | integer  | FK   | 〇       |        |                |                |       | 種別 ID (種別はプロパーか OEM) |
| customer_id     | integer  | FK   |          |        |                |                |       | 顧客 ID                        |
| product_number  | string   |      | 〇       |        |                | maximum: 20    | 〇    | 品番                           |
| product_name    | string   |      | 〇       |        |                | maximum: 20    |       | 品名                           |
| user_id         | integer  | FK   |          |        |                |                |       | ユーザー ID(製品担当者)        |
| progress_id     | integer  | FK   |          |        |                |                |       | 進捗 ID                        |
| document_path   | string   |      |          |        |                |                |       | ルートフォルダのパス           |

### product_types

| カラム名     | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要                          |
| ------------ | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | ----------------------------- |
| id           | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー                        |
| group_id     | integer  | FK   | 〇       |        |                |                |       | 組織 ID                       |
| product_type | string   |      | 〇       |        |                | maximum: 20    |       | 種別名 (種別はプロパーか OEM) |

### customers

| カラム名      | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要         |
| ------------- | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | ------------ |
| id            | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー       |
| group_id      | integer  | FK   | 〇       |        |                |                |       | 組織 ID      |
| customer_name | string   |      | 〇       |        |                | maximum: 50    |       | 顧客名       |
| is_active     | boolean  |      | 〇       |        |                |                |       | 現役の顧客か |

### progresses

| カラム名        | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要     |
| --------------- | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | -------- |
| id              | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー   |
| group_id        | integer  | FK   | 〇       |        |                |                |       | 組織 ID  |
| progress_status | string   |      | 〇       |        |                | maximum: 20    |       | 進捗状況 |

### search_keywords

| カラム名 | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要                          |
| -------- | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | ----------------------------- |
| id       | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー                        |
| group_id | integer  | FK   | 〇       |        |                |                |       | 組織 ID                       |
| user_id  | integer  | FK   | 〇       |        |                |                |       | ユーザー ID(キーワード登録者) |
| keyword  | string   |      | 〇       |        |                | maximum: 50    |       | 検索キーワード                |

### keyword_conditions

| カラム名      | データ型 | キー | NOT NULL | 初期値 | AUTO INCREMENT | バリデーション | INDEX | 概要              |
| ------------- | -------- | ---- | -------- | ------ | -------------- | -------------- | ----- | ----------------- |
| id            | integer  | PK   | 〇       |        | 〇             |                | 〇    | 主キー            |
| group_id      | integer  | FK   | 〇       |        |                |                |       | 組織 ID           |
| keyword_id    | integer  | FK   | 〇       |        |                |                |       | 検索キーワード ID |
| target_column | string   |      | 〇       |        |                |                |       | 対象カラム名      |
| target_value  | string   |      | 〇       |        |                |                |       | 対象データ名      |

### ER 図

![alt text](/documents/images/entity_relationship.png)

## 5. システム構成図

![alt text](/documents/images/system_configuration.png)

### 仕様技術

フロントエンド：Next.js / Tailwind CSS  
バックエンド：Ruby on Rails  
Web サーバ / アプリケーションサーバ：NGINX + Puma  
データベース：MySQL  
開発環境：Docker Compose  
インフラ：AWS  
ソース管理：Git / GitHub
