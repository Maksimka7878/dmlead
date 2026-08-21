import { IndexEntry } from './client';
import { allArticles, toIndexEntry } from './registry';

export const BLOG_PAGE_SIZE = 24;

/** Страница-список: /blog, /blog/page/2, /blog/kategoriya/metriki и т.д.
 *  Каждая рендерится отдельным HTML и содержит только свои карточки —
 *  иначе один индекс на 287 статей весит под мегабайт. */
export interface Listing {
  key: string;          // ключ файла: blog, blog-2, cat-metriki-2
  path: string;
  h1: string;
  title: string;
  description: string;
  category: string | null;
  page: number;
  totalPages: number;
  total: number;
  items: IndexEntry[];
}

/** Транслитерация для слагов категорий: категории заданы по-русски. */
const MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

export const slugifyCategory = (s: string): string =>
  s.toLowerCase().split('').map((ch) => MAP[ch] ?? (/[a-z0-9]/.test(ch) ? ch : '-')).join('')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const categories = (): { name: string; slug: string; count: number }[] => {
  const map = new Map<string, number>();
  for (const a of allArticles()) map.set(a.category, (map.get(a.category) ?? 0) + 1);
  return [...map.entries()]
    .map(([name, count]) => ({ name, slug: slugifyCategory(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru'));
};

export const buildListings = (): Listing[] => {
  const sorted = allArticles()
    .map(toIndexEntry)
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate) || a.h1.localeCompare(b.h1, 'ru'));

  const out: Listing[] = [];

  const addSeries = (
    items: IndexEntry[],
    opts: { keyBase: string; pathBase: string; h1: string; category: string | null; descr: (page: number, total: number) => string; title: (page: number) => string }
  ) => {
    const parts = chunk(items, BLOG_PAGE_SIZE);
    const totalPages = Math.max(1, parts.length);
    parts.forEach((part, i) => {
      const page = i + 1;
      out.push({
        key: page === 1 ? opts.keyBase : `${opts.keyBase}-${page}`,
        path: page === 1 ? opts.pathBase : `${opts.pathBase}/page/${page}`,
        h1: opts.h1,
        title: opts.title(page),
        description: opts.descr(page, items.length),
        category: opts.category,
        page,
        totalPages,
        total: items.length,
        items: part,
      });
    });
  };

  addSeries(sorted, {
    keyBase: 'blog',
    pathBase: '/blog',
    h1: 'Блог о лидогенерации',
    category: null,
    title: (p) => (p === 1 ? 'Блог о лидогенерации в недвижимости' : `Блог о лидогенерации — страница ${p}`),
    descr: (p, total) =>
      p === 1
        ? `${total} материалов о покупке лидов на недвижимость: квалификация, юнит-экономика, скрипты первого контакта, работа с CRM и каналами трафика.`
        : `Материалы о лидогенерации в недвижимости, страница ${p} из ${Math.ceil(total / BLOG_PAGE_SIZE)}.`,
  });

  for (const cat of categories()) {
    const items = sorted.filter((e) => e.group === cat.name);
    addSeries(items, {
      keyBase: `cat-${cat.slug}`,
      pathBase: `/blog/kategoriya/${cat.slug}`,
      h1: cat.name,
      category: cat.name,
      title: (p) => (p === 1 ? `${cat.name} — статьи о лидах на недвижимость` : `${cat.name} — страница ${p}`),
      descr: (p, total) =>
        p === 1
          ? `${total} материалов в разделе «${cat.name}»: практика работы с лидами на недвижимость.`
          : `Раздел «${cat.name}», страница ${p}.`,
    });
  }

  return out;
};

export const listingByPath = (path: string): Listing | undefined =>
  buildListings().find((l) => l.path === path);
