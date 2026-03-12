import React from 'react';
import { ChevronLeft, BookOpen, Calendar, User, Tag } from 'lucide-react';

const ARTICLES = [
    {
        id: "real-estate-leads-provider",
        title: "Лиды на недвижимость: Как выбрать качественного поставщика",
        date: "12 Фев 2024",
        category: "Лидогенерация",
        content: `
            <p class="mb-4">Покупка лидов на недвижимость — ключевой элемент стратегии роста для агентств и застройщиков. В отличие от холодных звонков, качественные лиды на недвижимость обеспечивают поток клиентов, которые уже заинтересованы в покупке.</p>
            <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">Как отличить качественный лид?</h3>
            <p class="mb-4">Важно разделять "мусорный" трафик и премиальные лиды. Наш сервис специализируется на фильтрации нецелевых заявок, предоставляя только готовых к сделке клиентов.</p>
            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Подтвержденный бюджет:</strong> Клиент знает, сколько готов потратить.</li>
                <li><strong>Актуальность:</strong> Заявка оставлена не более 7 дней назад.</li>
                <li><strong>Контактность:</strong> Клиент готов к диалогу в мессенджерах или по телефону.</li>
            </ul>
            <p>Выбирая поставщика, обращайте внимание на гарантии замены брака и прозрачность источников трафика.</p>
        `
    },
    {
        id: "premium-leads-luxury",
        title: "Премиальные лиды в недвижимости: Особенности сегмента Luxury",
        date: "10 Фев 2024",
        category: "Luxury",
        content: `
            <p class="mb-4">Работа с элитной недвижимостью требует особого подхода. Премиальные лиды — это не просто контакты, это верифицированные заявки от инвесторов и покупателей с чеком от 50 млн рублей.</p>
            <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">Источники элитного трафика</h3>
            <p class="mb-4">Мы используем закрытые каналы трафика:</p>
            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li>Telegram Ads в закрытых инвестиционных каналах.</li>
                <li>Ретаргетинг на посетителей сайтов застройщиков бизнес-класса.</li>
                <li>Контекстная реклама по узким запросам (ЖК "Vesper", "Capital Group" и т.д.).</li>
            </ul>
            <p>Конверсия таких лидов в сделку значительно выше, так как клиент уже имеет сформированную потребность и капитал.</p>
        `
    },
    {
        id: "realtor-clients-2024",
        title: "Где брать клиентов риелтору в 2024 году?",
        date: "05 Фев 2024",
        category: "Маркетинг",
        content: `
            <p class="mb-4">Эффективные каналы привлечения клиентов в недвижимости меняются. Контекстная реклама дорожает, а SEO продвижение требует месяцев работы. Покупка готовых лидов становится самым быстрым способом заполнить воронку продаж.</p>
            <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">Пакетные решения</h3>
            <p class="mb-4">Мы предлагаем гибкие форматы сотрудничества:</p>
            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Тест-драйв:</strong> Проверка качества на небольшом объеме (от 10 лидов).</li>
                <li><strong>Абонентское обслуживание:</strong> Стабильный поток заявок на элитную недвижимость Москвы и Дубая.</li>
            </ul>
            <p>Лидогенерация под ключ снимает с вас рутину маркетинга, позволяя фокуссироваться на продажах.</p>
        `
    },
    {
        id: "real-estate-marketing-trends",
        title: "Маркетинг в недвижимости: Тренды и стратегии",
        date: "01 Фев 2024",
        category: "Тренды",
        content: `
            <p class="mb-4">Успешный маркетинг агентства недвижимости строится на омниканальности. Однако, основой остается качественный входящий трафик.</p>
            <p class="mb-4">Наши методы включают:</p>
            <ul class="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Квиз-маркетинг:</strong> Вовлекающие опросники для квалификации лида.</li>
                <li><strong>Таргетированная реклама:</strong> Точное попадание в платежеспособную аудиторию.</li>
                <li><strong>Контент-маркетинг:</strong> Прогрев клиента экспертными статьями перед звонком.</li>
            </ul>
            <p>Мы помогаем агентствам настроить поток заявок на новостройки, вторичку и загородную недвижимость, используя передовые инструменты 2024 года.</p>
        `
    }
];

import SEO from '../components/SEO';

const ArticlesPage = () => {
    return (
        <div className="pt-24 pb-20"> {/* Standard Padding within Layout */}
            <SEO
                title="Блог о лидогенерации"
                description="Экспертные статьи, кейсы и стратегии привлечения клиентов в недвижимости. Как отличить качественные лиды от мусорных."
                keywords="блог лидогенерация, статьи риелторам, маркетинг недвижимость, привлечение клиентов недвижимость, лиды 2025"
                type="article"
                path="/articles"
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://dmitryleads.ru/" },
                            { "@type": "ListItem", "position": 2, "name": "Блог о лидогенерации", "item": "https://dmitryleads.ru/articles" }
                        ]
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "url": "https://dmitryleads.ru/articles",
                        "name": "Блог DmitryLeads — лидогенерация в недвижимости",
                        "description": "Экспертные статьи о привлечении клиентов в недвижимости, стратегиях маркетинга и лидогенерации.",
                        "publisher": { "@id": "https://dmitryleads.ru/#organization" },
                        "blogPost": ARTICLES.map(a => ({
                            "@type": "BlogPosting",
                            "headline": a.title,
                            "url": `https://dmitryleads.ru/articles#${a.id}`,
                            "author": { "@id": "https://dmitryleads.ru/#organization" },
                            "publisher": { "@id": "https://dmitryleads.ru/#organization" }
                        }))
                    }
                ]}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors group">
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Вернуться на главную
                    </a>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Блог о лидогенерации
                    </h1>
                    <p className="text-xl text-slate-600">
                        Экспертные статьи, кейсы и стратегии привлечения клиентов в недвижимости.
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="grid gap-12">
                    {ARTICLES.map((article) => (
                        <article key={article.id} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-50 transition-colors"></div>

                            <div className="relative z-10 w-full max-w-none">
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 font-medium">
                                    <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                                        <Tag className="w-3 h-3" />
                                        {article.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {article.date}
                                    </span>
                                </div>

                                <h2 className="text-3xl font-bold text-slate-900 mb-6 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h2>

                                <div
                                    className="prose prose-lg prose-slate text-slate-600 leading-relaxed text-justify"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                            </div>
                        </article>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Остались вопросы?</h2>
                        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                            Наши эксперты готовы проконсультировать вас по любым вопросам лидогенерации.
                        </p>
                        <a
                            href="https://t.me/DMitryLeads"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1"
                        >
                            <BookOpen className="w-5 h-5" />
                            Задать вопрос эксперту
                        </a>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                </div>

            </div>
        </div>
    );
};

export default ArticlesPage;
