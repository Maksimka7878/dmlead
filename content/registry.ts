import { ContentPage, Landing, Article, pagePath } from './types';
import { buildLandings } from './landings';
import { buildHubLandings } from './landings-hub';
import { buildArticles } from './articles';

let cache: ContentPage[] | null = null;

export const allPages = (): ContentPage[] => {
  if (cache) return cache;
  const pages: ContentPage[] = [...buildHubLandings(), ...buildLandings(), ...buildArticles()];

  // Защита от коллизий слагов: две страницы с одним URL — это потерянный
  // трафик и дубль в индексе, поэтому падаем на сборке, а не в проде.
  const seen = new Map<string, ContentPage>();
  for (const p of pages) {
    const path = pagePath(p);
    const prev = seen.get(path);
    if (prev) throw new Error(`Дубль URL ${path}: «${prev.h1}» и «${p.h1}»`);
    seen.set(path, p);
  }

  // Часть related указывает на страницы, которых нет в текущем наборе
  // (например, сегмент по городу, для которого посадочная не заводилась).
  // Чистим здесь, чтобы в JSON не уезжали мёртвые ссылки.
  const slugs = new Set(pages.map((p) => p.slug));
  for (const p of pages) {
    if (p.related) p.related = p.related.filter((r) => slugs.has(r) && r !== p.slug);
  }

  cache = pages;
  return pages;
};

export const allLandings = (): Landing[] => allPages().filter((p): p is Landing => p.kind === 'landing');
export const allArticles = (): Article[] => allPages().filter((p): p is Article => p.kind === 'article');

export const landingBySlug = (slug: string): Landing | undefined => allLandings().find((l) => l.slug === slug);
export const articleBySlug = (slug: string): Article | undefined => allArticles().find((a) => a.slug === slug);
export const pageBySlug = (slug: string): ContentPage | undefined => allPages().find((p) => p.slug === slug);

/** Все URL сайта для sitemap и пререндера */
export const allRoutes = (): string[] => ['/', '/blog', '/lidy', ...allPages().map(pagePath)];

/** Группировка посадочных по разделу для страницы-каталога */
export const landingsBySection = (): { section: string; items: Landing[] }[] => {
  const map = new Map<string, Landing[]>();
  for (const l of allLandings()) {
    if (!map.has(l.section)) map.set(l.section, []);
    map.get(l.section)!.push(l);
  }
  const order = ['Услуга', 'Цены', 'Клиенты', 'Сегменты', 'Города', 'Сегменты по городам', 'Кому подходит'];
  return [...map.entries()]
    .sort((a, b) => (order.indexOf(a[0]) + 1 || 99) - (order.indexOf(b[0]) + 1 || 99))
    .map(([section, items]) => ({ section, items }));
};

/** Связанные страницы для перелинковки: сначала явные related, потом добор по смыслу */
export const relatedPages = (page: ContentPage, limit = 6): ContentPage[] => {
  const out: ContentPage[] = [];
  const push = (p?: ContentPage) => {
    if (p && p.slug !== page.slug && !out.some((x) => x.slug === p.slug)) out.push(p);
  };

  for (const slug of page.related ?? []) push(pageBySlug(slug));

  if (out.length < limit && page.kind === 'landing') {
    const l = page as Landing;
    for (const other of allLandings()) {
      if (out.length >= limit) break;
      if (other.cityId && other.cityId === l.cityId) push(other);
    }
    for (const other of allLandings()) {
      if (out.length >= limit) break;
      if (other.segmentId && other.segmentId === l.segmentId) push(other);
    }
  }

  if (out.length < limit && page.kind === 'article') {
    const a = page as Article;
    for (const other of allArticles()) {
      if (out.length >= limit) break;
      if (other.category === a.category) push(other);
    }
  }

  return out.slice(0, limit);
};

// ── Индексные записи (для списков и перелинковки) ────────────────────────

import { IndexEntry } from './client';

export const toIndexEntry = (p: ContentPage): IndexEntry => ({
  kind: p.kind,
  slug: p.slug,
  path: pagePath(p),
  h1: p.h1,
  description: p.description,
  group: p.kind === 'article' ? p.category : p.section,
  isoDate: p.isoDate,
  ...(p.kind === 'article' ? { date: p.date, readingMinutes: p.readingMinutes } : {}),
});

export const fullIndex = (): IndexEntry[] => allPages().map(toIndexEntry);

/** Подмножество индекса, нужное конкретной странице: связанные материалы.
 *  Вшивается в HTML пререндера, чтобы блок перелинковки был в исходном коде,
 *  а не появлялся после загрузки JS. */
export const relatedIndex = (page: ContentPage, limit = 8): IndexEntry[] =>
  relatedPages(page, limit).map(toIndexEntry);

export { buildListings, categories, slugifyCategory, BLOG_PAGE_SIZE } from './listings';
