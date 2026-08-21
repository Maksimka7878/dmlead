import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const tree = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Страницы отдаются пререндером как готовый HTML — гидратируем его,
// а не перерисовываем с нуля.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, tree);
} else {
  ReactDOM.createRoot(rootElement).render(tree);
}
