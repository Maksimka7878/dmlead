import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import FooterLinks from './FooterLinks';
import { TELEGRAM } from '../site';
import { Arrow } from './Icons';

const TELEGRAM_HANDLE = '@DMitryLeads';
const TELEGRAM_AVATAR_SRC = '/telegram-avatar.jpg';

// Главная — отдельная статическая страница (home/), поэтому на неё ведут
// обычные ссылки с полной загрузкой, а не роутер.
const NAV: { label: string; href: string; route?: boolean }[] = [
    { label: 'Как работаем', href: '/#process' },
    { label: 'Примеры лидов', href: '/#cases' },
    { label: 'Гарантии', href: '/#guarantees' },
    { label: 'Цены', href: '/#pricing' },
    { label: 'Направления', href: '/lidy', route: true },
    { label: 'Блог', href: '/blog', route: true },
];

const MENU_EXTRA = [{ label: 'Калькулятор', href: '/#calculator' }];

const QR_PATH = 'M0 0h7v1h-7zM10 0h1v1h-1zM15 0h1v1h-1zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM11 1h1v1h-1zM13 1h1v1h-1zM15 1h2v1h-2zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM9 2h2v1h-2zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h1v1h-1zM12 3h1v1h-1zM14 3h3v1h-3zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM9 4h1v1h-1zM11 4h2v1h-2zM15 4h2v1h-2zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h2v1h-2zM11 5h1v1h-1zM13 5h4v1h-4zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM9 7h2v1h-2zM12 7h1v1h-1zM14 7h3v1h-3zM0 8h1v1h-1zM3 8h1v1h-1zM5 8h2v1h-2zM8 8h1v1h-1zM10 8h1v1h-1zM14 8h4v1h-4zM19 8h1v1h-1zM1 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM10 9h2v1h-2zM16 9h4v1h-4zM24 9h1v1h-1zM0 10h2v1h-2zM3 10h2v1h-2zM6 10h1v1h-1zM8 10h1v1h-1zM10 10h2v1h-2zM13 10h1v1h-1zM16 10h2v1h-2zM19 10h2v1h-2zM23 10h2v1h-2zM0 11h3v1h-3zM4 11h1v1h-1zM8 11h2v1h-2zM11 11h1v1h-1zM13 11h4v1h-4zM18 11h1v1h-1zM20 11h1v1h-1zM3 12h2v1h-2zM6 12h1v1h-1zM10 12h1v1h-1zM12 12h2v1h-2zM15 12h5v1h-5zM21 12h1v1h-1zM23 12h2v1h-2zM1 13h1v1h-1zM3 13h2v1h-2zM7 13h1v1h-1zM9 13h4v1h-4zM15 13h1v1h-1zM17 13h3v1h-3zM21 13h2v1h-2zM24 13h1v1h-1zM0 14h1v1h-1zM4 14h3v1h-3zM12 14h1v1h-1zM14 14h1v1h-1zM16 14h1v1h-1zM19 14h2v1h-2zM22 14h1v1h-1zM24 14h1v1h-1zM1 15h2v1h-2zM8 15h3v1h-3zM12 15h5v1h-5zM20 15h1v1h-1zM23 15h1v1h-1zM0 16h2v1h-2zM3 16h2v1h-2zM6 16h1v1h-1zM11 16h2v1h-2zM16 16h7v1h-7zM8 17h1v1h-1zM10 17h1v1h-1zM13 17h4v1h-4zM20 17h2v1h-2zM24 17h1v1h-1zM0 18h7v1h-7zM9 18h1v1h-1zM12 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h2v1h-2zM23 18h2v1h-2zM0 19h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM10 19h2v1h-2zM14 19h1v1h-1zM16 19h1v1h-1zM20 19h4v1h-4zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM9 20h1v1h-1zM11 20h4v1h-4zM16 20h6v1h-6zM23 20h1v1h-1zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM8 21h1v1h-1zM10 21h2v1h-2zM13 21h1v1h-1zM16 21h1v1h-1zM19 21h4v1h-4zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM9 22h1v1h-1zM13 22h1v1h-1zM15 22h2v1h-2zM19 22h2v1h-2zM22 22h1v1h-1zM24 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM11 23h1v1h-1zM13 23h5v1h-5zM21 23h1v1h-1zM0 24h7v1h-7zM8 24h1v1h-1zM13 24h1v1h-1zM16 24h4v1h-4zM23 24h2v1h-2z';

const NavLink: React.FC<{ item: { label: string; href: string; route?: boolean }; className?: string; onClick?: () => void }> = ({ item, className, onClick }) => {
    const { pathname } = useLocation();
    const active = item.route && (pathname === item.href || pathname.startsWith(`${item.href}/`));
    const cls = [className, active ? 'is-active' : ''].filter(Boolean).join(' ') || undefined;
    return item.route ? (
        <Link to={item.href} className={cls} onClick={onClick} aria-current={active ? 'page' : undefined}>{item.label}</Link>
    ) : (
        <a href={item.href} className={cls} onClick={onClick}>{item.label}</a>
    );
};

