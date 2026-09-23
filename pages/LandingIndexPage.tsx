import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContentIndex } from '../components/useContent';
import { Breadcrumbs, PageHead } from '../components/PageFurniture';
import { Arrow } from '../components/Icons';
import SEO from '../components/SEO';
import { url } from '../site';

const ORDER = ['Услуга', 'Цены', 'Клиенты', 'Сегменты', 'Города', 'Сегменты по городам', 'Кому подходит'];

const LandingIndexPage: React.FC = () => {
    const index = useContentIndex();

    const groups = useMemo(() => {
        const map = new Map<string, typeof index>();
        for (const e of index) {
            if (e.kind !== 'landing') continue;
            if (!map.has(e.group)) map.set(e.group, []);
            map.get(e.group)!.push(e);
        }
        return [...map.entries()]
            .sort((a, b) => (ORDER.indexOf(a[0]) + 1 || 99) - (ORDER.indexOf(b[0]) + 1 || 99))
            .map(([group, items]) => ({ group, items: [...items].sort((a, b) => a.h1.localeCompare(b.h1, 'ru')) }));
    }, [index]);

    const total = groups.reduce((n, g) => n + g.items.length, 0);

    return (
        <div className="aurora pt-[calc(var(--nav-h)+64px)] md:pt-[calc(var(--nav-h)+88px)]">
            <SEO
                title="Каталог услуг: лиды и клиенты на недвижимость"
                description="Все направления: покупка лидов на недвижимость по городам и сегментам, цены, гарантии замены, решения под агентства, застройщиков и брокеров."
                keywords="купить лиды на недвижимость, клиенты на недвижимость, лиды по городам, лиды по сегментам"
                path="/lidy"
                schema={[{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Каталог услуг DmitryLeads',
                    description: 'Направления покупки лидов на недвижимость по городам, сегментам и типам клиентов.',
                    url: url('/lidy'),
                }]}
            />
            <div className="wrap">
                <Breadcrumbs items={[{ name: 'Главная', to: '/' }, { name: 'Направления' }]} />
                <PageHead
                    title={<><span className="text-brand">{total}</span> направлений <em>под вашу задачу</em></>}
                    lead="Лиды и клиенты на недвижимость по городам, сегментам рынка и типам компаний. Выберите своё — на странице будут цена, критерии квалификации и условия замены нецелевых лидов."
                />

                {groups.map((g) => (
                    <section key={g.group} className="mb-16 md:mb-20">
                        <div className="mb-5 flex items-baseline justify-between gap-4">
                            <h2 className="display text-[clamp(30px,3.4vw,48px)]">{g.group}</h2>
                            <span className="num text-[22px] text-muted-2">{g.items.length}</span>
                        </div>
                        <ul className="grid border-t border-[var(--line)] sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
                            {g.items.map((e) => (
                                <li key={e.slug}>
                                    <Link
                                        to={e.path}
                                        className="group grid h-full grid-cols-[minmax(0,1fr)_20px] items-center gap-4 border-b border-[var(--line)] py-4 text-[16px] font-medium leading-snug text-ink transition-colors hover:text-brand"
                                    >
                                        {e.h1}
                                        <Arrow className="ico text-muted-2 transition-[transform,color] duration-500 group-hover:rotate-45 group-hover:text-brand" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default LandingIndexPage;
