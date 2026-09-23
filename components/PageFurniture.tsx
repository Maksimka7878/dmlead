import React from 'react';
import { Link } from 'react-router-dom';
import { FaqItem } from '../content/types';
import { IndexEntry } from '../content/client';
import { Arrow } from './Icons';

// «/» — статическая главная вне роутера: туда только полная загрузка.
const Crumb: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) =>
  to === '/' ? (
    <a href="/" className="transition-colors hover:text-ink">{children}</a>
  ) : (
    <Link to={to} className="transition-colors hover:text-ink">{children}</Link>
  );

export const Breadcrumbs: React.FC<{ items: { name: string; to?: string }[] }> = ({ items }) => (
  <nav aria-label="Хлебные крошки" className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
    {items.map((it, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span aria-hidden className="text-muted-2">/</span>}
        {it.to ? <Crumb to={it.to}>{it.name}</Crumb> : <span className="text-muted-2">{it.name}</span>}
      </React.Fragment>
    ))}
  </nav>
);

/** Шапка страницы: раздел, узкий заголовок капсом, лид. */
export const PageHead: React.FC<{ kicker?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; size?: 'lg' | 'md' }> = ({
  kicker,
  title,
  lead,
  size = 'lg',
}) => (
  <header className="mb-12 md:mb-16">
    {kicker && <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-ink-2">{kicker}</div>}
    <h1 className={`display ${size === 'lg' ? 'text-[clamp(44px,6.4vw,104px)]' : 'text-[clamp(40px,5.2vw,80px)]'}`}>{title}</h1>
    {lead && <p className="lede mt-6 max-w-[62ch]">{lead}</p>}
  </header>
);

/** Метка раздела с точкой-акцентом, как «факты» на главной. */
export const Dot: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2.5">
    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent-hi)]" />
    {children}
  </span>
);

export const Faq: React.FC<{ items: FaqItem[]; title?: string }> = ({ items, title = 'Частые вопросы' }) => {
  if (!items.length) return null;
  return (
    <section className="faq mt-20 md:mt-28">
      <h2 className="display mb-8 text-[clamp(36px,4.4vw,64px)]">{title}</h2>
      <div className="border-t border-[var(--line)]">
        {items.map((f, i) => (
          <details key={i} className="group border-b border-[var(--line)]">
            <summary className="flex items-center justify-between gap-6 py-5 text-lg font-medium text-ink md:py-6 md:text-xl">
              {f.q}
              <span className="faq__sign" aria-hidden />
            </summary>
            <p className="max-w-[70ch] pb-6 leading-relaxed text-ink-2">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

/** Перелинковка: крупные строки-ссылки, как список направлений на главной. */
export const RelatedLinks: React.FC<{ items: IndexEntry[]; title?: string }> = ({ items, title = 'Смотрите также' }) => {
  if (!items.length) return null;
  return (
    <section className="mt-20 md:mt-28">
      <h2 className="display mb-6 text-[clamp(36px,4.4vw,64px)]">{title}</h2>
      <ul className="border-t border-[var(--line)]">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              to={p.path}
              className="group grid grid-cols-[minmax(0,1fr)_30px] items-center gap-5 border-b border-[var(--line)] py-5 transition-[padding,color] duration-500 hover:pl-3 hover:text-brand md:hover:pl-6"
            >
              <span>
                <span className="mb-1 block text-[13px] text-muted">{p.group}</span>
                <span className="display block text-[clamp(24px,2.6vw,40px)] leading-[.98]">{p.h1}</span>
              </span>
              <Arrow className="ico h-7 w-7 [stroke-width:1.4] transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
