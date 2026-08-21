import { ContentPage, pagePath } from './types';
import { SITE_URL, ORG_ID, url } from '../site';

const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: url(it.path),
  })),
});

const faqSchema = (page: ContentPage) =>
  page.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

/** JSON-LD для страницы. Разный тип для статьи и коммерческой посадочной:
 *  смешивать Article и Service на одной странице — прямой путь к тому, что
 *  поисковик проигнорирует оба. */
export const pageSchema = (page: ContentPage): object[] => {
  const path = pagePath(page);
  const out: object[] = [];

  if (page.kind === 'article') {
    out.push(breadcrumb([
      { name: 'Главная', path: '/' },
      { name: 'Блог', path: '/blog' },
      { name: page.h1, path },
    ]));
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url(path)}#article`,
      headline: page.title,
      name: page.h1,
      description: page.description,
      articleSection: page.category,
      datePublished: page.isoDate,
      dateModified: page.updatedIso ?? page.isoDate,
      inLanguage: 'ru-RU',
      wordCount: undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url(path) },
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      image: `${SITE_URL}/og-image.jpg`,
      keywords: page.keywords.join(', '),
    });
  } else {
    out.push(breadcrumb([
      { name: 'Главная', path: '/' },
      { name: 'Услуги', path: '/lidy' },
      { name: page.h1, path },
    ]));
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url(path)}#service`,
      name: page.h1,
      description: page.description,
      serviceType: 'Лидогенерация в сфере недвижимости',
      provider: { '@id': ORG_ID },
      inLanguage: 'ru-RU',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'RUB',
        lowPrice: '4000',
        highPrice: '17000',
        offerCount: '6',
        url: url(path),
      },
    });
  }

  const faq = faqSchema(page);
  if (faq) out.push(faq);
  return out;
};
