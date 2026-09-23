import React from 'react';
import { useParams } from 'react-router-dom';
import { Landing } from '../content/types';
import { useContentIndex, useContentPage } from '../components/useContent';
import ContentBlocks from '../components/ContentBlocks';
import { Breadcrumbs, Dot, Faq, PageHead, RelatedLinks } from '../components/PageFurniture';
import SEO from '../components/SEO';
import { pageSchema } from '../content/schema';
import NotFound from './NotFound';

const LandingPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { page, status } = useContentPage(slug, 'landing');
    const index = useContentIndex();

    if (status === 'missing') return <NotFound />;
    if (!page) {
        return <div className="flex min-h-[60vh] items-center justify-center text-muted">Загрузка…</div>;
    }

    const l = page as Landing;
    const related = (l.related ?? [])
        .map((s) => index.find((e) => e.slug === s))
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .slice(0, 6);

    return (
        <div className="aurora pt-[calc(var(--nav-h)+64px)] md:pt-[calc(var(--nav-h)+88px)]">
            <SEO
                title={l.title}
                description={l.description}
                keywords={l.keywords.join(', ')}
                path={`/lidy/${l.slug}`}
                schema={pageSchema(l)}
            />
            <div className="wrap">
                <Breadcrumbs items={[{ name: 'Главная', to: '/' }, { name: 'Направления', to: '/lidy' }, { name: l.h1 }]} />
                <PageHead kicker={<Dot>{l.section}</Dot>} title={l.h1} lead={l.lead} />
            </div>

            <div className="wrap">
                <div className="max-w-[880px]">
                    <article className="text-[17px] md:text-[18px]">
                        <ContentBlocks blocks={l.blocks} />
                    </article>

                    <Faq items={l.faq} />
                    <RelatedLinks items={related} />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
