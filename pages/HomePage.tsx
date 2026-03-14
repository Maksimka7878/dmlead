import React from 'react';
import { PhoneCall, Check, MessageCircleQuestionMark, Send, UserX, ClipboardCheck, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRICING_DATA, GUARANTEES, PROCESS_STEPS } from '../constants';
import SEO from '../components/SEO';
import Calculator from '../components/Calculator';
import TestPacket from '../components/TestPacket';

const HomePage = () => {
    return (
        <>
            <SEO schema={[
                {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "@id": "https://dmitryleads.ru/#webpage",
                    "url": "https://dmitryleads.ru/",
                    "name": "Лиды на недвижимость | Премиальные клиенты | DmitryLeads",
                    "isPartOf": { "@id": "https://dmitryleads.ru/#website" },
                    "about": { "@id": "https://dmitryleads.ru/#organization" },
                    "inLanguage": "ru-RU",
                    "description": "Качественные лиды на недвижимость в Москве и Дубае. Премиальные клиенты, готовые к сделке."
                },
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://dmitryleads.ru/" }
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "@id": "https://dmitryleads.ru/articles#collection",
                    "url": "https://dmitryleads.ru/articles",
                    "name": "Блог DmitryLeads — лидогенерация в недвижимости",
                    "isPartOf": { "@id": "https://dmitryleads.ru/#website" },
                    "about": { "@id": "https://dmitryleads.ru/#organization" },
                    "inLanguage": "ru-RU"
                }
            ]} />
            {/* Hero Section */}
            <section className="relative pt-36 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.95] drop-shadow-sm">
                        Лиды на недвижимость <br className="hidden md:block" />
                        <span className="relative inline-block mt-2">
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 blur-2xl opacity-50 -z-10"></span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-4">
                                Высшего Класса
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-600 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
                        Мы не продаем контакты. Мы поставляем <span className="font-bold text-slate-900">готовых к сделке клиентов</span>,
                        квалифицированных по всем параметрам и ожидающих звонка от вашего брокера.
                    </p>

                    {/* Hero Grid Feature - Liquid Cards */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                title: "Без спама",
                                desc: "Отсекаем риелторов и случайные заявки",
                                icon: <UserX className="text-emerald-600 w-6 h-6" />,
                                color: "bg-emerald-50"
                            },
                            {
                                title: "Выявленные потребности",
                                desc: "Клиент полностью квалифицирован нашим колл-центром перед передачей",
                                icon: <ClipboardCheck className="text-blue-600 w-6 h-6" />,
                                color: "bg-blue-50"
                            },
                            {
                                title: "Гарантия замены лида",
                                desc: "Бесплатно меняем нецелевые лиды",
                                icon: <Zap className="text-amber-500 w-6 h-6" />,
                                color: "bg-amber-50"
                            },
                            {
                                title: "Проверенные источники",
                                desc: "Стабильный поток из надежных каналов",
                                icon: <Check className="text-purple-600 w-6 h-6" />,
                                color: "bg-purple-50"
                            }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-[2.5rem] p-10 h-full hover:bg-slate-50 transition-all duration-300 group relative overflow-hidden shadow-2xl shadow-blue-900/5 backdrop-blur-md"
                            >
                                <div className="flex h-full flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-2xl ${item.color} border border-white/70 flex items-center justify-center shadow-lg shadow-slate-200/30 group-hover:scale-105 transition-transform duration-300`}>
                                        {item.icon}
                                    </div>

                                    <div className="mt-6 flex-1 flex flex-col items-center">
                                        <h3 className="flex min-h-[4.2rem] items-center justify-center text-[1.9rem] md:text-[2rem] leading-[1.02] font-bold text-slate-900 tracking-tight max-w-[13rem]">
                                            {item.title}
                                        </h3>
                                        <p className="mt-4 text-[15px] text-slate-500 leading-[1.55] font-medium max-w-[14rem]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section - Liquid Cards */}
            <section id="process" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-20 md:flex md:justify-between md:items-end">
                        <div className="max-w-xl">
                            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Процесс работы</h2>
                            <p className="text-slate-600 text-xl font-medium">Процесс, который экономит время вашего отдела продаж. <br /> Получаете только целевых клиентов, готовых к диалогу.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PROCESS_STEPS.map((step, idx) => (
                            <div key={idx} className="bg-white rounded-[2.5rem] p-10 h-full hover:bg-slate-50 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100/50">
                                {/* Number Watermark */}
                                <div className="absolute top-4 right-6 text-9xl font-black text-blue-900/5 group-hover:text-blue-900/10 transition-colors select-none z-0">
                                    {idx + 1}
                                </div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-blue-50 border border-white flex items-center justify-center mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                                        {React.cloneElement(step.icon as React.ReactElement, { className: "w-7 h-7 text-blue-600" })}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                    <p className="text-slate-500 text-base leading-relaxed font-medium">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing & Calculator Section */}
            <section id="pricing" className="py-24 relative">
                {/* Subtle background shift */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl -z-10 clip-path-slant"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6">
                            Прайс на лиды
                        </h2>
                        <p className="text-xl text-slate-500 font-medium">Прозрачное ценообразование. Чем больше объём, тем выгоднее.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-16">
                        {/* Left: Info - Liquid Cards */}
                        <div className="h-full flex flex-col justify-between gap-8">
                            {PRICING_DATA.map((category) => (
                                <div key={category.id} className="bg-white rounded-[2.5rem] p-8 transition-transform hover:scale-[1.02] duration-500 shadow-xl shadow-blue-900/5">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                                        {category.title}
                                    </h3>
                                    <div className="grid gap-4">
                                        {category.tiers.map((tier) => (
                                            <div key={tier.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/70 hover:border-blue-300 transition-all duration-300 shadow-sm group">
                                                <div>
                                                    <div className="font-bold text-lg text-slate-900">{tier.name}</div>
                                                    <div className="text-sm text-slate-500 font-medium">{tier.description}</div>
                                                </div>
                                                <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 bg-white/50 px-2 rounded">Цена за лид</span>
                                                    <div className="font-mono font-bold text-blue-600 text-xl group-hover:scale-105 transition-transform origin-left sm:origin-right drop-shadow-sm">
                                                        {tier.price.toLocaleString('ru-RU')} ₽
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Calculator */}
                        <div className="h-full">
                            <Calculator />
                        </div>
                    </div>

                    <TestPacket />
                </div>
            </section>

            {/* Guarantee Section */}
            <section id="guarantee" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-20 space-y-6">
                        <div className="inline-block px-5 py-2 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-bold shadow-sm">
                            Гарантия качества 100%
                        </div>
                        <h2 className="max-w-5xl text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.96]">
                            <span className="block">Мы бесплатно заменяем</span>
                            <span className="mt-3 block w-fit text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                нецелевые лиды
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {GUARANTEES.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] p-10 h-full hover:bg-slate-50 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100/50">
                                <div className="flex items-start gap-5 h-full">
                                    <div className="p-4 rounded-2xl bg-white/50 border border-white/60 shadow-lg shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                                        {React.cloneElement(item.icon as React.ReactElement, { className: "w-7 h-7" })}
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.scenario}</p>
                                        <div className="mt-4 inline-flex w-fit self-start items-center gap-2 px-3 py-1.5 bg-white/40 rounded-[0.8rem] text-sm text-slate-700 font-semibold border border-white/50 shadow-sm whitespace-nowrap">
                                            <div className="flex h-7 w-7 items-center justify-center bg-emerald-500 rounded-full shrink-0">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            {item.proof}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Methods Section */}
            <section id="methods" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 text-center mb-20">
                        Источники трафика
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Telegram Ads",
                                desc: "Гипер-сегментация по интересам и каналам конкурентов.",
                                color: "bg-blue-500",
                                shadowColor: "shadow-blue-500/40",
                                icon: <Send className="w-10 h-10" />
                            },
                            {
                                title: "РСЯ",
                                desc: "Перформанс-кампании на горячий спрос в поиске.",
                                color: "bg-gradient-to-br from-red-500 to-rose-600",
                                shadowColor: "shadow-rose-500/45",
                                icon: <span className="text-[2.8rem] font-black leading-none text-white select-none">Я</span>
                            },
                            {
                                title: "Квиз-рассылки",
                                desc: "Фильтрация неплатежеспособных на этапе заявки.",
                                color: "bg-purple-500",
                                shadowColor: "shadow-purple-500/40",
                                icon: <MessageCircleQuestionMark className="w-10 h-10" />
                            },
                        ].map((method, idx) => (
                            <div key={idx} className="relative group liquid-glass rounded-[3rem] p-0 overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                                {/* Colored Glow Header */}
                                <div className={`h-24 ${method.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                                <div className="p-10 -mt-12 flex flex-col items-center text-center relative z-10">
                                    <div className={`w-24 h-24 rounded-3xl ${method.color} shadow-2xl ${method.shadowColor} flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-white/20 backdrop-blur-md`}>
                                        {method.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{method.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{method.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
