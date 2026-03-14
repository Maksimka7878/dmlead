import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Send, Menu, X, Check, ArrowUpRight, Layers3, CalendarClock, Clock3, Building2, CreditCard, MapPin, Square, BedDouble, ClipboardList, Sparkles, Coins, ChevronDown, User } from 'lucide-react';

const TELEGRAM_URL = 'https://t.me/DMitryLeads';
const TELEGRAM_HANDLE = '@DMitryLeads';
const TELEGRAM_AVATAR_SRC = '/telegram-avatar.jpg';

const PRIMARY_QUALIFICATION_FIELDS = [
    { label: 'Район', Icon: MapPin },
    { label: 'Срок сдачи', Icon: CalendarClock },
    { label: 'Квадратура', Icon: Square },
    { label: 'Комнатность', Icon: BedDouble },
    { label: 'Срок покупки', Icon: Clock3 },
    { label: 'Цена', Icon: Coins },
];

const EXTRA_QUALIFICATION_FIELDS = [
    { label: 'Форма оплаты', Icon: CreditCard },
    { label: 'Какие ЖК смотрел', Icon: Building2 },
    { label: 'Личные пожелания по ЖК', Icon: ClipboardList },
    { label: 'Ваш вариант', Icon: Sparkles },
];

const TelegramAvatar = ({
    sizeClass,
    className = '',
    imageClassName = '',
}: {
    sizeClass: string;
    className?: string;
    imageClassName?: string;
}) => {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <div className={`relative overflow-hidden rounded-full border border-white/80 bg-gradient-to-br from-white via-blue-50/90 to-purple-50/90 shadow-[0_18px_40px_rgba(59,130,246,0.18)] ${sizeClass} ${className}`}>
            {!imageFailed ? (
                <img
                    src={TELEGRAM_AVATAR_SRC}
                    alt="Аватар Telegram"
                    className={`h-full w-full object-cover ${imageClassName}`}
                    loading="lazy"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(191,219,254,0.86)_58%,_rgba(216,180,254,0.76))] text-slate-900">
                    <span className="text-[clamp(1.1rem,2vw,1.75rem)] font-black tracking-[-0.04em]">DM</span>
                </div>
            )}
        </div>
    );
};

