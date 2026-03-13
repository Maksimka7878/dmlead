import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';

const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/articles"
                        element={
                            <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-500">Загрузка блога...</div>}>
                                <ArticlesPage />
                            </Suspense>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
