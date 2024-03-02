# テーマ及び要件定義

## 1. コンセプト

### 一言サービスコンセプト（サービスのキャッチコピーを一言で）

アパレル製品の管理をシンプル＆スムーズに

### コンセプト説明（エレベーターピッチ手法で）

「アパレル製品の管理を効率的に」したい  
「主として小～中規模のアパレル企画担当者」向けの  
「Bobbin」という  
「製品管理アプリ」です。

これは「進捗管理から仕様書作成、製品管理への流れをスムーズに」でき、  
「XIFORM」とは違って、  
「企画初期段階の進捗管理からサポートする」ことができます。

## 2. 誰のどんな課題を解決するのか？

### 誰の？

1. 個人で服飾雑貨のブランドを運営している知人 A さん
2. アパレル企画会社 S 社の企画デザイン部 (企画担当者 5 名前後)

### どんな課題？

#### 1. 進捗管理がうまくできていない

A さんの場合：

- 複数のアイテムを同時進行しているが、進捗管理は頭の中でしているため見落としてしまうことがある。

S 社の場合：

- 複数人の企画担当者がそれぞれ複数のアイテムを担当しており、進捗管理はまとめてマネージャーがエクセルで行っているが、入力や管理が面倒。
- 各担当者は進捗状況をマネージャーに定期的に報告することになっているが、忙しいときなど後回しになってしまう。

#### 2. 仕様書の作成や管理が面倒

S 社の場合：

- 仕様書の表のフォーマットはアイテムによって調整が必要だが、illustrator では表の調整がやりにくい。
- 繰り返し使う絵型が共有されておらず、過去の仕様書から探してきてコピペして使っている。
- 発注書のフォーマットが更新されたときの共有が徹底されておらず、更新されたことを忘れて昔のフォーマットを使ってしまうことがある。

#### 3. 製品の情報管理がうまくできていない

A さんの場合：

- 製品管理のシステムは導入しておらず、後から情報を見たいときは仕様書を探さないといけないので大変。

S 社の場合：

- 製品情報はシステムに登録しているが、仕様書と連動しておらず登録作業が二度手間になっている。
- 仕様書は共有フォルダ内に品番で分けて保管しているが、後から製品名や仕様で探すのが大変。

## 3. なぜそれを解決したいのか？

仕様書作成や製品管理などの面倒な作業を効率化することで、製品企画・デザイン・市場調査といった仕事に集中できるようにするため。

## 4. どうやって解決するのか？

- 進捗管理表はエクセルではなく、入力や管理がしやすい専用の画面で行えるようにする。  
  進捗管理表は複数人で共有でき、各アイテムの担当者が進捗状況を随時入力することで報告漏れを防ぐ。
- 仕様書は、進捗管理表の情報からベースを自動生成する。  
  マスタからの絵型取得など、仕様書の作成をサポートする機能を実装する。
- 仕様書に入力した各項目をそのまま製品管理システムに登録することで、入力の二度手間をなくす。
- 各製品の情報は、品番・お客様名・型などから検索できるようにして探す手間をなくす。
- 進捗管理表、仕様書、製品管理の情報はすべてを連携させ、二重入力などによる情報の矛盾を防ぐ。

## 5. 機能要件

最終的な展望としては、このアプリ一つで企画から進捗管理、製品情報の登録、サンプル発注、製品発注、検品項目生成、納品、在庫管理等すべて一元管理してあらゆる重複作業をなくしたい。  
今回の実装期間では、コア機能として進捗管理と製品情報管理のみ実装予定。

### 基本機能

- 使用者登録
- ログイン
- マスタ登録

### デザインソース管理機能

※今回の期間での実装予定無し

- 参考画像等の管理
- デザインラフの管理

### 進捗管理表機能

- アイテム一覧の進捗状況を表示
- 新規アイテムの登録
- 各アイテムの進捗の入力、編集、削除
- マスタからの情報取得

### 仕様書作成機能

※今回の期間での実装予定無し

- 進捗管理表の情報から仕様書のベースを自動生成
- 仕様書フォーマットの登録、編集、削除
- マスタからの情報取得

### 製品管理機能

- 進捗管理表または仕様書から製品情報を自動登録
- 編集、削除
- 品番や仕様等から各製品を検索

## 6. 非機能要件

- GitHub へプッシュ時に静的解析で自動チェックする
- GitHub の main ブランチにマージしたら自動デプロイされる

## 7. 既存のサービスとの差別化

### XIFORM

XIFORM は情報の管理・共有・活用を行うアパレル向けデータ管理システムで、充実した入力補助機能や作図機能がある。以下の点で差別化をしたい。

#### 進捗管理と仕様書を連携

- 主な差別化として、仕様書作成より前の企画段階からサポートできるようにしたい。  
  仕様書の作成に入るまでには、全体の企画、各アイテムの試作デザインなどの工程があるので、各アイテムの進捗管理から製品管理が始められるようにする。

#### 機能をシンプルに

- XIFORM には作図機能があるが、独自のこういったツールを習得するまでには時間がかかる。そこで作図機能は付けず、デザインは illustrator に任せてうまく連携することを重視する。
- 機能が多いと使いこなせなそうで導入を戸惑ってしまう。必要な機能が揃っているが多機能すぎず、操作がシンプルで分かりやすいものにする。

#### 個人でも気軽に試しやすい

- 既存サービスは大手向けな印象を受ける。費用が分かりにくく機能も試せないため、ハードルが高くなかなか導入に踏み切れない。  
  「Bobbin」はサイトに分かりやすく機能の説明が載っており、その場で機能を試すこともできて導入しやすいようにしたい。