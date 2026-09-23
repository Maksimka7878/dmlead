import React from 'react';
import { useParams } from 'react-router-dom';
import { Article } from '../content/types';
import { useContentIndex, useContentPage } from '../components/useContent';
import ContentBlocks from '../components/ContentBlocks';
import { Breadcrumbs, Dot, Faq, PageHead, RelatedLinks } from '../components/PageFurniture';
import SEO from '../components/SEO';
import { pageSchema } from '../content/schema';
import NotFound from './NotFound';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { page, status } = useContentPage(slug, 'article');
    const index = useContentIndex();

    if (status === 'missing') return <NotFound />;
    if (!page) {
        return <div className="flex min-h-[60vh] items-center justify-center text-muted">Загрузка…</div>;
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
        <div className="aurora pt-[calc(var(--nav-h)+64px)] md:pt-[calc(var(--nav-h)+88px)]">
            <SEO
                title={a.title}
                description={a.description}
                keywords={a.keywords.join(', ')}
                type="article"
                path={`/blog/${a.slug}`}
                schema={pageSchema(a)}
            />
            <div className="wrap">
                <div className="max-w-[880px]">
                    <Breadcrumbs items={[{ name: 'Главная', to: '/' }, { name: 'Блог', to: '/blog' }, { name: a.h1 }]} />
                    <PageHead
                        size="md"
                        kicker={<><Dot>{a.category}</Dot><span>{a.date}</span><span>{a.readingMinutes} мин чтения</span></>}
                        title={a.h1}
                        lead={a.lead}
                    />

                    <article className="text-[17px] md:text-[18px]">
                        <ContentBlocks blocks={a.blocks} />
                    </article>

                    <Faq items={a.faq} />
                    <RelatedLinks items={related} title="Читайте также" />
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;
