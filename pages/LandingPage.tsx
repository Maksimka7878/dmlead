import React from 'react';
import { useParams } from 'react-router-dom';
import { Landing } from '../content/types';
import { useContentIndex, useContentPage } from '../components/useContent';
import ContentBlocks from '../components/ContentBlocks';
import { Breadcrumbs, Faq, RelatedLinks } from '../components/PageFurniture';
import SEO from '../components/SEO';
import { pageSchema } from '../content/schema';
import NotFound from './NotFound';

const LandingPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { page, status } = useContentPage(slug, 'landing');
    const index = useContentIndex();

    if (status === 'missing') return <NotFound />;
    if (!page) {
        return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Загрузка…</div>;
    }

    const l = page as Landing;
    const related = (l.related ?? [])
        .map((s) => index.find((e) => e.slug === s))
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .slice(0, 6);

    return (
        <div className="pt-24 pb-20">
            <SEO
                title={l.title}
                description={l.description}
                keywords={l.keywords.join(', ')}
                path={`/lidy/${l.slug}`}
                schema={pageSchema(l)}
            />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ name: 'Главная', to: '/' }, { name: 'Услуги', to: '/lidy' }, { name: l.h1 }]} />

                <header className="mb-10">
                    <div className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {l.section}
                    </div>
                    <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">{l.h1}</h1>
                    <p className="text-xl leading-relaxed text-slate-600">{l.lead}</p>
                </header>

                <article className="text-lg">
                    <ContentBlocks blocks={l.blocks} />
                </article>

                <Faq items={l.faq} />
                <RelatedLinks items={related} />
            </div>
        </div>
    );
};

export default LandingPage;
