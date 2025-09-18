## クローンした後にすること
```bash
npm install
```
.env.local をプロジェクト直下に作成し、APIキーを記載する
```bash
npm run dev
```
Reactでアイコンを利用する
```bash
npm install react-icons
```
[http://localhost:3000](http://localhost:3000) に接続

## 開発フロー（重要）

### ブランチの作成と切り替え

**重要：直接 `main` ブランチで作業しないでください！**

#### 作業開始前に必ずブランチを作成

```bash
# 最新のmainブランチに移動
git checkout main

# 最新の変更を取得
git pull origin main

# 新しいブランチを作成して切り替え
git checkout -b Name/Type/Title
# 例: git checkout -b sugatani/feat/add-home-page
```

#### ブランチ名の命名規則

```
Name/Type/Title

ex) sugatani/feat/add-home-page
```
* Type
  * feat
    * 機能の追加や変更
  * refactor
    * リファクタリング
  * fix
    * 不具合の修正
  * test
    * テストコードの追加や修正
  * other
    * その他、上記に当てはまらないもの
* Title
  * 基本はPRやIssueのタイトルを英訳して、簡潔にしたもの
  * 区切り文字は”-”を使用する
  * 長くても20文字以内
    
### 作業の進め方

#### 1. コードを書く

#### 2. 変更をステージング

```bash
# 特定のファイルを追加
git add ファイル名

# すべての変更を追加（慎重に！）
git add .
```

#### 3. コミット

```bash
git commit -m "わかりやすいコミットメッセージ"
# 例: git commit -m "ログイン画面のHTMLを作成"
```

#### 4. プッシュ

```bash
git push origin ブランチ名
```
