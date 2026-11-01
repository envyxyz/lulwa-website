// Events for GTM. No names, numbers or messages ever go in: only the event and the page slug.
type Layer = Record<string, unknown>[];
const w = window as unknown as { dataLayer?: Layer };

/** Page slug without the language: "home", "contact", "services/ac-repair". */
export const slug = () => location.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '') || 'home';

export const track = (event: string) => (w.dataLayer ??= []).push({ event, location: slug() });

/** utm_campaign is kept for the visit, not stored beyond it. */
export const campaign = () => {
  try {
    const utm = new URLSearchParams(location.search).get('utm_campaign');
    if (utm) sessionStorage.setItem('utm', utm.slice(0, 80));
    return sessionStorage.getItem('utm') ?? '';
  } catch {
    return '';
  }
};

/** Source tag on every WhatsApp message: the page slug, plus the campaign if the visit had one. */
export const sourceTag = () => `[${[slug(), campaign()].filter(Boolean).join(' ')}]`;
