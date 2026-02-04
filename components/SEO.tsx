import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: 'website' | 'article';
    schema?: object | object[];
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    type = 'website',
    schema
}) => {
    const defaultTitle = "Лиды на недвижимость | Премиальные клиенты | DmitryLeads";
    const defaultDescription = "Качественные лиды на недвижимость в Москве и Дубае. Премиальные клиенты, готовые к сделке. Гарантия качества и замена брака. Таргетированная реклама и контекст.";
    const defaultKeywords = "лиды недвижимость, купить лиды недвижимость, премиальные лиды, лидогенерация недвижимость, клиенты на недвижимость, трафик недвижимость";
    const siteUrl = "https://dmitryleads.ru";

    const jsonLd = schema ? JSON.stringify(schema) : null;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title ? `${title} | DmitryLeads` : defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={siteUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:site_name" content="DmitryLeads" />
            {/* Assuming image is static for now, could be dynamic */}
            <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />

            {/* Structured Data (Schema.org) */}
            {jsonLd && <script type="application/ld+json">{jsonLd}</script>}
        </Helmet>
    );
};

export default SEO;
