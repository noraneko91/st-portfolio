# st-portfolio

経歴・スキル・個人開発を紹介する、4言語（日本語・英語・中国語〔簡体字〕・韓国語）対応のポートフォリオサイトです。

**公開URL**: https://st-portfolio.ttvt11.workers.dev

<!-- TODO: デザイン調整後にスクリーンショットを追加する（PC・スマートフォン、ライト・ダーク） -->
## スクリーンショット

（デザイン調整後に追加予定）

## 特徴

- **4言語対応**: 言語ごとに独立したURL（`/ja/` `/en/` `/zh/` `/ko/`）。全ページで hreflang と言語別の sitemap を出力
- **翻訳漏れをビルドで検出**: 日本語を基準に他言語を型で縛り、キーやコンテンツの訳が1つでも欠けるとビルドが失敗する
- **データとページの分離**: 経歴・スキル・プロジェクトは YAML で管理し、ページは表示だけを担当。スキルの経験年数は経歴の期間から自動計算
- **静的サイト**: DB・サーバーなし。GitHub への push で Cloudflare Workers に自動デプロイ
- **アクセシビリティ**: キーボード操作・スクリーンリーダー対応の言語メニュー（WAI-ARIA Menu Button）、JS 無効時も言語を選べるリンク、`prefers-reduced-motion` の尊重
- **パフォーマンス**: Lighthouse（モバイル）で Performance・Accessibility・Best Practices・SEO すべて 100（2026年10月時点）

## 技術スタック

| 分類 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Astro | 7.4.0 |
| 言語 | TypeScript（strict） | 6.0.3 |
| スタイル | Tailwind CSS | 4.3.3 |
| ホスティング | Cloudflare Workers（Static Assets） | wrangler 4.151.1 |
| sitemap | @astrojs/sitemap | 3.7.4 |
| ランタイム | Node.js | 24.16.0（`.nvmrc`） |

## 設計判断（ADR）

主な技術選定の理由と代替案は ADR として記録しています。

- [0001. 静的サイトとして構築する](docs/adr/0001-static-site.md)
- [0002. フレームワークに Astro を採用する](docs/adr/0002-astro.md)
- [0003. 多言語対応に言語別パス方式を採用する](docs/adr/0003-i18n-path-routing.md)
- [0004. Cloudflare Workers（Static Assets）でデプロイする](docs/adr/0004-cloudflare-workers.md)

プロジェクトの目的・範囲は [docs/project-brief.md](docs/project-brief.md) を参照してください。

## ディレクトリ構成

```
src/
  content/            # コンテンツ（YAML）。言語ごとの文は同じファイルに {ja, en, zh, ko} で持つ
    profile.yaml
    skills.yaml
    certifications.yaml
    career/           # 経歴（1件 = 1ファイル）
    projects/         # プロジェクト（1件 = 1ファイル、ファイル名が URL の slug）
  content.config.ts   # コンテンツのスキーマ（zod）
  i18n/               # UI の文言（ja.ts が基準）と言語のヘルパー
  lib/                # コンテンツの取得・期間計算
  components/         # ヘッダー・言語メニュー・セクションなど
  layouts/            # 共通レイアウト（hreflang・OGP）
  pages/
    index.astro       # ルート: 言語を判定して /{lang}/ へ移動
    [lang]/           # 言語別のページ
  styles/global.css   # 配色（CSS 変数）・フォント・余白
docs/                 # プロジェクト概要・ADR
public/               # favicon など
wrangler.jsonc        # Cloudflare Workers の配信設定（404・トレイリングスラッシュ）
```

## ローカルでの実行

Node.js 24.16.0（`.nvmrc`）を使います。

```sh
npm ci
npm run dev        # 開発サーバー http://localhost:4321/
npm run build      # 型チェック（astro check）+ ビルド
npm run preview    # ビルド結果の確認
```

本番（Cloudflare Workers）と同じ 404・トレイリングスラッシュの動作を確認する場合:

```sh
npm run build
npx wrangler dev
```

## コンテンツの編集

`src/content/` の YAML を編集します。言語別の文（`ja` / `en` / `zh` / `ko`）は4言語すべて必須で、1つでも欠けると `npm run build` が失敗します。
