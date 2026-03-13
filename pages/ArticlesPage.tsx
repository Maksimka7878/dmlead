import React from 'react';
import { ChevronLeft, BookOpen, Calendar, Tag } from 'lucide-react';
import { ARTICLES } from '../data/articles';

import SEO from '../components/SEO';

const ArticlesPage = () => {
    return (
        <div className="pt-24 pb-20"> {/* Standard Padding within Layout */}
            <SEO
                title="Блог о лидогенерации"
                description="Экспертные статьи о лидах на недвижимость в 2026 году: квалификация, пакеты, передача лида и замена нецелевых заявок."
                keywords="блог лидогенерация, статьи риелторам, маркетинг недвижимость, лиды на недвижимость 2026, квалификация лидов, лиды новостройки"
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
                        "description": "Экспертные статьи о квалификации лидов, пакетах заявок, скорости передачи и замене нецелевых лидов в недвижимости.",
                        "publisher": { "@id": "https://dmitryleads.ru/#organization" },
                        "blogPost": ARTICLES.map(a => ({
                            "@type": "BlogPosting",
                            "headline": a.title,
                            "description": a.summary,
                            "datePublished": a.isoDate,
                            "articleSection": a.category,
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
                        Актуальные статьи 2026 года о квалификации лидов, пакетах заявок и воронке продаж в недвижимости.
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

                                <p className="text-lg text-slate-500 font-medium mb-6 max-w-3xl">
                                    {article.summary}
                                </p>

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
