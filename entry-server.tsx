import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import App from './App';
import { ContentPage } from './content/types';
import { IndexEntry, ListingData } from './content/client';

export interface RenderResult {
  html: string;
  head: string;
}

/** Рендер одного маршрута в статический HTML.
 *  Данные страницы кладутся в globalThis до рендера — те же поля читает
 *  клиент из инлайна, поэтому гидратация совпадает байт в байт. */
export const render = (
  path: string,
  page: ContentPage | null,
  index: IndexEntry[],
  listing: ListingData | null = null
): RenderResult => {
  globalThis.__PAGE_DATA__ = page;
  globalThis.__INDEX_DATA__ = index;
  globalThis.__LISTING__ = listing;

  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const h = helmetContext.helmet;
  const head = h
    ? [h.title, h.meta, h.link, h.script].map((x) => (x ? x.toString() : '')).filter(Boolean).join('\n    ')
    : '';

  return { html, head };
};
