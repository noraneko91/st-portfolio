// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { defaultLocale, locales } from './src/i18n/config.ts';

// https://astro.build/config
export default defineConfig({
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
  vite: {
    plugins: [tailwindcss()]
  }
});
