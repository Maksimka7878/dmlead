import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, loadRegistry } from './loadContent.mjs';

const SITE_URL = 'https://dmleads.ru';
const DIST = path.join(ROOT, 'dist');

const escapeJson = (value) =>
  JSON.stringify(value)
    // Защита от разрыва тега <script> данными и от строчных разделителей,
    // которые ломают парсер в старых движках.
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

const outFileFor = (route) => (route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, ''), 'index.html'));

const main = async () => {
  const reg = await loadRegistry();
  const { render } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href);

  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const pages = reg.allPages();
  const byPath = new Map(pages.map((p) => [p.kind === 'article' ? `/blog/${p.slug}` : `/lidy/${p.slug}`, p]));
  const fullIndex = reg.fullIndex();

  // Страницы-списки блога: /blog, /blog/page/N, /blog/kategoriya/... —
  // каждая рендерится отдельно и несёт только свои карточки.
  const cats = reg.categories();
  const listings = reg.buildListings().map((l) => ({ ...l, categories: cats }));
  const listingByPath = new Map(listings.map((l) => [l.path, l]));

  const routes = ['/', '/lidy', ...listings.map((l) => l.path), ...byPath.keys()];
  let written = 0;

  for (const route of routes) {
    const page = byPath.get(route) ?? null;
    const listing = listingByPath.get(route) ?? null;
    // Каталог услуг — единственная страница, которой нужен полный индекс.
    // Каталогу нужен весь список посадочных, но не их описания —
    // в разметке они не используются, а вес страницы утраивают.
    const index = page
      ? reg.relatedIndex(page, 8)
      : route === '/lidy'
        ? fullIndex.filter((e) => e.kind === 'landing').map((e) => ({ kind: e.kind, slug: e.slug, path: e.path, h1: e.h1, group: e.group, isoDate: e.isoDate, description: '' }))
        : [];

    const { html, head } = render(route, page, index, listing);

    const boot = `<script>window.__PAGE_DATA__=${escapeJson(page)};window.__INDEX_DATA__=${escapeJson(index)};window.__LISTING__=${escapeJson(listing)};</script>`;

    // Пререндер отвечает за <title>, description и canonical — статические
    // теги из шаблона убираем, иначе на странице окажется два title.
    let out = template
      .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
      .replace(/<meta name="description"[^>]*>\s*/i, '')
      .replace(/<meta name="keywords"[^>]*>\s*/i, '')
      .replace(/<link rel="canonical"[^>]*>\s*/i, '')
      .replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/gi, '')
      // OG/Twitter полностью отдаёт Helmet — статические копии из шаблона
      // убираем, иначе краулер видит по два конкурирующих тега.
      .replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '')
      .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '')
      .replace('</head>', `  ${head}\n  ${boot}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    const file = outFileFor(route);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, out);
    written++;
  }

  // ── sitemap ────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const urlEntry = (loc, lastmod, priority, changefreq) =>
    `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const entries = [
    urlEntry('/', today, '1.0', 'weekly'),
    urlEntry('/lidy', today, '0.9', 'weekly'),
    ...listings.map((l) => urlEntry(l.path, today, l.path === '/blog' ? '0.8' : '0.5', 'weekly')),
    ...pages.map((p) => {
      const loc = p.kind === 'article' ? `/blog/${p.slug}` : `/lidy/${p.slug}`;
      const priority = p.kind === 'landing' ? '0.8' : '0.6';
      return urlEntry(loc, p.updatedIso ?? p.isoDate, priority, p.kind === 'landing' ? 'weekly' : 'monthly');
    }),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap);
  await writeFile(path.join(ROOT, 'public/sitemap.xml'), sitemap);

  console.log(`prerender: ${written} HTML-страниц, sitemap: ${entries.length} URL`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
