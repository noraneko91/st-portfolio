import type { APIRoute } from 'astro';

// sitemap の URL を astro.config の site から組み立て、ドメイン変更時の修正箇所を1つにする / sitemap URL을 astro.config의 site로 만들어 도메인 변경 시 수정할 곳을 하나로 한다
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
