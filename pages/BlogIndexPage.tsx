import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useListing } from '../components/useContent';
import { Breadcrumbs } from '../components/PageFurniture';
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
    if (!listing) return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Загрузка…</div>;

    const pageUrl = (p: number) => (p === 1 ? basePath : `${basePath}/page/${p}`);

    return (
        <div className="pt-24 pb-20">
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
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { name: 'Главная', to: '/' },
                        ...(cat ? [{ name: 'Блог', to: '/blog' }, { name: listing.h1 }] : [{ name: 'Блог' }]),
                    ]}
                />

                <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    {listing.h1}
                    {listing.page > 1 && <span className="text-slate-300"> — {listing.page}</span>}
                </h1>
                <p className="mb-10 max-w-2xl text-xl text-slate-600">{listing.description}</p>

                {/* Категории — отдельные страницы, а не клиентский фильтр:
                    так каждая тема получает свой URL и свой вход из поиска. */}
                <nav className="mb-10 flex flex-wrap gap-2">
                    <Link
                        to="/blog"
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${!cat ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        style={!cat ? { backgroundColor: 'var(--accent)' } : undefined}
                    >
                        Все
                    </Link>
                    {listing.categories.map((c) => (
                        <Link
                            key={c.slug}
                            to={`/blog/kategoriya/${c.slug}`}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${cat === c.slug ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            style={cat === c.slug ? { backgroundColor: 'var(--accent)' } : undefined}
                        >
                            {c.name} <span className="opacity-60">{c.count}</span>
                        </Link>
                    ))}
                </nav>

                <div className="grid gap-4 md:grid-cols-2">
                    {listing.items.map((a) => (
                        <Link
                            key={a.slug}
                            to={a.path}
                            className="group flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                                {a.group}
                            </span>
                            <h2 className="mt-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[var(--accent)]">
                                {a.h1}
                            </h2>
                            <p className="mt-3 flex-1 text-slate-500">{a.description}</p>
                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{a.date}</span>
                                {a.readingMinutes && (
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.readingMinutes} мин</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {listing.totalPages > 1 && (
                    <nav aria-label="Страницы" className="mt-12 flex flex-wrap items-center justify-center gap-2">
                        {listing.page > 1 && (
                            <Link to={pageUrl(listing.page - 1)} className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                <ChevronLeft className="h-4 w-4" />Назад
                            </Link>
                        )}
                        {Array.from({ length: listing.totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                to={pageUrl(p)}
                                aria-current={p === listing.page ? 'page' : undefined}
                                className={`min-w-10 rounded-xl px-3 py-2 text-center text-sm font-semibold transition-colors ${p === listing.page ? 'text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                style={p === listing.page ? { backgroundColor: 'var(--accent)' } : undefined}
                            >
                                {p}
                            </Link>
                        ))}
                        {listing.page < listing.totalPages && (
                            <Link to={pageUrl(listing.page + 1)} className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                Дальше<ChevronRight className="h-4 w-4" />
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </div>
    );
};

export default BlogIndexPage;
