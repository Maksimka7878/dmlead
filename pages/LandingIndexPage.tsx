import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContentIndex } from '../components/useContent';
import { Breadcrumbs } from '../components/PageFurniture';
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
        <div className="pt-24 pb-20">
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
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <Breadcrumbs items={[{ name: 'Главная', to: '/' }, { name: 'Услуги' }]} />
                <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    Лиды и клиенты на недвижимость
                </h1>
                <p className="mb-12 max-w-2xl text-xl text-slate-600">
                    {total} направлений: по городам, сегментам рынка и типам компаний. Выберите своё — на странице
                    будут цена, критерии квалификации и условия замены нецелевых лидов.
                </p>

                {groups.map((g) => (
                    <section key={g.group} className="mb-12">
                        <h2 className="mb-5 text-2xl font-bold text-slate-900">{g.group}</h2>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {g.items.map((e) => (
                                <Link
                                    key={e.slug}
                                    to={e.path}
                                    className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <span className="font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[var(--accent)]">
                                        {e.h1}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default LandingIndexPage;
