import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import { isLang, locales, type Lang } from './config';
import { en } from './en';
import { ja, type TranslationKey } from './ja';
import { ko } from './ko';
import { zh } from './zh';

const translations = { ja, en, zh, ko } satisfies Record<Lang, unknown>;

export function useTranslations(lang: Lang) {
  return (key: TranslationKey): string => translations[lang][key];
}

// [lang] ページ共通の getStaticPaths / [lang] 페이지 공통 getStaticPaths
export function getLangStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

// params は string 型なので、ここで Lang に絞り込む / params는 string 타입이라 여기서 Lang으로 좁힌다
export function toLang(value: string | undefined): Lang {
  if (!isLang(value)) {
    throw new Error(`Unsupported language: ${value}`);
  }
  return value;
}

// "/en/about/" → "about/"。言語に依存しないページのパスを取り出す / "/en/about/" → "about/". 언어와 무관한 페이지 경로를 꺼낸다
export function stripLang(pathname: string): string {
  const [first, ...rest] = pathname.replace(/^\/+/, '').split('/');
  return isLang(first) ? rest.join('/') : pathname.replace(/^\/+/, '');
}

// 同じページの別言語のパス。URL の組み立ては Astro の i18n 設定に任せる / 같은 페이지의 다른 언어 경로. URL 조립은 Astro i18n 설정에 맡긴다
export function getAlternatePath(lang: Lang, pathname: string): string {
  return getRelativeLocaleUrl(lang, stripLang(pathname));
}

// site 未設定の間は相対パスになり、設定すると絶対 URL になる / site 미설정 동안은 상대 경로, 설정하면 절대 URL이 된다
export function getAlternateUrl(lang: Lang, pathname: string): string {
  return getAbsoluteLocaleUrl(lang, stripLang(pathname));
}
