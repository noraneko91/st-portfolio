// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, htmlLang, locales } from './src/i18n/config.ts';

// canonical・hreflang を絶対 URL にするため。独自ドメイン決定時に変更する (ADR 0004) / canonical·hreflang을 절대 URL로 만들기 위해. 커스텀 도메인 결정 시 변경 (ADR 0004)
const site = 'https://st-portfolio.st-kim.workers.dev';

// https://astro.build/config
export default defineConfig({
  site,
  // 構造変更 (ADR 0006) で移動したページ。/projects/ は既定のタブ (業務経歴) へ / 구조 변경 (ADR 0006)으로 옮긴 페이지. /projects/는 기본 탭 (업무 경력)으로
  redirects: Object.fromEntries(
    locales.flatMap((lang) => [
      [`/${lang}/projects`, `/${lang}/projects/work/`],
      [`/${lang}/projects/st-portfolio`, `/${lang}/projects/personal/st-portfolio/`],
    ]),
  ),
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      // ja も /ja/ にして全言語を同じ規則にそろえる (ADR 0003) / ja도 /ja/로 해서 모든 언어를 같은 규칙으로 맞춘다 (ADR 0003)
      prefixDefaultLocale: true,
      // ルート(/)は自前の index.astro で言語判定する / 루트(/)는 직접 만든 index.astro에서 언어를 판정한다
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // 各 URL に4言語の hreflang 代替リンクを付ける / 각 URL에 4개 언어 hreflang 대체 링크를 붙인다
      i18n: { defaultLocale, locales: htmlLang },
      // ルート(/)は振り分け専用で noindex のため除外する / 루트(/)는 분기 전용이고 noindex라 제외한다
      filter: (page) => page !== `${site}/`,
    }),
    // React はコマンドパレットなど操作が多い部品だけに使う (ADR 0005) / React는 커맨드 팔레트 등 조작이 많은 부품에만 쓴다 (ADR 0005)
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
