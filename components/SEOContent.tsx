import React from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { ARTICLES } from '../data/articles';

const SEOContent = () => {
    return (
        <section className="py-12 relative z-10 flex flex-col gap-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
                
                {/* Block 1: Knowledge Base */}
                <div
                    className="liquid-glass p-6 rounded-3xl transition-all duration-300"
                >
                    <div className="flex items-center">
                        <h2 className="text-xl font-extrabold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            База знаний
                        </h2>
                    </div>

                    <div className="grid mt-8">
                        <div className="grid gap-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Полезные материалы 2026 года о квалификации лидов, пакетах заявок и работе отдела продаж в недвижимости.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {ARTICLES.map((article, idx) => (
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
            </div>
        </section>
    );
};

export default SEOContent;
