[English](./README.md) | [简体中文](./README_cn.md) | [日本語](./README_jp.md)

# Flux Grid Arena

GitHub で公開しやすいブラウザゲームのサンプルです。HTML、CSS、JavaScript だけで構成されており、GitHub Pages にそのまま配備でき、ローカルランキングも備えています。

## 特徴

- 完全静的構成: バックエンドやビルド工程が不要です。
- 遊べる内容: 45 秒の反射神経チャレンジで、通常タイル、ボーナスタイル、トラップタイルがあります。
- ランキング対応: ブラウザの `localStorage` にローカル上位 10 件を保存します。
- GitHub 向け構成: `README`、`LICENSE`、`.gitignore`、GitHub Pages ワークフローを含みます。

## ディレクトリ構成

```text
.
├─ .github/
│  └─ workflows/
│     └─ pages.yml
├─ assets/
│  └─ preview.svg
├─ src/
│  ├─ main.js
│  └─ styles.css
├─ .gitignore
├─ .nojekyll
├─ index.html
├─ LICENSE
├─ README.md
├─ README_cn.md
└─ README_jp.md
```

## ローカル実行

`index.html` をブラウザで直接開けば動作します。

ローカルの静的サーバーで実行したい場合:

```bash
npx serve .
```

## GitHub への公開

1. `flux-grid-arena` などの GitHub リポジトリを作成します。
2. このフォルダーの内容をリポジトリのルートへ push します。
3. リポジトリの `Settings > Pages` を開きます。
4. デプロイ元を `GitHub Actions` に設定します。
5. `main` に push するとワークフローが自動で公開を行います。

## ランキングについて

- 現在のランキングはローカル専用で、使用中のブラウザに保存されます。
- データベースやサーバー API が不要なので GitHub Pages と相性が良いです。
- 将来的にグローバルランキングを追加するなら、Supabase、Firebase、Cloudflare D1 などが候補です。

## 継続的な更新に向いている理由

- 単発のスクリプトではなく、完成形として見せられるプロジェクトです。
- ゲームバランス、UI、音、モバイル対応、オンライン要素などで自然にコミットを積み重ねられます。
- GitHub Pages でそのまま公開できるため、リポジトリの見栄えが良くなります。

## 次の改善案

- オンラインランキング
- 効果音と BGM
- デイリーチャレンジ
- モバイルの触覚フィードバック
- 追加テーマ

## ライセンス

MIT
