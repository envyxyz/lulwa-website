// Single source for the shop's facts. One line changes the Latin name or the domain.
const phoneE164 = '+966568022197';

export const site = {
  url: 'https://lulwa.com.sa',
  brand: { arabic: 'لولوه للتكييف والتبريد', arabicShort: 'لولوه', latin: 'Lulwa' },
  legal: { name: 'مؤسسة لولوه عبدالله فرحان المرشود للتبريد والتكييف', cr: '2050163881', unified: '7031612190', balady: '441212549365', baladyExpires: '1448/12/05' },
  phone: {
    display: '056 802 2197',
    e164: phoneE164,
    tel: `tel:${phoneE164}`,
    whatsapp: `https://wa.me/${phoneE164.slice(1)}`,
  },
  maps: {
    listing: 'https://maps.app.goo.gl/6iLsTdG3y7FAq7jP9',
    // ponytail: area search, not a pin. Swap for the exact pin when the client sends it (docs/FOR-AMEER.md).
    embed: 'https://www.google.com/maps?q=Al-Jalawiyah%2C%20Dammam&output=embed',
  },
  hours: { open: '08:00', close: '23:00', timeZone: 'Asia/Riyadh', days: 'every-day' },
} as const;
