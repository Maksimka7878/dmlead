import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useListing } from '../components/useContent';
import { Breadcrumbs, Dot, PageHead } from '../components/PageFurniture';
import { Arrow } from '../components/Icons';
import SEO from '../components/SEO';
import { url } from '../site';
import NotFound from './NotFound';

/** Один компонент обслуживает четыре маршрута: общий блог, его страницы,
 *  категорию и страницы категории. Ключ листинга собирается из параметров. */
const BlogIndexPage: React.FC = () => {
    const { cat, page } = useParams<{ cat?: string; page?: string }>();
    const n = Math.max(1, Number(page ?? 1) || 1);

    const base = cat ? `cat-${cat}` : 'blog';
    const key = n === 1 ? base : `${base}-${n}`;
    const basePath = cat ? `/blog/kategoriya/${cat}` : '/blog';
    const path = n === 1 ? basePath : `${basePath}/page/${n}`;

    const { listing, status } = useListing(key, path);

    if (status === 'missing') return <NotFound />;
    if (!listing) return <div className="flex min-h-[60vh] items-center justify-center text-muted">Загрузка…</div>;

    const pageUrl = (p: number) => (p === 1 ? basePath : `${basePath}/page/${p}`);

    return (
        <div className="aurora pt-[calc(var(--nav-h)+64px)] md:pt-[calc(var(--nav-h)+88px)]">
            <SEO
                title={listing.title}
                description={listing.description}
                keywords="блог лидогенерация, статьи риелторам, маркетинг недвижимость, квалификация лидов"
                path={path}
                schema={[{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: listing.title,
                    description: listing.description,
                    url: url(path),
                    isPartOf: { '@type': 'Blog', name: 'Блог DmitryLeads', url: url('/blog') },
                }]}
            />
            <div className="wrap">
                <Breadcrumbs
                    items={[
                        { name: 'Главная', to: '/' },
                        ...(cat ? [{ name: 'Блог', to: '/blog' }, { name: listing.h1 }] : [{ name: 'Блог' }]),
                    ]}
                />

                <PageHead
                    title={<>{listing.h1}{listing.page > 1 && <span className="text-muted-2"> — {listing.page}</span>}</>}
                    lead={listing.description}
                />

                {/* Категории — отдельные страницы, а не клиентский фильтр:
                    так каждая тема получает свой URL и свой вход из поиска. */}
                <nav className="mb-10 flex gap-1.5 overflow-x-auto border-b border-[var(--line)] pb-3.5 [scrollbar-width:none]" aria-label="Категории">
                    {[{ slug: '', name: 'Все', count: 0 }, ...listing.categories].map((c) => {
                        const on = (cat ?? '') === c.slug;
                        return (
                            <Link
                                key={c.slug || 'all'}
                                to={c.slug ? `/blog/kategoriya/${c.slug}` : '/blog'}
                                aria-current={on ? 'page' : undefined}
                                className={`flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-[18px] text-[15px] font-medium transition-colors ${on ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
                            >
                                {c.name}
                                {c.count > 0 && <span className="opacity-60">{c.count}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {listing.items.map((a) => (
                        <Link
                            key={a.slug}
                            to={a.path}
                            className="group flex flex-col rounded-[24px] border border-[var(--line-2)] bg-white p-6 transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow)] md:p-7"
                        >
                            <span className="flex items-center justify-between gap-4 text-[13.5px] text-ink-2">
                                <Dot>{a.group}</Dot>
                                <Arrow className="ico text-muted-2 transition-[transform,color] duration-500 group-hover:rotate-45 group-hover:text-brand" />
                            </span>
                            <h2 className="display mt-5 text-[clamp(26px,2.3vw,34px)] leading-[.98] transition-colors group-hover:text-brand">
                                {a.h1}
                            </h2>
                            <p className="mt-4 line-clamp-4 flex-1 text-[15.5px] leading-relaxed text-ink-2">{a.description}</p>
                            <div className="mt-6 flex items-center gap-4 border-t border-[var(--line)] pt-4 text-[13px] text-muted">
                                <span>{a.date}</span>
                                {a.readingMinutes && <span>{a.readingMinutes} мин чтения</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                {listing.totalPages > 1 && (
                    <nav aria-label="Страницы" className="mt-14 flex flex-wrap items-center justify-center gap-2">
                        {listing.page > 1 && (
                            <Link to={pageUrl(listing.page - 1)} className="btn btn--ghost btn--sm">← Назад</Link>
                        )}
                        {Array.from({ length: listing.totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                to={pageUrl(p)}
                                aria-current={p === listing.page ? 'page' : undefined}
                                className={`grid h-[42px] min-w-[42px] place-items-center rounded-full px-3 text-[15px] font-medium transition-colors ${p === listing.page ? 'bg-ink text-white' : 'text-ink shadow-[inset_0_0_0_1px_var(--line-2)] hover:shadow-[inset_0_0_0_1px_var(--text)]'}`}
                            >
                                {p}
                            </Link>
                        ))}
                        {listing.page < listing.totalPages && (
                            <Link to={pageUrl(listing.page + 1)} className="btn btn--ghost btn--sm">Дальше →</Link>
                        )}
                    </nav>
                )}
            </div>
        </div>
    );
};

export default BlogIndexPage;