/** Шапка: прозрачная сверху, «таблетка» при прокрутке, прячется при скролле вниз. */
const Nav: React.FC = () => {
    const [compact, setCompact] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        let last = window.scrollY;
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                setCompact(y > 40);
                if (y > last + 4 && y > window.innerHeight * 0.9) setHidden(true);
                else if (y < last - 4 || y < 60) setHidden(false);
                last = y;
                ticking = false;
            });
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        document.documentElement.style.overflow = open ? 'hidden' : '';
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <>
            <header className={`nav${compact ? ' is-compact' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
                <div className="nav__in">
                    <a className="logo" href="/" aria-label="DM.LEADS — на главную">
                        <span className="logo__mark" aria-hidden="true"><i /></span>
                        <span className="logo__word">DM<i>.</i>LEADS</span>
                    </a>
                    <nav className="nav__links" aria-label="Разделы">
                        {NAV.map((item) => <NavLink key={item.href} item={item} />)}
                    </nav>
                    <div className="nav__right">
                        <a className="btn btn--accent btn--sm" href={TELEGRAM} target="_blank" rel="noopener">Написать в Telegram</a>
                        <button
                            className="burger"
                            type="button"
                            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
                            aria-expanded={open}
                            aria-controls="menu"
                            onClick={() => setOpen(!open)}
                        >
                            <span /><span />
                        </button>
                    </div>
                </div>
            </header>

            {open && (
                <div className="menu" id="menu">
                    <nav className="menu__links" aria-label="Мобильное меню">
                        {[...NAV.slice(0, 4), ...MENU_EXTRA, ...NAV.slice(4)].map((item) => (
                            <NavLink key={item.href} item={item} onClick={() => setOpen(false)} />
                        ))}
                    </nav>
                    <div className="menu__foot">
                        <a className="btn btn--accent btn--block" href={TELEGRAM} target="_blank" rel="noopener">Обсудить в Telegram</a>
                        <span>{TELEGRAM_HANDLE}</span>
                    </div>
                </div>
            )}
        </>
    );
};

const Contact: React.FC<{ onCopy: () => void }> = ({ onCopy }) => (
    <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="wrap contact__grid">
            <div className="contact__copy">
                <h2 className="contact__title" id="contact-title">Начнём <em className="grad-text">работу?</em></h2>
                <p className="lede max-w-[46ch] mb-2.5">Напишите нам в Telegram. Мы проанализируем ваш запрос и предложим оптимальную стратегию.</p>
                <a className="btn btn--accent btn--xl" href={TELEGRAM} target="_blank" rel="noopener">Обсудить в Telegram <Arrow /></a>
            </div>
            <div className="contact__side">
                <div className="contact__rings" aria-hidden="true"><i /><i /><i /><i /></div>
                <div className="tg-card">
                    <a className="tg-card__qr" href={TELEGRAM} target="_blank" rel="noopener" aria-label={`QR-код: Telegram ${TELEGRAM_HANDLE}`}>
                        <svg viewBox="-2 -2 29 29" shapeRendering="crispEdges" aria-hidden="true">
                            <rect x="-2" y="-2" width="29" height="29" fill="#FFFFFF" />
                            <path d={QR_PATH} fill="#0F172A" />
                        </svg>
                    </a>
                    <div className="tg-card__info">
                        <span className="status"><i />Сейчас на связи</span>
                        <p className="tg-card__handle">{TELEGRAM_HANDLE}</p>
                        <button type="button" className="copy" onClick={onCopy}>Скопировать ник</button>
                        <p className="tg-card__text">Сканируйте QR и переходите сразу в Telegram. Быстро обсудим условия и удобный формат работы.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

/** Большая надпись DM.LEADS в подвале: подгоняем кегль под ширину экрана. */
const FooterMark: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const mark = ref.current;
        const span = mark?.querySelector('span');
        if (!mark || !span) return;
        const fit = () => {
            const cs = getComputedStyle(mark);
            const avail = mark.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            mark.style.fontSize = '200px';
            const w = span.getBoundingClientRect().width || 1;
            mark.style.fontSize = `${Math.min(560, Math.floor((200 * avail) / w))}px`;
        };
        fit();
        document.fonts?.ready.then(fit);
        window.addEventListener('resize', fit);
        return () => window.removeEventListener('resize', fit);
    }, []);
    return <div className="footer__mark" aria-hidden="true" ref={ref}><span>DM<i>.</i>LEADS</span></div>;
};

/** Виджет «Напишите в Telegram»: появляется через 7 с или после прокрутки,
 *  сворачивается в аватар, уходит с дороги у блока контактов и подвала. */
const TelegramWidget: React.FC = () => {
    const [shown, setShown] = useState(false);
    const [min, setMin] = useState(false);
    const [away, setAway] = useState(false);
    const KEY = 'dm-tgw';

    const put = (v: string) => { try { sessionStorage.setItem(KEY, v); } catch { /* private mode */ } };

    useEffect(() => {
        let done = false;
        const show = () => {
            if (done) return;
            done = true;
            let saved: string | null = null;
            try { saved = sessionStorage.getItem(KEY); } catch { /* private mode */ }
            if (saved === 'min') setMin(true);
            setShown(true);
            if (saved !== 'min' && window.matchMedia('(max-width: 640px)').matches) {
                window.setTimeout(() => setMin(true), 10000);
            }
        };
        const timer = window.setTimeout(show, 7000);
        const onScroll = () => { if (window.scrollY > window.innerHeight * 0.7) show(); };
        window.addEventListener('scroll', onScroll, { passive: true });

        const zones = new Map<Element, boolean>();
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => zones.set(en.target, en.isIntersecting));
            setAway([...zones.values()].some(Boolean));
        }, { rootMargin: '0px 0px -40% 0px' });
        document.querySelectorAll('.contact, .footer').forEach((el) => io.observe(el));

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('scroll', onScroll);
            io.disconnect();
        };
    }, []);

    const cls = ['tgw', shown && 'is-in', min && 'is-min', away && 'is-away'].filter(Boolean).join(' ');

    return (
        <aside className={cls} aria-label="Связаться в Telegram">
            <div className="tgw__card">
                <a className="tgw__link" href={TELEGRAM} target="_blank" rel="noopener">
                    <span className="tgw__ava"><img src={TELEGRAM_AVATAR_SRC} alt="" width={60} height={60} decoding="async" /><i /></span>
                    <span className="tgw__body">
                        <b>Напишите в Telegram</b>
                        <span>Обсудим условия, подскажем по пакетам и быстро ответим по вашему запросу.</span>
                    </span>
                    <span className="tgw__go" aria-hidden="true"><Arrow /></span>
                </a>
                <button className="tgw__close" type="button" aria-label="Свернуть" onClick={() => { setMin(true); put('min'); }}>
                    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
            </div>
            <button className="tgw__bubble" type="button" aria-label="Написать в Telegram" onClick={() => { setMin(false); put('open'); }}>
                <img src={TELEGRAM_AVATAR_SRC} alt="" width={60} height={60} decoding="async" /><i />
            </button>
        </aside>
    );
};

/** Нижняя кнопка на телефоне: видна после первого экрана, прячется у контактов. */
const Dock: React.FC = () => {
    const [on, setOn] = useState(false);
    useEffect(() => {
        let ctaVisible = false;
        const update = () => setOn(!ctaVisible && window.scrollY > window.innerHeight * 0.85);
        const seen = new Set<Element>();
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
            ctaVisible = seen.size > 0;
            update();
        });
        document.querySelectorAll('.contact, .footer').forEach((el) => io.observe(el));
        window.addEventListener('scroll', update, { passive: true });
        return () => { io.disconnect(); window.removeEventListener('scroll', update); };
    }, []);
    return <a className={`dock btn btn--accent${on ? ' is-on' : ''}`} href={TELEGRAM} target="_blank" rel="noopener">Обсудить в Telegram</a>;
};

const Layout = () => {
    const [toast, setToast] = useState('');
    const { pathname } = useLocation();

    // Роутер не сбрасывает прокрутку сам — при переходе между страницами начинаем сверху.
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

    useEffect(() => {
        if (!toast) return;
        const t = window.setTimeout(() => setToast(''), 2400);
        return () => window.clearTimeout(t);
    }, [toast]);

    const copyHandle = () => {
        navigator.clipboard?.writeText(TELEGRAM_HANDLE).then(
            () => setToast(`Ник ${TELEGRAM_HANDLE} скопирован`),
            () => setToast(TELEGRAM_HANDLE),
        );
    };

    return (
        <>
            <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[400] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2.5 focus:text-white" href="#main">
                Перейти к содержанию
            </a>
            <Nav />
            <main id="main">
                <Outlet />
                <Contact onCopy={copyHandle} />
            </main>
            <footer className="footer">
                <div className="wrap">
                    <FooterLinks />
                </div>
                <div className="wrap footer__top">
                    <nav className="footer__nav" aria-label="Главная страница">
                        {[...NAV.slice(0, 4), ...MENU_EXTRA].map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
                    </nav>
                    <a className="footer__tg" href={TELEGRAM} target="_blank" rel="noopener">Telegram <b>{TELEGRAM_HANDLE}</b></a>
                </div>
                <FooterMark />
                <div className="wrap footer__bottom">
                    <span>© {new Date().getFullYear()} DmitryLeads. Premium Real Estate Traffic.</span>
                    <a href="#main" className="to-top">Наверх <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg></a>
                </div>
            </footer>
            <TelegramWidget />
            <Dock />
            {toast && <div className="toast" role="status">{toast}</div>}
        </>
    );
};

export default Layout;
