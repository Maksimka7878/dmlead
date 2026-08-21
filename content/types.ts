/** Общие типы контентной системы. Все страницы блога и посадочных
 *  описываются этими структурами и попадают в реестр content/registry.ts,
 *  из которого строятся роуты, sitemap и перелинковка. */

export type PageKind = 'landing' | 'article';

/** Блок контента. Рендерится в ContentBlocks.tsx.
 *  Намеренно не HTML-строка: типизированные блоки нельзя «размыть»
 *  шаблоном, у каждой страницы видно, чем она отличается от соседней. */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'quote'; text: string; source?: string }
  | { t: 'callout'; title: string; text: string }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'steps'; items: { title: string; text: string }[] }
  | { t: 'pricing' }        // живой блок цен из constants.tsx
  | { t: 'calc' }           // калькулятор юнит-экономики
  | { t: 'guarantees' }     // блок гарантий замены
  | { t: 'cta'; title: string; text: string };

export interface FaqItem {
  q: string;
  a: string;
}

export interface BasePage {
  kind: PageKind;
  /** URL-слаг без префикса раздела */
  slug: string;
  /** H1 страницы */
  h1: string;
  /** <title> без суффикса бренда */
  title: string;
  description: string;
  keywords: string[];
  /** Лид-абзац под H1 */
  lead: string;
  blocks: Block[];
  faq: FaqItem[];
  /** Слаги связанных страниц для перелинковки */
  related?: string[];
  isoDate: string;
  updatedIso?: string;
}

export interface Landing extends BasePage {
  kind: 'landing';
  cityId?: string;
  segmentId?: string;
  audienceId?: string;
  /** Хлебные крошки: подпись раздела */
  section: string;
}

export interface Article extends BasePage {
  kind: 'article';
  category: string;
  /** Человекочитаемая дата, напр. «12 марта 2026» */
  date: string;
  readingMinutes: number;
}

export type ContentPage = Landing | Article;

/** Путь страницы в сайте */
export const pagePath = (p: ContentPage): string =>
  p.kind === 'article' ? `/blog/${p.slug}` : `/lidy/${p.slug}`;
