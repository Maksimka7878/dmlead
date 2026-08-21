import { useEffect, useState } from 'react';
import { ContentPage } from '../content/types';
import { IndexEntry, ListingData, bootIndex, bootListing, bootPage, fetchIndex, fetchListing, fetchPage } from '../content/client';

type Status = 'ready' | 'loading' | 'missing';

/** Страница: сначала из инлайна пререндера (мгновенно, без запроса),
 *  при клиентской навигации — догрузка JSON. */
export const useContentPage = (slug: string | undefined, kind: 'landing' | 'article') => {
  const initial = slug ? bootPage(slug) : null;
  const [page, setPage] = useState<ContentPage | null>(initial && initial.kind === kind ? initial : null);
  const [status, setStatus] = useState<Status>(initial && initial.kind === kind ? 'ready' : 'loading');

  useEffect(() => {
    if (!slug) return;
    if (page && page.slug === slug) return;
    let alive = true;
    setStatus('loading');
    fetchPage(slug).then((p) => {
      if (!alive) return;
      if (p && p.kind === kind) {
        setPage(p);
        setStatus('ready');
      } else {
        setPage(null);
        setStatus('missing');
      }
    }).catch(() => alive && setStatus('missing'));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, kind]);

  return { page, status };
};

export const useContentIndex = () => {
  const initial = bootIndex();
  const [items, setItems] = useState<IndexEntry[]>(initial ?? []);
  useEffect(() => {
    if (initial && initial.length) return;
    let alive = true;
    fetchIndex().then((list) => alive && setItems(list)).catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return items;
};

/** Страница-список блога: данные приходят из инлайна пререндера,
 *  при клиентской навигации догружаются отдельным JSON. */
export const useListing = (key: string, path: string) => {
  const initial = bootListing(path);
  const [listing, setListing] = useState<ListingData | null>(initial);
  const [status, setStatus] = useState<Status>(initial ? 'ready' : 'loading');

  useEffect(() => {
    if (listing && listing.path === path) return;
    let alive = true;
    setStatus('loading');
    fetchListing(key).then((l) => {
      if (!alive) return;
      if (l) { setListing(l); setStatus('ready'); } else { setListing(null); setStatus('missing'); }
    }).catch(() => alive && setStatus('missing'));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, path]);

  return { listing, status };
};
