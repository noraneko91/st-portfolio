# st-portfolio

経歴・スキル・個人開発を紹介する、4言語（日本語・英語・中国語〔簡体字〕・韓国語）対応のポートフォリオサイトです。

**公開URL**: https://st-portfolio.st-kim.workers.dev

<!-- TODO: デザイン調整後にスクリーンショットを追加する（PC・スマートフォン、ライト・ダーク） -->
## スクリーンショット

（デザイン調整後に追加予定）

## 特徴

- **4言語対応**: 言語ごとに独立したURL（`/ja/` `/en/` `/zh/` `/ko/`）。全ページで hreflang を出力し、sitemap の各 URL にも4言語の代替リンクを付与
- **翻訳漏れをビルドで検出**: 日本語を基準に他言語を型で縛り、キーやコンテンツの訳が1つでも欠けるとビルドが失敗する
- **データとページの分離**: 経歴・スキル・プロジェクトは YAML で管理し、ページは表示だけを担当。スキルごとに使った経歴・個人開発の件数を自動で数える
- **Home のベントーと変形遷移**: Home の 1 画面に各ページの中身をタイルで並べ、タイルを押すとページの見出しへ形が変わって移る（ページ間 View Transitions。JS 不要、非対応ブラウザは通常の移動）。背景は CSS の perspective で描いた遠近グリッド
- **ダークモード切り替え**: 普段は OS の設定に従い、ヘッダーのボタンで選ぶと保存して次回以降も保つ（描画前に適用するので読み込み時に点滅しない）
- **スキル × 経歴グラフ**: 経歴・個人開発とスキルのつながりを線で示し、選ぶと強調する（TypeScript、キーボード操作・読み上げ対応）
- **コマンドパレット**: Ctrl/⌘+K でページ移動・言語切替・GitHub を検索（React island + shadcn/ui）。React は初めて開くときだけ読み込む
- **静的サイト**: DB・サーバーなし。GitHub への push で Cloudflare Workers に自動デプロイ
- **アクセシビリティ**: キーボード操作・スクリーンリーダー対応の言語メニュー（WAI-ARIA Menu Button）、JS 無効時も言語を選べるリンク、`prefers-reduced-motion` の尊重
- **パフォーマンス**: Lighthouse（モバイル）で Performance・Accessibility・Best Practices・SEO すべて 100（2026年10月時点）

## 技術スタック

| 分類 | 技術 | バージョン |
|---|---|---|
| フレームワーク | Astro | 7.4.0 |
| 言語 | TypeScript（strict） | 6.0.3 |
| スタイル | Tailwind CSS | 4.3.3 |
| UI 部品 | React（islands）+ shadcn/ui（cmdk・Radix） | React 19.3.1 |
| ホスティング | Cloudflare Workers（Static Assets） | wrangler 4.151.1 |
| sitemap | @astrojs/sitemap | 3.7.4 |
| スキルのロゴ | Devicon（SVG を `src/assets/skills/` に複製、MIT） | 2.16.0 |
| ランタイム | Node.js | 24.16.0（`.nvmrc`） |

## 設計判断（ADR）

主な技術選定の理由と代替案は ADR として記録しています。

- [0001. 静的サイトとして構築する](docs/adr/0001-static-site.md)
- [0002. フレームワークに Astro を採用する](docs/adr/0002-astro.md)
- [0003. 多言語対応に言語別パス方式を採用する](docs/adr/0003-i18n-path-routing.md)
- [0004. Cloudflare Workers（Static Assets）でデプロイする](docs/adr/0004-cloudflare-workers.md)
- [0005. 操作の多い部品だけに React islands と shadcn/ui を使う](docs/adr/0005-react-islands-shadcn.md)
- [0006. 経歴を Projects に移し、「業務経歴」と「個人開発」のタブに分ける](docs/adr/0006-projects-work-personal.md)
- [0007. Home をベントーにし、奥行きのある背景とタイルからページへの変形遷移を入れる](docs/adr/0007-bento-depth-view-transitions.md)

## ページ構成

| ページ | URL | 内容 |
|---|---|---|
| Home | `/{lang}/` | 各ページの中身をタイルで並べた入口（ベントーグリッド） |
| About | `/{lang}/about/` | 自己紹介と、拠点・言語（ターミナル風の表示） |
| Skills | `/{lang}/skills/` | スキル（ロゴと、使った経歴・個人開発の件数）・資格・スキル × 経歴グラフ |
| Projects: 業務経歴 | `/{lang}/projects/work/` | 経歴のタイムライン |
| Projects: 個人開発 | `/{lang}/projects/personal/` | 個人開発の一覧と詳細（`/{lang}/projects/personal/<slug>/`） |
| Contact | `/{lang}/contact/` | 連絡先 |

`/{lang}/projects/` は業務経歴へリダイレクトします。

プロジェクトの目的・範囲は [docs/project-brief.md](docs/project-brief.md) を参照してください。

## ディレクトリ構成

```
src/
  content/            # コンテンツ（YAML）。言語ごとの文は同じファイルに {ja, en, zh, ko} で持つ
    profile.yaml
    skills.yaml
    certifications.yaml
    career/           # 経歴（1件 = 1ファイル）
    projects/         # 個人開発（1件 = 1ファイル、ファイル名が URL の slug）
  content.config.ts   # コンテンツのスキーマ（zod）
  assets/skills/      # スキルのロゴ（出典・ライセンスは同じフォルダの README.md）
  i18n/               # UI の文言（ja.ts が基準）と言語のヘルパー
  lib/                # コンテンツの取得・期間計算・ページ見出しのドット絵・テーマ
  components/         # ヘッダー・言語メニュー・セクションなど
    ui/               # shadcn/ui の部品（配色変数に合わせて調整）
    command/          # コマンドパレット（React island）
  layouts/            # 共通レイアウト（hreflang・OGP）
  pages/
    index.astro       # ルート: 言語を判定して /{lang}/ へ移動
    [lang]/           # 言語別のページ
  styles/global.css   # 配色（ライト・ダークの CSS 変数）・フォント・余白
docs/                 # プロジェクト概要・ADR
public/               # favicon・OGP 画像など
scripts/brand/        # favicon・OGP 画像の原本（SVG）と生成スクリプト
scripts/new-project.mjs  # 個人開発のひな形を作る（npm run new:project）
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

## favicon・OGP 画像の再生成

原本の SVG（`public/favicon.svg`、`scripts/brand/og-image.svg`）を編集したあと、ローカルの Chrome を使って PNG・ICO を生成します（追加パッケージは不要）。

```sh
npm run brand      # Chrome の場所が異なる場合は CHROME_PATH で指定
```

## コンテンツの編集

`src/content/` の YAML を編集します。言語別の文（`ja` / `en` / `zh` / `ko`）は4言語すべて必須で、1つでも欠けると `npm run build` が失敗します。

### 個人開発を追加する

```sh
npm run new:project todo-app   # src/content/projects/todo-app.yaml を draft: true で作成
```

ひな形の TODO を埋め、`tech` に `skills.yaml` の id を書いて `draft: false` にすると一覧に表示されます。`overview` を書くと詳細ページも作られます。講座に沿って作ったものは `category: learning` にし、期間が年月で表せないほど短いときは `duration`（例: 約1日）を添えます。`skills.yaml` にない id を書くと `npm run build` が失敗します。
