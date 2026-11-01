import { campaign, sourceTag, track } from './track';

campaign();

// GTM loads on the first touch, key or scroll, never before.
const gtm = document.documentElement.dataset.gtm;
if (gtm) {
  const load = () => {
    for (const type of ['pointerdown', 'keydown', 'scroll']) removeEventListener(type, load);
    const layer = ((window as unknown as { dataLayer?: unknown[] }).dataLayer ??= []);
    layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtm}`;
    document.head.append(script);
  };
  for (const type of ['pointerdown', 'keydown', 'scroll']) addEventListener(type, load, { once: true, passive: true });
}

const events: Record<string, string> = { call: 'call_click', whatsapp: 'whatsapp_click', directions: 'directions_click' };

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-action]');
  const name = link && events[link.dataset.action!];
  if (!link || !name) return;
  if (name === 'whatsapp') {
    const url = new URL(link.href);
    const text = url.searchParams.get('text');
    // The picker and the form already wrote a message with the tag; plain buttons get the tag alone.
    if (!text?.includes(sourceTag())) {
      url.searchParams.set('text', text ? `${text} ${sourceTag()}` : sourceTag());
      link.href = url.href;
    }
  }
  track(name);
});
