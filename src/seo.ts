import { site } from './site';
import { content, localePath, twinPath, type Lang } from './content';

type Faq = { q: string; a: string };
type Named = { slug?: string; name?: string; h1?: string };
const abs = (path: string) => `${site.url}${path}`;
const locale = (lang: Lang) => (lang === 'ar' ? 'ar-SA' : 'en-SA');
const businessName = (lang: Lang) => (lang === 'ar' ? site.brand.arabic : site.brand.english);

/** Node ids. One business for the whole site, one WebSite per language. */
export const ids = {
  business: `${site.url}/#business`,
  website: (lang: Lang) => (lang === 'ar' ? `${site.url}/#website` : `${site.url}/en#website`),
};

/** Canonical and reciprocal hreflang for a request path ('/en/x' or '/x'). */
export const alternates = (pathname: string) => {
  const clean = pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
  const ar = clean === '/en' ? '/' : clean.replace(/^\/en(?=\/)/, '');
  const url = (p: string) => (p === '/' ? `${site.url}/` : `${site.url}${p}`);
  return { path: clean, ar: url(ar), en: url(twinPath(ar)) };
};

/** Pages that carry the full HVACBusiness node: home, contact, about and the Dammam area page. Every other page points at it by @id. */
export const carriesBusiness = (pathname: string) => {
  const ar = alternates(pathname).ar.slice(site.url.length) || '/';
  return ['/', '/contact', '/about', '/areas/appliance-repair-in-dammam'].includes(ar);
};

export const business = (lang: Lang) => {
  const a = site.address[lang];
  const other = lang === 'ar' ? site.brand.english : site.brand.arabic;
  return {
    '@type': 'HVACBusiness',
    '@id': ids.business,
    name: businessName(lang),
    alternateName: [other, site.brand.englishAlt],
    legalName: site.legal.name,
    url: `${site.url}/`,
    logo: abs(site.images.logo),
    image: abs(site.images.og),
    telephone: site.phone.e164,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: a.streetAddress, postalCode: site.postalCode, addressLocality: a.city, addressRegion: a.region, addressCountry: site.address.countryCode },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude },
    hasMap: site.maps.listing,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: site.hours.open,
      closes: site.hours.close,
    },
    areaServed: { '@type': 'City', name: a.city },
    contactPoint: { '@type': 'ContactPoint', telephone: site.phone.e164, email: site.email, contactType: 'customer service', availableLanguage: ['ar', 'en'] },
    knowsAbout: content[lang].services.items.map((s) => s.name),
    identifier: { '@type': 'PropertyValue', propertyID: lang === 'ar' ? 'السجل التجاري' : 'Commercial registration', value: site.legal.cr },
    sameAs: [...site.sameAs],
  };
};

/** WebSite and WebPage: on every page. */
export const pageNodes = (lang: Lang, pathname: string, title: string, description: string) => {
  const url = lang === 'ar' ? alternates(pathname).ar : alternates(pathname).en;
  return [
    {
      '@type': 'WebSite',
      '@id': ids.website(lang),
      url: lang === 'ar' ? `${site.url}/` : `${site.url}/en`,
      name: businessName(lang),
      alternateName: lang === 'ar' ? site.brand.english : site.brand.arabic,
      inLanguage: locale(lang),
      publisher: { '@id': ids.business },
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': ids.website(lang) },
      about: { '@id': ids.business },
      inLanguage: locale(lang),
    },
  ];
};

export const faqPage = (items: Faq[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

export const service = (name: string, description: string, lang: Lang) => ({
  '@type': 'Service',
  name,
  description,
  provider: { '@id': ids.business },
  areaServed: { '@type': 'City', name: site.address[lang].city },
});

const months: Record<string, number> = {
  يناير: 1, فبراير: 2, مارس: 3, أبريل: 4, ابريل: 4, مايو: 5, يونيو: 6, يوليو: 7, أغسطس: 8, اغسطس: 8, سبتمبر: 9, أكتوبر: 10, اكتوبر: 10, نوفمبر: 11, ديسمبر: 12,
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};
/** '2026-11-01', '1 نوفمبر 2026' or '1 November 2026' to an ISO date. Anything else: undefined. */
export const isoDate = (text: string): string | undefined => {
  const iso = text.match(/^\d{4}-\d\d-\d\d/)?.[0];
  if (iso) return iso;
  const m = text.trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  const month = m && months[m[2]!.toLowerCase()];
  return m && month ? `${m[3]}-${String(month).padStart(2, '0')}-${m[1]!.padStart(2, '0')}` : undefined;
};

export const article = (headline: string, description: string, updated: string, lang: Lang) => {
  const date = isoDate(updated);
  return {
    '@type': 'Article',
    headline,
    description,
    inLanguage: locale(lang),
    // The posts were rewritten for this site, so this text was first published on the date it was last changed.
    ...(date ? { datePublished: date, dateModified: date } : {}),
    image: abs(site.images.og),
    author: { '@type': 'Organization', '@id': ids.business, name: businessName(lang) },
    publisher: { '@type': 'Organization', name: businessName(lang), logo: { '@type': 'ImageObject', url: abs(site.images.logo) } },
  };
};

/** The page's name in a breadcrumb: the item's own name when the content has one, else the title. */
const crumbName = (lang: Lang, section: string, slug: string, fallback: string) => {
  const c = content[lang] as unknown as Record<string, { items?: Named[]; more?: Named[] } | undefined>;
  const list = [...(c[section]?.items ?? []), ...(c[section]?.more ?? [])];
  const item = list.find((i) => i.slug === slug);
  if (!item) return fallback;
  return (section === 'services' || section === 'faults' ? item.name ?? item.h1 : item.h1 ?? item.name) ?? fallback;
};

/** Home, then the section hub when there is one, then the page itself. */
export const breadcrumbs = (lang: Lang, pathname: string, title: string) => {
  const arPath = alternates(pathname).ar.slice(site.url.length) || '/';
  const parts = arPath.split('/').filter(Boolean);
  const c = content[lang] as unknown as Record<string, { h1?: string } | undefined>;
  const trail: { name: string; path: string }[] = [{ name: businessName(lang), path: localePath(lang, '/') }];
  if (parts.length > 1) {
    const section = parts[0]!;
    const hub = c[section]?.h1;
    if (hub) trail.push({ name: hub, path: localePath(lang, `/${section}`) });
  }
  trail.push({ name: parts.length > 1 ? crumbName(lang, parts[0]!, parts[1]!, title) : title, path: localePath(lang, arPath) });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.path === '/' ? `${site.url}/` : abs(t.path) })),
  };
};
