import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const SEOContent = () => {
    const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
    const [isFAQOpen, setIsFAQOpen] = useState(false);

    const articles = [
        {
            title: "Лиды на недвижимость: Как выбрать качественного поставщика",
            content: `Покупка лидов на недвижимость — ключевой элемент стратегии роста для агентств и застройщиков. В отличие от холодных звонков, качественные лиды на недвижимость обеспечивают поток клиентов, которые уже заинтересованы в покупке. Важно разделять "мусорный" трафик и премиальные лиды.`
        },
        {
            title: "Премиальные лиды в недвижимости: Особенности сегмента Luxury",
            content: `Работа с элитной недвижимостью требует особого подхода. Премиальные лиды — это не просто контакты, это верифицированные заявки от инвесторов и покупателей с чеком от 50 млн рублей.`
        },
        {
            title: "Где брать клиентов риелтору в 2024 году?",
            content: `Эффективные каналы привлечения клиентов в недвижимости меняются. Контекстная реклама дорожает, а SEO продвижение требует месяцев работы. Покупка готовых лидов становится самым быстрым способом.`
        },
        {
            title: "Маркетинг в недвижимости: Тренды и стратегии",
            content: `Успешный маркетинг агентства недвижимости строится на омниканальности. Однако, основой остается качественный входящий трафик. Наши методы включают квиз-маркетинг.`
        }
    ];

    const faqs = [
        {
            q: "Какова средняя конверсия ваших лидов?",
            a: "В сегменте бизнес-класса средняя конверсия в целевой звонок составляет 60-70%, в сделку — от 3% до 8% в зависимости от профессионализма вашего отдела продаж."
        },
        {
            q: "Есть ли гарантия на замену брака?",
            a: "Да, мы предоставляем 100% гарантию на замену неликвидных лидов (недозвоны, не тот регион, неверный номер) в течение 48 часов после передачи."
        },
        {
            q: "С какими регионами вы работаете?",
            a: "Основная специализация — Москва (МСК + МО), Санкт-Петербург и ОАЭ (Дубай, Абу-Даби). Также возможна генерация под конкретные ЖК в регионах-миллионниках."
        }
    ];

    return (
        <section className="py-12 relative z-10 flex flex-col gap-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
                
                {/* Block 1: Knowledge Base */}
                <div
                    onClick={() => setIsKnowledgeOpen(!isKnowledgeOpen)}
                    className="liquid-glass p-6 rounded-3xl cursor-pointer group select-none transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            База знаний
                        </h2>
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            {isKnowledgeOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </div>
                    </div>

                    <div className={`grid overflow-hidden transition-all duration-700 ease-in-out ${isKnowledgeOpen ? 'max-h-[1000px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                        <div className="grid gap-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Полезные статьи и аналитика рынка недвижимости для профессионалов.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {articles.map((article, idx) => (
                                    <a 
                                        key={idx} 
                                        href="/articles" 
                                        className="flex flex-col p-5 bg-white/60 hover:bg-white rounded-2xl border border-white/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group"
                                    >
                                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                            {article.title}
                                        </span>
                                        <div className="mt-auto flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
                                            Читать <ChevronDown className="-rotate-90 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="text-center">
                                <a 
                                    href="/articles" 
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Все статьи <ChevronDown className="-rotate-90 w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Block 2: FAQ */}
                <div
                    onClick={() => setIsFAQOpen(!isFAQOpen)}
                    className="liquid-glass p-6 rounded-3xl cursor-pointer group select-none transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-extrabold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                <ChevronDown className="w-6 h-6" />
                            </div>
                            Частые вопросы (FAQ)
                        </h2>
                        <div className="p-2 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            {isFAQOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </div>
                    </div>

                    <div className={`grid overflow-hidden transition-all duration-700 ease-in-out ${isFAQOpen ? 'max-h-[1000px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                        <div className="grid gap-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="p-5 bg-white/40 rounded-2xl border border-white/60">
                                    <h4 className="font-bold text-slate-800 mb-2">{faq.q}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                            
                            {/* Semantic SEO Tag Cloud inside FAQ or below */}
                            <div className="mt-4 pt-6 border-t border-slate-200/50">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Лиды на новостройки", "Купить заявки", "Лидогенерация", "Трафик для риелторов"
                                    ].map((tag, i) => (
                                        <span key={i} className="text-[10px] px-3 py-1 bg-white/80 border border-white rounded-full text-slate-400 uppercase font-black tracking-tighter">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SEOContent;
