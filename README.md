This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
