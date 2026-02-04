import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Send, Menu, X, Check } from 'lucide-react';

const Layout = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    // Helper for navigation links
    const getLink = (id: string) => {
        return isHome ? `#${id}` : `/#${id}`;
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

                        <a href="/" className="flex items-center gap-3 group cursor-pointer">
                            {/* Logo Text */}
                            <span className="text-2xl font-black tracking-tighter text-slate-900 transition-all duration-300 uppercase">
                                DM<span className="text-blue-600 mx-[1px]">.</span>LEADS
                            </span>
                        </a>

                        {/* Desktop Links */}
                        <div className={`hidden md:flex items-center space-x-1 text-sm font-semibold text-slate-600 ${scrolled ? 'mx-4' : 'mx-auto'}`}>
                            {['Процесс', 'Гарантии', 'Цены', 'Методы'].map((item) => {
                                const id = item === 'Цены' ? 'pricing' : item === 'Гарантии' ? 'guarantee' : item === 'Методы' ? 'methods' : 'process';
                                return (
                                    <a
                                        key={item}
                                        href={getLink(id)}
                                        className="px-5 py-2 rounded-full hover:bg-white/50 hover:text-blue-600 transition-all relative group"
                                    >
                                        {item}
                                    </a>
                                );
                            })}
                            <a href="/articles" className="px-5 py-2 rounded-full hover:bg-white/50 hover:text-blue-600 transition-all relative group">
                                Блог
                            </a>
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
                        {['Процесс', 'Гарантии', 'Цены', 'Методы'].map((item) => {
                            const id = item === 'Цены' ? 'pricing' : item === 'Гарантии' ? 'guarantee' : item === 'Методы' ? 'methods' : 'process';
                            return (
                                <a key={item} href={getLink(id)} onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/50 border border-white/60 text-slate-800 shadow-sm hover:scale-95 transition-transform">
                                    {item}
                                </a>
                            );
                        })}
                        <a href="/articles" onClick={() => setMobileMenuOpen(false)} className="p-4 rounded-2xl bg-white/50 border border-white/60 text-slate-800 shadow-sm hover:scale-95 transition-transform">
                            Блог
                        </a>
                        <a href="https://t.me/DMitryLeads" className="bg-blue-600 text-white py-4 rounded-2xl mt-4 shadow-xl shadow-blue-500/30">Написать в Telegram</a>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10">
                <Outlet />
            </main>

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
};

export default Layout;
