import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Article } from '../content/types';
import { useContentIndex, useContentPage } from '../components/useContent';
import ContentBlocks from '../components/ContentBlocks';
import { Breadcrumbs, Faq, RelatedLinks } from '../components/PageFurniture';
import SEO from '../components/SEO';
import { pageSchema } from '../content/schema';
import NotFound from './NotFound';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { page, status } = useContentPage(slug, 'article');
    const index = useContentIndex();

    if (status === 'missing') return <NotFound />;
    if (!page) {
        return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Загрузка…</div>;
    }

    const a = page as Article;
    const explicit = (a.related ?? [])
        .map((s) => index.find((e) => e.slug === s))
        .filter((e): e is NonNullable<typeof e> => Boolean(e));
    const sameCategory = index.filter((e) => e.kind === 'article' && e.group === a.category && e.slug !== a.slug);
    const related = [...explicit, ...sameCategory]
        .filter((e, i, arr) => arr.findIndex((x) => x.slug === e.slug) === i)
        .slice(0, 6);

    return (
        <div className="pt-24 pb-20">
            <SEO
                title={a.title}
                description={a.description}
                keywords={a.keywords.join(', ')}
                type="article"
                path={`/blog/${a.slug}`}
                schema={pageSchema(a)}
            />
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ name: 'Главная', to: '/' }, { name: 'Блог', to: '/blog' }, { name: a.h1 }]} />

                <header className="mb-10">
                    <div className="mb-5 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                            <Tag className="h-3 w-3" />{a.category}
                        </span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{a.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.readingMinutes} мин</span>
                    </div>
                    <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{a.h1}</h1>
                    <p className="text-xl leading-relaxed text-slate-600">{a.lead}</p>
                </header>

                <article className="text-lg">
                    <ContentBlocks blocks={a.blocks} />
                </article>

                <Faq items={a.faq} />
                <RelatedLinks items={related} title="Читайте также" />
            </div>
        </div>
    );
};

export default BlogPostPage;
