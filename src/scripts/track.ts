// Tags and events. Tags load as on the old site: on the first touch, key or scroll, or 3.5 s after load once the browser is idle.
// Events go to dataLayer for GTM and through gtag() to GA4, so GA4 sees them with no GTM setup. Only the event and the page slug ever go in.
import { site } from '../site';

type Layer = unknown[];
const w = window as unknown as { dataLayer?: Layer; clarity?: ((...args: unknown[]) => void) & { q?: unknown[] }; requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void };
const layer: Layer = (w.dataLayer ??= []);
// gtag.js reads Arguments objects, not arrays.
const gtag: (...args: unknown[]) => void = function () {
  // eslint-disable-next-line prefer-rest-params
  layer.push(arguments);
};
const { ga4, gtm, clarity } = site.analytics;
gtag('js', new Date());
gtag('config', ga4);
w.clarity ??= function (...args: unknown[]) {
  (w.clarity!.q ??= []).push(args);
};

const load = (src: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.append(script);
};
const wake = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
let started = false;
const start = (event?: Event) => {
  // The load-time scroll Chrome fires on the Arabic page on phones is not a visit (see chrome.ts).
  if (event?.type === 'scroll' && scrollY < 1) return;
  // The GitHub Pages preview must not count in the shop's analytics.
  if (started || location.hostname.endsWith('.github.io')) return;
  started = true;
  for (const type of wake) removeEventListener(type, start);
  layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  load(`https://www.googletagmanager.com/gtag/js?id=${ga4}`);
  load(`https://www.googletagmanager.com/gtm.js?id=${gtm}`);
  load(`https://www.clarity.ms/tag/${clarity}`);
};
for (const type of wake) addEventListener(type, start, { passive: true });
const idle = () => setTimeout(() => (w.requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1)))(start, { timeout: 2000 }), 3500);
if (document.readyState === 'complete') idle();
else addEventListener('load', idle);

/** Page slug without the language: "home", "contact", "services/ac-repair". */
export const slug = () => location.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '') || 'home';

export const track = (event: string) => {
  layer.push({ event, location: slug() });
  gtag('event', event, { location: slug() });
};

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
