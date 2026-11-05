// Single source for every fact about the shop: name, address, phone, hours, tags. Pages, schema, llms and tests all read from here.
const phoneE164 = '+966568022197';
// The pin of the shop's Google Business Profile, read from its map card on 5 Nov 2026.
const geo = { latitude: 26.4356733, longitude: 50.0744529 } as const;
const postalCode = '32246';

const address = {
  ar: { number: '8951', street: 'شارع الأمير عبدالمحسن بن جلوي', district: 'حي الجلوية', city: 'الدمام', region: 'المنطقة الشرقية', country: 'المملكة العربية السعودية' },
  en: { number: '8951', street: 'Prince Abdulmohsen bin Jalawi Street', district: 'Al-Jalawiyah', city: 'Dammam', region: 'Eastern Province', country: 'Saudi Arabia' },
} as const;
const comma = { ar: '، ', en: ', ' } as const;
const line = (lang: 'ar' | 'en') => {
  const a = address[lang];
  return { streetLine: `${a.number} ${a.street}`, streetAddress: `${a.number} ${a.street}${comma[lang]}${a.district}`, full: `${a.number} ${a.street}${comma[lang]}${a.district}${comma[lang]}${a.city} ${postalCode}` };
};

export const site = {
  url: 'https://lulwa.com.sa',
  brand: {
    arabic: 'لولوه للتكييف والتبريد',
    arabicShort: 'لولوه',
    latin: 'Lulwa',
    english: 'Lulwa Air Conditioning & Refrigeration',
    englishAlt: 'Lulwa AC & Refrigeration',
  },
  legal: { name: 'مؤسسة لولوه عبدالله فرحان المرشود للتبريد والتكييف', cr: '2050163881', unified: '7031612190', balady: '441212549365', baladyExpires: '1448/12/05' },
  email: 'lulwadammam@gmail.com',
  phone: {
    display: '056 802 2197',
    e164: phoneE164,
    tel: `tel:${phoneE164}`,
    whatsapp: `https://wa.me/${phoneE164.slice(1)}`,
  },
  address: {
    ar: { ...address.ar, ...line('ar') },
    en: { ...address.en, ...line('en') },
    countryCode: 'SA',
    regionCode: 'SA-04',
  },
  geo,
  postalCode,
  maps: {
    // The shop's Google Business Profile (Ameer, 5 Nov 2026), by its place id: directions and reviews open it in Google Maps.
    listing: 'https://www.google.com/maps?cid=11979123383184648733',
    // By the profile's exact name, so the map shows the business card and not a bare pin.
    embed: `https://www.google.com/maps?q=${encodeURIComponent('Lulwa AC & Refrigeration | لولوه')}&output=embed`,
  },
  // Hours as the page says them, per language, and as schema writes them.
  hours: {
    open: '08:00',
    close: '23:00',
    timeZone: 'Asia/Riyadh',
    days: 'every-day',
    text: { ar: 'كل يوم من 8:00 صباحاً إلى 11:00 مساءً', en: 'Every day, 8:00 AM to 11:00 PM' },
    range: { ar: '8:00 صباحاً إلى 11:00 مساءً', en: '8:00 AM to 11:00 PM' },
  },
  analytics: { ga4: 'G-XYKP3DY4X7', gtm: 'GTM-TVK4BRTS', clarity: 'yf0k43euob' }, // GTM container ownership unconfirmed (docs/FOR-AMEER.md)
  // Browser chrome colours, the light and dark --surface and the teal from tokens.css. Meta tags need literal hex.
  theme: { light: '#eef2ef', dark: '#121415', tile: '#0f6e7a' },
  verification: { google: 'NhugWL1gVcIPJCf6bi0eTNAXzZ2v7ZZvIHHS-Neh2E4' },
  // Profiles that resolved to this business on 2 Nov 2026. Trustpilot, Crunchbase did not (404 / 403), so they are out.
  sameAs: [
    'https://www.facebook.com/profile.php?id=61596078749614',
    'https://www.instagram.com/lulwadammam/',
    'https://x.com/lulwadammam',
    'https://www.youtube.com/@lulwadammam',
    'https://www.snapchat.com/@lulwadammam',
    'https://www.pinterest.com/lulwadammam/',
    'https://www.threads.com/@lulwadammam',
    'https://linktr.ee/lulwadammam',
    'https://www.openstreetmap.org/node/14335255741',
  ],
  // Date the pages last changed, for sitemaps. Bump it when copy changes.
  updated: '2026-11-02',
  images: {
    og: '/images/og-default.png',
    logo: '/images/brand/lulwa-logo.png',
  },
} as const;


/** The confirmed facts as plain lines, in one language. llms.txt and llms-full.txt print these first, so they match the pages character for character. */
export const factLines = (lang: 'ar' | 'en') => {
  const a = site.address[lang];
  const ar = lang === 'ar';
  return [
    `${ar ? 'الاسم' : 'Name'}: ${ar ? site.brand.arabic : site.brand.english}`,
    `${ar ? 'يُعرف أيضاً' : 'Also known as'}: ${ar ? `${site.brand.english}، ${site.brand.englishAlt}` : `${site.brand.arabic}, ${site.brand.englishAlt}`}`,
    `${ar ? 'العنوان' : 'Address'}: ${a.full}`,
    `${ar ? 'المنطقة' : 'Region'}: ${a.region}, ${a.country}`,
    `${ar ? 'الهاتف' : 'Phone'}: ${site.phone.display}`,
    `WhatsApp: ${site.phone.whatsapp}`,
    `${ar ? 'البريد' : 'Email'}: ${site.email}`,
    `${ar ? 'ساعات العمل' : 'Hours'}: ${site.hours.text[lang]}`,
    `${ar ? 'الاسم النظامي' : 'Legal name'}: ${site.legal.name}`,
    `${ar ? 'السجل التجاري' : 'Commercial registration'}: ${site.legal.cr}`,
    `${ar ? 'الخريطة' : 'Map'}: ${site.maps.listing} (${site.geo.latitude}, ${site.geo.longitude})`,
  ];
};
