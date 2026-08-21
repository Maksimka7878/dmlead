import { ContentPage } from './types';

/** Компактная запись для списков — из неё строятся /blog и /lidy.
 *  Полный контент страницы в индекс не попадает: иначе список из 500
 *  страниц весил бы мегабайты. */
export interface IndexEntry {
  kind: 'landing' | 'article';
  slug: string;
  path: string;
  h1: string;
  description: string;
  group: string;      // section у посадочной, category у статьи
  isoDate: string;
  date?: string;
  readingMinutes?: number;
}

/** Данные страницы-списка, вшитые пререндером */
export interface ListingData {
  key: string;
  path: string;
  h1: string;
  title: string;
  description: string;
  category: string | null;
  page: number;
  totalPages: number;
  total: number;
  items: IndexEntry[];
  categories: { name: string; slug: string; count: number }[];
}

declare global {
  // eslint-disable-next-line no-var
  var __PAGE_DATA__: ContentPage | null | undefined;
  // eslint-disable-next-line no-var
  var __INDEX_DATA__: IndexEntry[] | null | undefined;
  // eslint-disable-next-line no-var
  var __LISTING__: ListingData | null | undefined;
}

/** Данные, вшитые в HTML пререндером (и выставленные глобально при SSR).
 *  Читаются синхронно на первом рендере — иначе гидратация разъедется. */
export const bootPage = (slug?: string): ContentPage | null => {
  const p = globalThis.__PAGE_DATA__;
  return p && (!slug || p.slug === slug) ? p : null;
};

export const bootIndex = (): IndexEntry[] | null => globalThis.__INDEX_DATA__ ?? null;

export const fetchPage = async (slug: string): Promise<ContentPage | null> => {
  const res = await fetch(`/content/pages/${encodeURIComponent(slug)}.json`);
  if (!res.ok) return null;
  return (await res.json()) as ContentPage;
};

export const fetchIndex = async (): Promise<IndexEntry[]> => {
  const res = await fetch('/content/index.json');
  if (!res.ok) return [];
  return (await res.json()) as IndexEntry[];
};

export const bootListing = (path?: string): ListingData | null => {
  const l = globalThis.__LISTING__;
  return l && (!path || l.path === path) ? l : null;
};

export const fetchListing = async (key: string): Promise<ListingData | null> => {
  const res = await fetch(`/content/listings/${encodeURIComponent(key)}.json`);
  if (!res.ok) return null;
  return (await res.json()) as ListingData;
};
