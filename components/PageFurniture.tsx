import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FaqItem } from '../content/types';
import { IndexEntry } from '../content/client';

export const Breadcrumbs: React.FC<{ items: { name: string; to?: string }[] }> = ({ items }) => (
  <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500">
    {items.map((it, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 text-slate-300" />}
        {it.to ? (
          <Link to={it.to} className="transition-colors hover:text-slate-900">{it.name}</Link>
        ) : (
          <span className="text-slate-400">{it.name}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export const Faq: React.FC<{ items: FaqItem[]; title?: string }> = ({ items, title = 'Частые вопросы' }) => {
  if (!items.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      <div className="space-y-3">
        {items.map((f, i) => (
          <details key={i} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none">
              <span className="flex items-start justify-between gap-4">
                {f.q}
                <ChevronRight aria-hidden className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export const RelatedLinks: React.FC<{ items: IndexEntry[]; title?: string }> = ({ items, title = 'Смотрите также' }) => {
  if (!items.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-5 text-xl font-bold text-slate-900">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <Link
            key={p.slug}
            to={p.path}
            className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {p.group}
            </div>
            <div className="mt-1 font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[var(--accent)]">
              {p.h1}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
