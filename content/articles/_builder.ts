import { Article, Block, FaqItem } from '../types';

export interface ArticleSpec {
  slug: string;
  h1: string;
  /** <title>, если должен отличаться от H1 */
  title?: string;
  description: string;
  keywords: string[];
  category: string;
  /** Дата публикации ISO */
  iso: string;
  lead: string;
  body: Block[];
  faq?: FaqItem[];
  related?: string[];
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

const humanDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const textOf = (b: Block): string => {
  switch (b.t) {
    case 'p': case 'h2': case 'h3': return b.text;
    case 'ul': case 'ol': return b.items.join(' ');
    case 'quote': return b.text;
    case 'callout': return `${b.title} ${b.text}`;
    case 'table': return [...b.head, ...b.rows.flat()].join(' ');
    case 'steps': return b.items.map((i) => `${i.title} ${i.text}`).join(' ');
    case 'cta': return `${b.title} ${b.text}`;
    default: return '';
  }
};

export const wordCount = (blocks: Block[], extra = ''): number =>
  (blocks.map(textOf).join(' ') + ' ' + extra).trim().split(/\s+/).filter(Boolean).length;

export const art = (s: ArticleSpec): Article => {
  const words = wordCount(s.body, s.lead + ' ' + (s.faq ?? []).map((f) => `${f.q} ${f.a}`).join(' '));
  return {
    kind: 'article',
    slug: s.slug,
    h1: s.h1,
    title: s.title ?? s.h1,
    description: s.description,
    keywords: s.keywords,
    category: s.category,
    lead: s.lead,
    blocks: s.body,
    faq: s.faq ?? [],
    isoDate: s.iso,
    date: humanDate(s.iso),
    readingMinutes: Math.max(2, Math.round(words / 160)),
    related: s.related,
  };
};

// ── Короткие конструкторы блоков ─────────────────────────────────────────
// Статьи пишутся вручную, и без них текст тонет в синтаксисе объектов.

export const P = (text: string): Block => ({ t: 'p', text });
export const H2 = (text: string): Block => ({ t: 'h2', text });
export const H3 = (text: string): Block => ({ t: 'h3', text });
export const UL = (...items: string[]): Block => ({ t: 'ul', items });
export const OL = (...items: string[]): Block => ({ t: 'ol', items });
export const TB = (head: string[], rows: string[][], caption?: string): Block => ({ t: 'table', head, rows, caption });
export const CO = (title: string, text: string): Block => ({ t: 'callout', title, text });
export const CTA = (title: string, text: string): Block => ({ t: 'cta', title, text });
export const ST = (...items: { title: string; text: string }[]): Block => ({ t: 'steps', items });
export const CALC = (): Block => ({ t: 'calc' });
export const GUAR = (): Block => ({ t: 'guarantees' });
export const PRICE = (): Block => ({ t: 'pricing' });
export const Q = (q: string, a: string) => ({ q, a });
