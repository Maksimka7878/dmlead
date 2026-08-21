import React from 'react';
import { Link } from 'react-router-dom';

/** Перелинковка из подвала. Каталог на 200+ посадочных — это одна точка
 *  входа; здесь ключевые страницы кластера получают ссылку с каждой
 *  страницы сайта, что заметно сокращает глубину обхода. */
const GROUPS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Услуга',
    links: [
      { to: '/lidy/kupit-lidy-na-nedvizhimost', label: 'Купить лиды на недвижимость' },
      { to: '/lidy/klienty-na-nedvizhimost', label: 'Клиенты на недвижимость' },
      { to: '/lidy/stoimost-lidov-na-nedvizhimost', label: 'Стоимость лидов' },
      { to: '/lidy/celevye-lidy-na-nedvizhimost', label: 'Целевые лиды' },
      { to: '/lidy/eksklyuzivnye-lidy-na-nedvizhimost', label: 'Эксклюзивные лиды' },
      { to: '/lidy/gde-kupit-lidy-na-nedvizhimost', label: 'Где купить лиды' },
    ],
  },
  {
    title: 'Сегменты',
    links: [
      { to: '/lidy/kupit-lidy-novostroyki', label: 'Новостройки' },
      { to: '/lidy/kupit-lidy-vtorichka', label: 'Вторичная недвижимость' },
      { to: '/lidy/kupit-lidy-kommercheskaya', label: 'Коммерческая недвижимость' },
      { to: '/lidy/kupit-lidy-premium', label: 'Премиум и De Luxe' },
      { to: '/lidy/kupit-lidy-zagorodnaya', label: 'Загородная недвижимость' },
      { to: '/lidy/lidy-na-zarubezhnuyu-nedvizhimost', label: 'Зарубежная недвижимость' },
    ],
  },
  {
    title: 'Города',
    links: [
      { to: '/lidy/kupit-lidy-na-nedvizhimost-moskva', label: 'Москва' },
      { to: '/lidy/kupit-lidy-na-nedvizhimost-sankt-peterburg', label: 'Санкт-Петербург' },
      { to: '/lidy/kupit-lidy-na-nedvizhimost-sochi', label: 'Сочи' },
      { to: '/lidy/kupit-lidy-na-nedvizhimost-krasnodar', label: 'Краснодар' },
      { to: '/lidy/kupit-lidy-na-nedvizhimost-dubai', label: 'Дубай' },
      { to: '/lidy/kupit-lidy-na-nedvizhimost-phuket', label: 'Пхукет' },
    ],
  },
  {
    title: 'Кому подходит',
    links: [
      { to: '/lidy/lidy-dlya-agentstvo', label: 'Агентствам недвижимости' },
      { to: '/lidy/lidy-dlya-rieltor', label: 'Частным риелторам' },
      { to: '/lidy/lidy-dlya-zastroyshchik', label: 'Застройщикам' },
      { to: '/lidy/lidy-dlya-broker', label: 'Брокерам' },
      { to: '/lidy', label: 'Все направления' },
      { to: '/blog', label: 'Блог' },
    ],
  },
];

const FooterLinks: React.FC = () => (
  <nav aria-label="Разделы сайта" className="mb-16 grid gap-8 border-t border-slate-200/70 pt-12 sm:grid-cols-2 lg:grid-cols-4">
    {GROUPS.map((g) => (
      <div key={g.title}>
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{g.title}</div>
        <ul className="space-y-2">
          {g.links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--accent)]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>
);

export default FooterLinks;
