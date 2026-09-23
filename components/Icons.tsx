import React from 'react';

/** Стрелка «↗» из новой главной — у кнопок и ссылок-строк. */
export const Arrow: React.FC<{ className?: string }> = ({ className = 'ico' }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8.5 7H17v8.5" /></svg>
);
