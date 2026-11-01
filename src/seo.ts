import { site } from './site';
import { content, localePath, twinPath, type Lang } from './content';

type Faq = { q: string; a: string };
const abs = (path: string) => `${site.url}${path}`;
const id = (kind: string) => `${site.url}/#${kind}`;

/** Canonical and reciprocal hreflang for a request path ('/en/x' or '/x'). */
export const alternates = (pathname: string) => {
  const clean = pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
  const ar = clean === '/en' ? '/' : clean.replace(/^\/en(?=\/)/, '');
  const url = (p: string) => (p === '/' ? `${site.url}/` : `${site.url}${p}`);
  return { path: clean, ar: url(ar), en: url(twinPath(ar)) };
};

export const business = (lang: Lang) => ({
  '@type': 'HVACBusiness',
  '@id': id('shop'),
  name: site.brand.arabic,
  alternateName: site.brand.latin,
  legalName: site.legal.name,
  url: site.url,
  telephone: site.phone.e164,
  logo: `${site.url}/logo.png`,
  image: `${site.url}/og.jpg`,
  address: { '@type': 'PostalAddress', streetAddress: '8951 Prince Abdulmohsen bin Jalawi Street, Al-Jalawiyah', addressLocality: 'Dammam', addressCountry: 'SA' },
  // ponytail: Dammam city centre, not the shop pin. Replace with the exact pin (docs/FOR-AMEER.md).
  geo: { '@type': 'GeoCoordinates', latitude: 26.4207, longitude: 50.0888 },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: site.hours.open,
    closes: site.hours.close,
  },
  areaServed: { '@type': 'City', name: lang === 'ar' ? 'الدمام' : 'Dammam' },
  hasMap: site.maps.listing,
  // sameAs left out: no social profile is confirmed (docs/FOR-AMEER.md).
});

export const faqPage = (items: Faq[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

export const service = (name: string, description: string, lang: Lang) => ({
  '@type': 'Service',
  name,
  description,
  provider: { '@id': id('shop') },
  areaServed: { '@type': 'City', name: lang === 'ar' ? 'الدمام' : 'Dammam' },
});

export const article = (headline: string, description: string, updated: string, lang: Lang) => ({
  '@type': 'Article',
  headline,
  description,
  inLanguage: lang === 'ar' ? 'ar-SA' : 'en-SA',
  // The posts were rewritten for this site, so this text was first published on the date it was last changed.
  ...(/^\d{4}-\d\d-\d\d/.test(updated) ? { datePublished: updated, dateModified: updated } : {}),
  image: `${site.url}/og.jpg`,
  author: { '@type': 'Organization', '@id': id('shop'), name: site.brand.arabic },
  publisher: { '@type': 'Organization', name: site.brand.arabic, logo: { '@type': 'ImageObject', url: `${site.url}/logo.png` } },
});

/** Home, then the section hub when there is one, then the page itself. */
export const breadcrumbs = (lang: Lang, pathname: string, title: string) => {
  const arPath = alternates(pathname).ar.slice(site.url.length) || '/';
  const parts = arPath.split('/').filter(Boolean);
  const c = content[lang] as unknown as Record<string, { h1?: string } | undefined>;
  const trail: { name: string; path: string }[] = [{ name: site.brand.latin, path: localePath(lang, '/') }];
  if (parts.length > 1) {
    const hub = c[parts[0]!]?.h1;
    if (hub) trail.push({ name: hub, path: localePath(lang, `/${parts[0]}`) });
  }
  trail.push({ name: title, path: localePath(lang, arPath) });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.path === '/' ? `${site.url}/` : abs(t.path) })),
  };
};
