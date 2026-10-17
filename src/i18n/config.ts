// 言語の一覧はここだけで管理し、astro.config からも参照する / 언어 목록은 여기서만 관리하고 astro.config에서도 참조한다
export const locales = ['ja', 'en', 'zh', 'ko'] as const;
export type Lang = (typeof locales)[number];

export const defaultLocale: Lang = 'ja';

// URL は /zh/ だが、html lang と hreflang では簡体字であることを明示する / URL은 /zh/지만 html lang과 hreflang에서는 간체임을 명시한다
export const htmlLang: Record<Lang, string> = {
  ja: 'ja',
  en: 'en',
  zh: 'zh-Hans',
  ko: 'ko',
};

// OGP の og:locale は「言語_地域」形式で指定する / OGP의 og:locale은 "언어_지역" 형식으로 지정한다
export const ogLocale: Record<Lang, string> = {
  ja: 'ja_JP',
  en: 'en_US',
  zh: 'zh_CN',
  ko: 'ko_KR',
};

// 言語名は閲覧中の言語に関係なく自国語で表示する（自分の言語を見つけやすくするため） / 언어 이름은 보고 있는 언어와 관계없이 자국어로 표시한다 (자기 언어를 찾기 쉽게)
export const languageNames: Record<Lang, string> = {
  ja: '日本語',
  en: 'English',
  zh: '简体中文',
  ko: '한국어',
};

// 言語ドロップダウンで保存し、ルート(/)のリダイレクトで読む / 언어 드롭다운에서 저장하고 루트(/) 리다이렉트에서 읽는다
export const LANG_STORAGE_KEY = 'lang';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
