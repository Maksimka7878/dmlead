import React, { useEffect, useState, Suspense } from 'react';
import { PhoneCall, Check, BarChart3, ShieldCheck, Target, Send, ChevronRight, Zap, PlayCircle, Menu, X, ArrowUpRight, BadgeCheck } from 'lucide-react';
import { PRICING_DATA, GUARANTEES, PROCESS_STEPS } from './constants';

const Calculator = React.lazy(() => import('./components/Calculator'));
const TestPacket = React.lazy(() => import('./components/TestPacket'));
const SEOContent = React.lazy(() => import('./components/SEOContent'));

function App() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F0F4F8] text-slate-900 selection:bg-blue-200 selection:text-blue-900">

            {/* Dynamic Background - Liquid Lava Lamp */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Primary Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>

                {/* Subtle Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 contrast-100 brightness-100 mix-blend-overlay"></div>
            </div>

            {/* Floating Liquid Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'pt-4' : 'pt-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className={`
             transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
             flex justify-between items-center
             ${scrolled
                            ? 'liquid-glass rounded-full px-6 py-3 w-auto gap-12 shadow-2xl bg-white/70'
                            : 'bg-transparent px-6 py-4 w-full max-w-6xl'}
          `}>

                        <div className="flex items-center gap-3 group cursor-pointer">
                            {/* Logo Text */}
                            <span className="text-2xl font-black tracking-tighter text-slate-900 transition-all duration-300 uppercase">
                                DM<span className="text-blue-600 mx-[1px]">.</span>LEADS
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className={`hidden md:flex items-center space-x-1 text-sm font-semibold text-slate-600 ${scrolled ? 'mx-4' : 'mx-auto'}`}>
                            {['Процесс', 'Гарантии', 'Цены', 'Методы'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item === 'Цены' ? 'pricing' : item === 'Гарантии' ? 'guarantee' : item === 'Методы' ? 'methods' : 'process'}`}
                                    className="px-5 py-2 rounded-full hover:bg-white/50 hover:text-blue-600 transition-all relative group"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href="https://t.me/DMitryLeads"
                                target="_blank"
                                rel="noreferrer"
                                className={`hidden md:flex group relative items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-0.5 ${scrolled ? 'text-sm' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative z-10 flex items-center gap-2 font-bold">
                                    <Send className="w-4 h-4" />
                                    Telegram
                                </span>
                            </a>

                            {/* Mobile Toggle */}
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 text-slate-900 shadow-sm">
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-3xl pt-28 px-6 md:hidden animate-fade-in">
                    <div className="flex flex-col space-y-4 text-xl font-bold text-center">
                        {['Процесс', 'Гарантии', 'Цены', 'Методы'].map((item) => (
                            <a key={item} href={`#${item}`} onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/50 border border-white/60 text-slate-800 shadow-sm hover:scale-95 transition-transform">
                                {item}
                            </a>
                        ))}
                        <a href="https://t.me/DMitryLeads" className="bg-blue-600 text-white py-4 rounded-2xl mt-4 shadow-xl shadow-blue-500/30">Написать в Telegram</a>
                    </div>
                </div>
            )}

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
                        квалифицированных по бюджету и срокам.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <a href="#pricing" className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-[2rem] transition-all hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] shadow-[0_10px_20px_-10px_rgba(59,130,246,0.4)] overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                Рассчитать стоимость <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </a>
                        <a href="#guarantee" className="px-10 py-5 bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/60 text-slate-700 text-lg font-bold rounded-[2rem] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Политика гарантий
                        </a>
                    </div>

                    {/* Hero Grid Feature - Liquid Bubbles */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {[
                            { text: "Без спама", icon: <ShieldCheck className="text-emerald-600 w-6 h-6" />, color: "bg-emerald-50" },
                            { text: "Квалификация", icon: <Target className="text-blue-600 w-6 h-6" />, color: "bg-blue-50" },
                            { text: "Замена брака", icon: <Zap className="text-amber-500 w-6 h-6" />, color: "bg-amber-50" },
                            { text: "Белые каналы", icon: <Check className="text-purple-600 w-6 h-6" />, color: "bg-purple-50" }
                        ].map((item, i) => (
                            <div key={i} className="liquid-glass rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/60 transition-all duration-300 group cursor-default">
                                <div className={`p-4 rounded-full ${item.color} shadow-inner group-hover:scale-110 transition-transform duration-300 border border-white/50`}>
                                    {item.icon}
                                </div>
                                <span className="text-base font-bold text-slate-700">{item.text}</span>
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
                            <p className="text-slate-600 text-xl font-medium">Прозрачный путь от заявки до сделки. <br /> Никаких черных ящиков.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PROCESS_STEPS.map((step, idx) => (
                            <div key={idx} className="group relative liquid-glass rounded-[2.5rem] p-8 hover:-translate-y-2 transition-transform duration-500">
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
                        <div className="space-y-8 flex flex-col justify-between">
                            {PRICING_DATA.map((category) => (
                                <div key={category.id} className="liquid-glass rounded-[2.5rem] p-8 transition-transform hover:scale-[1.02] duration-500">
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
                            <Suspense fallback={<div className="h-full min-h-[400px] flex items-center justify-center text-slate-400 bg-white/20 rounded-3xl backdrop-blur-sm">Загрузка калькулятора...</div>}>
                                <Calculator />
                            </Suspense>
                        </div>
                    </div>

                    <Suspense fallback={<div className="h-48 flex items-center justify-center text-slate-400">Загрузка предложения...</div>}>
                        <TestPacket />
                    </Suspense>
                </div>
            </section>

            {/* Guarantee Section */}
            <section id="guarantee" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-20">
                        <div className="inline-block px-5 py-2 rounded-full bg-emerald-100/80 backdrop-blur-sm border border-emerald-200 text-emerald-800 text-sm font-bold mb-6 shadow-sm">
                            Гарантия качества 100%
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 max-w-3xl leading-tight">
                            Мы бесплатно заменяем <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">нецелевые лиды</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {GUARANTEES.map((item) => (
                            <div key={item.id} className="liquid-glass rounded-[2.5rem] p-10 hover:bg-white/60 transition-all duration-500 group">
                                <div className="flex items-start gap-8">
                                    <div className="p-5 rounded-3xl bg-white/50 border border-white/60 shadow-lg shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                                        {React.cloneElement(item.icon as React.ReactElement, { className: "w-8 h-8" })}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <p className="text-slate-600 mb-6 leading-relaxed font-medium">{item.scenario}</p>
                                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/40 rounded-xl text-xs text-slate-700 font-bold border border-white/50 shadow-sm">
                                            <div className="p-1 bg-emerald-500 rounded-full">
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
                            { title: "Telegram Ads", desc: "Гипер-сегментация по интересам и каналам конкурентов.", color: "bg-blue-500", icon: <Send /> },
                            { title: "Яндекс Директ", desc: "Перформанс-кампании на горячий спрос в поиске.", color: "bg-amber-500", icon: <Target /> },
                            { title: "Квиз-маркетинг", desc: "Фильтрация неплатежеспособных на этапе заявки.", color: "bg-purple-500", icon: <BarChart3 /> },
                        ].map((method, idx) => (
                            <div key={idx} className="relative group liquid-glass rounded-[3rem] p-0 overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                                {/* Colored Glow Header */}
                                <div className={`h-24 ${method.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                                <div className="p-10 -mt-12 flex flex-col items-center text-center relative z-10">
                                    <div className={`w-24 h-24 rounded-3xl ${method.color} shadow-2xl shadow-${method.color}/40 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-white/20 backdrop-blur-md`}>
                                        {React.cloneElement(method.icon as React.ReactElement, { className: "w-10 h-10" })}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{method.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{method.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Invisible Blog Section for SEO */}
            {/* Invisible Blog Section for SEO */}
            <Suspense fallback={null}>
                <SEOContent />
            </Suspense>

            {/* Footer */}
            <footer className="relative pt-32 pb-16 overflow-hidden">
                {/* Glass Overlay for Footer */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-white/40 backdrop-blur-3xl border-t border-white/50 -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="liquid-glass rounded-[3rem] p-12 md:p-16 mb-16 flex flex-col md:flex-row justify-between items-center gap-16">
                        <div className="text-center md:text-left max-w-xl">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Начнем работу?</h2>
                            <p className="text-slate-600 mb-10 text-xl font-medium leading-relaxed">
                                Напишите нам в Telegram. Мы проанализируем ваш запрос и предложим оптимальную стратегию.
                            </p>
                            <a
                                href="https://t.me/DMitryLeads"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-12 rounded-2xl transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 group"
                            >
                                <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                Обсудить в Telegram
                            </a>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white/60 border border-white/60 p-10 rounded-[2.5rem] text-center md:text-right min-w-[320px] flex flex-col items-center md:items-end shadow-2xl shadow-blue-900/5 backdrop-blur-md">
                            <a href="https://t.me/DMitryLeads" target="_blank" rel="noreferrer" className="block bg-white p-4 rounded-3xl shadow-lg border border-slate-100 mb-8 hover:scale-105 transition-transform group">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://t.me/DMitryLeads&color=2563eb"
                                    alt="Telegram QR"
                                    loading="lazy"
                                    className="w-36 h-36 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                            </a>
                            <div className="text-xs text-slate-400 mb-3 uppercase tracking-widest font-bold">Контакт</div>
                            <a href="https://t.me/DMitryLeads" className="text-3xl font-black text-blue-600 mb-6 font-mono hover:text-blue-700 transition-colors">@DMitryLeads</a>
                            <div className="flex justify-center md:justify-end gap-3 items-center bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                                <div className="relative">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                                </div>
                                <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center text-slate-500 text-sm font-medium">
                        <span>&copy; {new Date().getFullYear()} DmitryLeads. Premium Real Estate Traffic.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;