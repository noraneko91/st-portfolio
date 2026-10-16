# 0004. Cloudflare Workers（Static Assets）でデプロイする

## ステータス

承認（2026-10-16）

## 背景

- 静的サイトを Cloudflare でホスティングすることを決めた（[ADR 0001](0001-static-site.md)）
- Cloudflare には静的サイトを配信する方法として Pages と Workers（Static Assets）がある
- SSR は使わないため、ビルド結果の `dist/` をそのまま配信できればよい
- ドメインはまだ決めていない

## 決定

- Cloudflare Workers の Static Assets で配信する
  - Worker スクリプトと `@astrojs/cloudflare` アダプターは使わず、`wrangler.jsonc` で `dist/` を指定するだけにする
  - 存在しないパスは `404.html` を 404 ステータスで返す（`not_found_handling: "404-page"`）
  - トレイリングスラッシュは `auto-trailing-slash` とし、`/ja/about` は `/ja/about/` にリダイレクトする
- GitHub と連携し、`main` への push で自動デプロイする（Workers Builds）
  - ビルドコマンドは `npm run build` とし、型チェック（`astro check`）が通らない場合はデプロイしない
- ドメインが決まるまでは `*.workers.dev` のアドレスを使う

## 検討した代替案

### Cloudflare Pages

- 静的サイトの配信には十分で、404 ページの自動検出など設定が少なくて済む
- しかし Astro の公式ドキュメントでは「Cloudflare は新規プロジェクトに Workers を推奨している」と案内されており、Cloudflare も Pages から Workers への移行ガイドを用意している
- 今後の機能追加も Workers が中心になると考え、新規に始める本サイトは Workers を選んだ

### `@astrojs/cloudflare` アダプター

- アダプターはオンデマンドレンダリング（SSR）用であり、静的サイトには不要
- 依存を増やさず、設定ファイル1つで済む構成を優先した

## 結果・トレードオフ

### 利点

- 配信の設定（404・トレイリングスラッシュ）が `wrangler.jsonc` としてリポジトリに残り、レビューできる
- アダプターなしのため、Astro 側の構成は通常の静的ビルドのまま変わらない
- 型チェックに失敗した変更は本番に出ない

### トレードオフ

- Pages と違い、404 ページの扱いを明示的に設定する必要がある
- Workers で独自ドメインを使うには、そのドメインを Cloudflare で管理する必要がある（Pages は Cloudflare 外の DNS でも可）
- ダッシュボードの Worker 名と `wrangler.jsonc` の `name` が一致しないとビルドが失敗する
- `*.workers.dev` は仮のアドレスのため、ドメイン決定時に `site`（canonical・hreflang の URL）を変更し、sitemap もその時点で追加する