const Layout = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showTelegramPrompt, setShowTelegramPrompt] = useState(false);
    const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
    const location = useLocation();

    const toggleLead = (id: string) => {
        const next = new Set(expandedLeads);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedLeads(next);
    };

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(() => {
                setScrolled(window.scrollY > 50);
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const promptDismissed = window.sessionStorage.getItem('telegram-prompt-dismissed');

        if (promptDismissed === '1') {
            return;
        }

        const timer = window.setTimeout(() => {
            setShowTelegramPrompt(true);
        }, 11000);

        return () => window.clearTimeout(timer);
    }, []);

    const isHome = location.pathname === '/';

    // Helper for navigation links
    const getLink = (id: string) => {
        return isHome ? `#${id}` : `/#${id}`;
    };

    const dismissTelegramPrompt = () => {
        setShowTelegramPrompt(false);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('telegram-prompt-dismissed', '1');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F0F4F8] text-slate-900 selection:bg-blue-200 selection:text-blue-900 font-sans">

            {/* Dynamic Background - Liquid Lava Lamp */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Primary Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>

                {/* Subtle Noise Texture */}
                <div className="absolute inset-0 bg-noise-overlay opacity-30 contrast-100 brightness-100 mix-blend-overlay"></div>
            </div>

            {/* Floating Liquid Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? 'pt-5' : 'pt-7'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                    <div className={`
                        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                        flex justify-between items-center
                        ${scrolled
                            ? 'liquid-glass rounded-full px-7 py-3.5 w-auto gap-12 shadow-2xl bg-white/70'
                            : 'bg-transparent px-6 py-5 w-full max-w-6xl'}
                    `}>

                        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                            {/* Logo Text */}
                            <span className={`font-black tracking-tighter text-slate-900 transition-all duration-300 uppercase ${scrolled ? 'text-3xl' : 'text-[2.2rem]'}`}>
                                DM<span className="text-blue-600 mx-[1px]">.</span>LEADS
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <div className={`hidden md:flex items-center space-x-1 text-base font-semibold text-slate-600 ${scrolled ? 'mx-4' : 'mx-auto'}`}>
                            {['Процесс', 'Цены', 'Гарантии', 'Методы', 'Блог'].map((item) => {
                                const id = item === 'Цены' ? 'pricing' : item === 'Гарантии' ? 'guarantee' : item === 'Методы' ? 'methods' : item === 'Блог' ? 'articles' : 'process';
                                const href = item === 'Блог' ? '/articles' : getLink(id);
                                
                                if (item === 'Блог') {
                                    return (
                                        <Link
                                            key={item}
                                            to="/articles"
                                            className="px-5 py-2.5 rounded-full hover:bg-white/50 hover:text-blue-600 transition-all relative group"
                                        >
                                            {item}
                                        </Link>
                                    );
                                }

                                return (
                                    <a
                                        key={item}
                                        href={href}
                                        className="px-5 py-2.5 rounded-full hover:bg-white/50 hover:text-blue-600 transition-all relative group"
                                    >
                                        {item}
                                    </a>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href={TELEGRAM_URL}
                                target="_blank"
                                rel="noreferrer"
                                className={`hidden md:flex group relative items-center gap-2 px-7 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-0.5 ${scrolled ? 'text-base' : 'text-lg'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative z-10 flex items-center gap-2 font-bold">
                                    <Send className="w-5 h-5" />
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
                        {['Процесс', 'Цены', 'Гарантии', 'Методы', 'Блог'].map((item) => {
                            const id = item === 'Цены' ? 'pricing' : item === 'Гарантии' ? 'guarantee' : item === 'Методы' ? 'methods' : item === 'Блог' ? 'articles' : 'process';
                            
                            if (item === 'Блог') {
                                return (
                                    <Link key={item} to="/articles" onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/50 border border-white/60 text-slate-800 shadow-sm hover:scale-95 transition-transform">
                                        {item}
                                    </Link>
                                );
                            }

                            return (
                                <a key={item} href={getLink(id)} onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/50 border border-white/60 text-slate-800 shadow-sm hover:scale-95 transition-transform">
                                    {item}
                                </a>
                            );
                        })}
                        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="bg-blue-600 text-white py-4 rounded-2xl mt-4 shadow-xl shadow-blue-500/30">Написать в Telegram</a>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10">
                <Outlet />
            </main>

            {showTelegramPrompt && (
                <div className="fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-[360px] animate-fade-in sm:bottom-6 sm:right-6">
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(219,234,254,0.78),rgba(237,233,254,0.82))] p-3 shadow-[0_24px_70px_rgba(37,99,235,0.22)] backdrop-blur-xl">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_42%)]" />

                        <button
                            type="button"
                            onClick={dismissTelegramPrompt}
                            aria-label="Закрыть приглашение в Telegram"
                            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/75 text-slate-500 transition-colors hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <a
                            href={TELEGRAM_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="relative z-10 flex items-center gap-3 pr-8 transition-transform duration-300 hover:-translate-y-0.5"
                        >
                            <TelegramAvatar sizeClass="h-16 w-16 shrink-0" imageClassName="scale-[1.06]" />

                            <div className="min-w-0">
                                <div className="text-base font-bold leading-tight text-slate-900">
                                    Напишите в Telegram
                                </div>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                    Обсудим условия, подскажем по пакетам и быстро ответим по вашему запросу.
                                </p>
                            </div>

                            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg sm:flex">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </a>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="relative pt-48 pb-16 overflow-hidden">
                {/* Glass Overlay for Footer */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-white/40 backdrop-blur-3xl border-t border-white/50 -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                            Пример квалификации контакта
                        </h2>
                    </div>
                    <div className="liquid-glass rounded-[2.5rem] p-8 md:p-10 mb-24 overflow-hidden">
                        <div className="mb-8 max-w-3xl">
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Детальный портрет вашего будущего клиента
                            </h3>
                            <p className="mt-3 text-slate-600 text-base md:text-lg font-medium leading-relaxed">
                                Мы собираем максимум информации на этапе квалификации, чтобы ваши менеджеры закрывали сделки, а не тратили время на пустые звонки.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="liquid-glass !bg-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-500/5">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20">1</div>
                                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Основные параметры</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                                    {PRIMARY_QUALIFICATION_FIELDS.map((item) => (
                                        <div
                                            key={item.label}
                                            className="group relative overflow-hidden liquid-glass rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/50"
                                        >
                                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md shadow-md border border-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-4">
                                                <item.Icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="text-[15px] font-bold text-slate-800 leading-tight relative z-10">
                                                {item.label}
                                            </div>
                                            <div className="absolute -bottom-4 -right-4 p-2 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity">
                                                <item.Icon className="w-20 h-20 text-blue-600" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="liquid-glass !bg-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-emerald-500/5">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">2</div>
                                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Дополнительная квалификация</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {EXTRA_QUALIFICATION_FIELDS.map((item) => (
                                        <div
                                            key={item.label}
                                            className="group relative overflow-hidden liquid-glass rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-300/50"
                                        >
                                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-md shadow-md border border-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-4">
                                                <item.Icon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="text-[15px] font-bold text-slate-800 leading-tight relative z-10">
                                                {item.label}
                                            </div>
                                            <div className="absolute -bottom-4 -right-4 p-2 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity">
                                                <item.Icon className="w-20 h-20 text-emerald-600" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            Реальные примеры наших квалификаций
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">Нажмите на карточки, чтобы раскрыть детали запросов</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                        {/* Lead Case 1: Vyacheslav */}
                        <div 
                            onClick={() => toggleLead('vyacheslav')}
                            className={`liquid-glass !bg-blue-50/30 rounded-[2rem] p-6 md:p-8 border-blue-200/50 shadow-lg transition-all duration-500 cursor-pointer group relative overflow-hidden ${expandedLeads.has('vyacheslav') ? 'ring-2 ring-blue-500/20 shadow-blue-500/10' : 'hover:scale-[1.02] hover:bg-blue-50/50'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/10 shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 leading-tight">Вячеслав</h4>
                                        <div className="text-[13px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Премиум-запрос</div>
                                    </div>
                                </div>
                                <div className={`transition-transform duration-300 ${expandedLeads.has('vyacheslav') ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedLeads.has('vyacheslav') ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-4 text-slate-700 leading-relaxed text-[15px] pt-2 border-t border-blue-100/50">
                                    <p className="italic text-slate-500 text-sm mb-4">«Звонил Тимур, ваш личный ассистент, передал информацию:»</p>
                                    <p><span className="font-bold text-slate-900">• Цель:</span> Квартира для жизни на 20-30 лет. Нужен простор и «воздух», не менее 85-100 м².</p>
                                    <p><span className="font-bold text-slate-900">• Локация:</span> Север, Запад, р-н Динамо, Тверской, в пределе Садового кольца.</p>
                                    <p><span className="font-bold text-slate-900">• Бюджет:</span> <span className="text-blue-700 font-bold">90–100 млн ₽</span>. Рассрочка на стадии строительства.</p>
                                    <div className="mt-4 pt-4 italic text-slate-500 text-sm">
                                        «Заинтересовал ЖК «Enigma» и ЖК «Серёгина 5». Не понравился ЖК Сизар-Сити из-за очередей у лифта.»
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lead Case 2: Olga */}
                        <div 
                            onClick={() => toggleLead('olga')}
                            className={`liquid-glass !bg-emerald-50/30 rounded-[2rem] p-6 md:p-8 border-emerald-200/50 shadow-lg transition-all duration-500 cursor-pointer group relative overflow-hidden ${expandedLeads.has('olga') ? 'ring-2 ring-emerald-500/20 shadow-emerald-500/10' : 'hover:scale-[1.02] hover:bg-emerald-50/50'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10 shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 leading-tight">Ольга</h4>
                                        <div className="text-[13px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Клубный формат</div>
                                    </div>
                                </div>
                                <div className={`transition-transform duration-300 ${expandedLeads.has('olga') ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedLeads.has('olga') ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-4 text-slate-700 leading-relaxed text-[15px] pt-2 border-t border-emerald-100/50">
                                    <p className="italic text-slate-500 text-sm mb-4">«Звонил Тимур, ваш личный ассистент, передал информацию:»</p>
                                    <p><span className="font-bold text-slate-900">• Запрос:</span> 1-спальная квартира (70 м²) для себя в Центральном районе.</p>
                                    <p><span className="font-bold text-slate-900">• Бюджет:</span> <span className="text-emerald-700 font-bold">125–130 млн ₽</span>. Готова к сделке сразу.</p>
                                    <p><span className="font-bold text-slate-900">• Приоритеты:</span> Камерность, наличие паркинга. Отказалась от ЖК «Таганское».</p>
                                    <div className="mt-4 pt-4 italic text-slate-500 text-sm">
                                        «Критична близость к центру и инфраструктура, но фитнес внутри дома не принципиален.»
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lead Case 3: Maxim */}
                        <div 
                            onClick={() => toggleLead('maxim')}
                            className={`liquid-glass !bg-purple-50/30 rounded-[2rem] p-6 md:p-8 border-purple-200/50 shadow-lg transition-all duration-500 cursor-pointer group relative overflow-hidden ${expandedLeads.has('maxim') ? 'ring-2 ring-purple-500/20 shadow-purple-500/10' : 'hover:scale-[1.02] hover:bg-purple-50/50'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 shadow-lg shadow-purple-500/10 shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 leading-tight">Максим</h4>
                                        <div className="text-[13px] font-bold text-purple-600 uppercase tracking-wider mt-0.5">Инвест-решение</div>
                                    </div>
                                </div>
                                <div className={`transition-transform duration-300 ${expandedLeads.has('maxim') ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedLeads.has('maxim') ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-4 text-slate-700 leading-relaxed text-[15px] pt-2 border-t border-purple-100/50">
                                    <p className="italic text-slate-500 text-sm mb-4">«Звонил Тимур, ваш личный ассистент, передал информацию:»</p>
                                    <p><span className="font-bold text-slate-900">• Цель:</span> Перепродажа до получения ключей (бизнес- и премиум-класс, стадия pre-sale).</p>
                                    <p><span className="font-bold text-slate-900">• Объект:</span> Евро-двушки (40–50 м²) в локациях ЗАО, СЗАО, САО.</p>
                                    <p><span className="font-bold text-slate-900">• Бюджет:</span> <span className="text-purple-700 font-bold">до 40 млн ₽ за лот</span>. 100% наличные.</p>
                                    <div className="mt-4 pt-4 italic text-slate-500 text-sm">
                                        «Готов забрать сразу 2 лота под эксклюзив. Ждет конкретных цифр доходности сегодня во второй половине дня.»
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lead Case 4: Viktor */}
                        <div 
                            onClick={() => toggleLead('viktor')}
                            className={`liquid-glass !bg-amber-50/30 rounded-[2rem] p-6 md:p-8 border-amber-200/50 shadow-lg transition-all duration-500 cursor-pointer group relative overflow-hidden ${expandedLeads.has('viktor') ? 'ring-2 ring-amber-500/20 shadow-amber-500/10' : 'hover:scale-[1.02] hover:bg-amber-50/50'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-lg shadow-amber-500/10 shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 leading-tight">Виктор</h4>
                                        <div className="text-[13px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Сохранение капитала</div>
                                    </div>
                                </div>
                                <div className={`transition-transform duration-300 ${expandedLeads.has('viktor') ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedLeads.has('viktor') ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-4 text-slate-700 leading-relaxed text-[15px] pt-2 border-t border-amber-100/50">
                                    <p className="italic text-slate-500 text-sm mb-4">«Звонил Тимур, ваш личный ассистент, передал информацию:»</p>
                                    <p><span className="font-bold text-slate-900">• Цель:</span> Вывод активов из фондового рынка в недвижимость. Ищет надежный бизнес-класс (Level, MR Group, Sminex).</p>
                                    <p><span className="font-bold text-slate-900">• Объект:</span> Пул из 2-3 однокомнатных квартир в одном ЖК на старте продаж.</p>
                                    <p><span className="font-bold text-slate-900">• Бюджет:</span> <span className="text-amber-700 font-bold">до 70 млн ₽ за сделку</span>. 100% наличные сразу.</p>
                                    <div className="mt-4 pt-4 italic text-slate-500 text-sm">
                                        «Готов завтра встретиться с топ-брокером для финализации стратегии. Интересует вход на минимальной цене.»
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="liquid-glass rounded-[3rem] p-12 md:p-16 mb-16 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
                        <div className="text-center md:text-left max-w-lg">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Начнем работу?</h2>
                            <p className="text-slate-600 mb-10 text-xl font-medium leading-relaxed">
                                Напишите нам в Telegram. Мы проанализируем ваш запрос и предложим оптимальную стратегию.
                            </p>
                            <a
                                href={TELEGRAM_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-12 rounded-2xl transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 group"
                            >
                                <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                Обсудить в Telegram
                            </a>
                        </div>

                        {/* Contact Card */}
                        <div className="relative w-full max-w-[360px] overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/65 p-9 text-center shadow-2xl shadow-blue-900/5 backdrop-blur-md">
                            <div className="absolute -top-10 right-0 h-36 w-36 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-8 left-2 h-28 w-28 rounded-full bg-purple-300/15 blur-2xl pointer-events-none" />

                            <a
                                href={TELEGRAM_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative mb-6 inline-flex rounded-[2.1rem] bg-[linear-gradient(155deg,rgba(255,255,255,0.88),rgba(219,234,254,0.78),rgba(237,233,254,0.8))] p-4 shadow-[0_18px_40px_rgba(59,130,246,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(59,130,246,0.22)]"
                            >
                                <div className="rounded-[1.65rem] border border-slate-100/80 bg-white p-3">
                                    <img
                                        src="https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=https://t.me/DMitryLeads&color=2563eb"
                                        alt="Telegram QR"
                                        loading="lazy"
                                        className="h-40 w-40 opacity-95 transition-opacity group-hover:opacity-100"
                                    />
                                </div>

                                <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-1.5 shadow-lg shadow-blue-500/15">
                                    <TelegramAvatar sizeClass="h-16 w-16" imageClassName="scale-[1.08]" />
                                </div>
                            </a>

                            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Связаться напрямую</div>
                            <a
                                href={TELEGRAM_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="mb-3 block text-[1.75rem] font-black leading-none text-blue-600 transition-colors hover:text-blue-700"
                            >
                                {TELEGRAM_HANDLE}
                            </a>
                            <p className="mx-auto mb-6 max-w-[260px] text-sm leading-relaxed text-slate-600">
                                Сканируйте QR и переходите сразу в Telegram. Быстро обсудим условия и удобный формат работы.
                            </p>

                            <div className="inline-flex gap-3 items-center rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2">
                                <div className="relative">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Online</span>
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
};

export default Layout;
