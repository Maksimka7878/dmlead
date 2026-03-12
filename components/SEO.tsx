import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    type?: 'website' | 'article';
    schema?: object | object[];
    path?: string; // e.g. '/articles'
    noAutoSchema?: boolean; // suppress default org schema
}

// ─── Default Organization + WebSite schema injected on every page ───────────
const BASE_SCHEMAS = [
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://dmitryleads.ru/#organization",
        "name": "DmitryLeads",
        "url": "https://dmitryleads.ru",
        "logo": {
            "@type": "ImageObject",
            "url": "https://dmitryleads.ru/icon-512.png",
            "width": 512,
            "height": 512
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales",
            "url": "https://t.me/DMitryLeads",
            "availableLanguage": ["Russian", "English"]
        },
        "sameAs": ["https://t.me/DMitryLeads"],
        "areaServed": [
            { "@type": "City", "name": "Москва" },
            { "@type": "City", "name": "Дубай" }
        ]
    },
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://dmitryleads.ru/#website",
        "url": "https://dmitryleads.ru",
        "name": "DmitryLeads",
        "inLanguage": "ru-RU",
        "publisher": { "@id": "https://dmitryleads.ru/#organization" }
    },
    {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Лидогенерация в сфере недвижимости",
        "provider": { "@id": "https://dmitryleads.ru/#organization" },
        "areaServed": [
            { "@type": "City", "name": "Москва" },
            { "@type": "City", "name": "Дубай" }
        ],
        "description": "Поставка качественных лидов на недвижимость: квалифицированные клиенты готовые к сделке с гарантией замены брака.",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "RUB",
            "lowPrice": "1500",
            "highPrice": "10000",
            "offerCount": "6"
        }
    }
];

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    type = 'website',
    schema,
    path = '/',
    noAutoSchema = false,
}) => {
    const defaultTitle = "Лиды на недвижимость | Премиальные клиенты | DmitryLeads";
    const defaultDescription = "Качественные лиды на недвижимость в Москве и Дубае. Премиальные клиенты, готовые к сделке. Гарантия качества и замена брака. Таргетированная реклама и контекст.";
    const defaultKeywords = "лиды недвижимость, купить лиды недвижимость, премиальные лиды, лидогенерация недвижимость, клиенты на недвижимость, трафик недвижимость";
    const siteUrl = "https://dmitryleads.ru";
    const canonicalUrl = `${siteUrl}${path}`;
    const ogImage = `${siteUrl}/og-image.jpg`;

    // Merge base schemas with any page-specific schema
    const allSchemas = noAutoSchema
        ? (schema ? (Array.isArray(schema) ? schema : [schema]) : [])
        : [...BASE_SCHEMAS, ...(schema ? (Array.isArray(schema) ? schema : [schema]) : [])];

    return (
        <Helmet>
            {/* ── Basic ───────────────────────────────────────────────── */}
            <title>{title ? `${title} | DmitryLeads` : defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* ── Language & Locale ────────────────────────────────────── */}
            <meta property="og:locale" content="ru_RU" />
            <link rel="alternate" hrefLang="ru" href={canonicalUrl} />
            <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

            {/* ── Open Graph ───────────────────────────────────────────── */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title ? `${title} | DmitryLeads` : defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:site_name" content="DmitryLeads" />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:alt" content="DmitryLeads — Лиды на недвижимость высшего класса" />

            {/* ── Twitter / X ──────────────────────────────────────────── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@DMitryLeads" />
            <meta name="twitter:title" content={title ? `${title} | DmitryLeads` : defaultTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content="DmitryLeads — Лиды на недвижимость высшего класса" />

            {/* ── Schema.org JSON-LD ───────────────────────────────────── */}
            {allSchemas.map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
