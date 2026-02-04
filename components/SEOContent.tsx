import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const SEOContent = () => {
    const [isOpen, setIsOpen] = useState(false);

    const articles = [
        {
            title: "Лиды на недвижимость: Как выбрать качественного поставщика",
            content: `
                Покупка лидов на недвижимость — ключевой элемент стратегии роста для агентств и застройщиков. 
                В отличие от холодных звонков, качественные лиды на недвижимость обеспечивают поток клиентов, 
                которые уже заинтересованы в покупке. Важно разделять "мусорный" трафик и премиальные лиды. 
                Наш сервис специализируется на фильтрации нецелевых заявок, предоставляя только готовых к сделке клиентов.
                Основные критерии качества: подтвержденный бюджет, актуальность запроса (до 7 дней) и готовность к общению.
            `
        },
        {
            title: "Премиальные лиды в недвижимости: Особенности сегмента Luxury",
            content: `
                Работа с элитной недвижимостью требует особого подхода. Премиальные лиды — это не просто контакты, 
                это верифицированные заявки от инвесторов и покупателей с чеком от 50 млн рублей. 
                Мы используем закрытые каналы трафика (Telegram Ads в каналах про инвестиции, ретаргетинг на посетителелей 
                сайтов застройщиков бизнес-класса) для генерации заявок высшего качества. 
                Конверсия таких лидов в разы выше стандартного рынка.
            `
        },
        {
            title: "Где брать клиентов риелтору в 2024 году?",
            content: `
                Эффективные каналы привлечения клиентов в недвижимости меняются. Контекстная реклама дорожает, 
                а SEO продвижение требует месяцев работы. Покупка готовых лидов становится самым быстрым способом 
                заполнить воронку продаж. Мы предлагаем пакетные решения для риелторов: от небольших тест-драйвов 
                до эксклюзивных контрактов на поставку лидов в Дубае и Москве.
                Лидогенерация под ключ снимает с вас рутину маркетинга.
            `
        },
        {
            title: "Маркетинг в недвижимости: Тренды и стратегии",
            content: `
                Успешный маркетинг агентства недвижимости строится на омниканальности. Однако, основой остается 
                качественный входящий трафик. Наши методы включают квиз-маркетинг, таргетированную рекламу 
                и контент-маркетинг. Мы помогаем агентствам настроить поток заявок на новостройки, вторичку 
                и загородную недвижимость.
            `
        }
    ];

    return (
        <section className="bg-slate-50 border-t border-slate-200 py-12 text-slate-600 border-b relative z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center justify-between cursor-pointer group select-none"
                >
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <BookOpen className="w-5 h-5" />
                        База знаний и ответы на вопросы
                    </h2>
                    <div className="p-2 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors pointer-events-none">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>

                <div className={`mt-6 grid gap-6 overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-slate-400 italic mb-4">
                        * Данный раздел предназначен для информирования клиентов об особенностях рынка лидогенерации в сфере недвижимости.
                    </p>
                    {articles.map((article, idx) => (
                        <article key={idx} className="prose prose-slate max-w-none">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{article.title}</h3>
                            <p className="text-base leading-relaxed text-slate-600 text-justify">
                                {article.content}
                            </p>
                        </article>
                    ))}
                    
                    {/* Additional Keyword Cloud for Semantic SEO (Hidden visually but readable by bots if expanded) */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Популярные запросы</h4>
                        <div className="flex flex-wrap gap-2">
                             {[
                                "Лиды на новостройки", "Купить заявки на недвижимость", "Лидогенерация Дубай", 
                                "Трафик для риелторов", "Заявки на ипотеку", "Элитная недвижимость Москва", 
                                "Маркетинг для застройщиков", "База клиентов недвижимость", "Лиды от собственников"
                             ].map((tag, i) => (
                                 <span key={i} className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-400">
                                     {tag}
                                 </span>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SEOContent;
