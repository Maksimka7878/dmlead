// Единый источник правды по домену и базовым SEO-константам.
// Раньше домен был захардкожен в 4 файлах в двух разных вариантах
// (dmitryleads.ru в canonical/schema против dmleads.ru в robots/sitemap),
// из-за чего поисковики получали противоречивый сигнал.

export const SITE_URL = 'https://dmleads.ru';
export const SITE_NAME = 'DmitryLeads';
export const TELEGRAM = 'https://t.me/DMitryLeads';

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Абсолютный URL из внутреннего пути: url('/blog/foo') -> https://dmleads.ru/blog/foo */
export const url = (path = '/'): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/+$/, path === '/' ? '/' : '');
