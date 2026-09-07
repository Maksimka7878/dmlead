import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import LandingIndexPage from './pages/LandingIndexPage';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import { RegionProvider } from './components/RegionContext';
import { PricingModeProvider } from './components/PricingMode';

/** Роуты вынесены отдельно от Router: клиент оборачивает их в BrowserRouter,
 *  пререндер — в StaticRouter. */
export const AppRoutes: React.FC = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/lidy" element={<LandingIndexPage />} />
            <Route path="/lidy/:slug" element={<LandingPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/page/:page" element={<BlogIndexPage />} />
            <Route path="/blog/kategoriya/:cat" element={<BlogIndexPage />} />
            <Route path="/blog/kategoriya/:cat/page/:page" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            {/* Старый адрес блога — сохраняем переход, чтобы не терять ссылки */}
            <Route path="/articles" element={<Navigate to="/blog" replace />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
);

const App: React.FC<{ children?: React.ReactNode }> = () => (
    <RegionProvider>
        <PricingModeProvider>
            <AppRoutes />
        </PricingModeProvider>
    </RegionProvider>
);

export default App;
