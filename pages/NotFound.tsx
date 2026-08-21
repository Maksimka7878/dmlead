import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound: React.FC = () => (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <SEO title="Страница не найдена" description="Запрошенная страница не найдена." path="/404" />
        <div className="text-6xl font-black text-slate-200">404</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Страница не найдена</h1>
        <p className="mt-2 max-w-md text-slate-500">
            Возможно, адрес изменился. Загляните в каталог услуг или в блог.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/lidy" className="rounded-2xl px-6 py-3 font-semibold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                Каталог услуг
            </Link>
            <Link to="/blog" className="rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-700">
                Блог
            </Link>
        </div>
    </div>
);

export default NotFound;
