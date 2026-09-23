import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound: React.FC = () => (
    <div className="aurora wrap flex min-h-[80vh] flex-col items-start justify-center pt-[calc(var(--nav-h)+48px)]">
        <SEO title="Страница не найдена" description="Запрошенная страница не найдена." path="/404" />
        <div className="num text-[clamp(120px,17vw,300px)] leading-[.78] text-brand">404</div>
        <h1 className="display mt-6 text-[clamp(40px,5vw,72px)]">Страница <em>не найдена</em></h1>
        <p className="lede mt-5 max-w-[46ch]">Возможно, адрес изменился. Загляните в каталог направлений, в блог или на главную.</p>
        <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/lidy" className="btn btn--accent btn--lg">Все направления</Link>
            <Link to="/blog" className="btn btn--ghost btn--lg">Блог</Link>
            <a href="/" className="btn btn--ghost btn--lg">На главную</a>
        </div>
    </div>
);

export default NotFound;
