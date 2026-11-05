import { campaign, sourceTag, track } from './track';

campaign();

// Images still arriving fade in over their skeleton. No JS: they just show.
for (const img of document.images) {
  const done = () => {
    img.classList.remove('loading');
    img.parentElement?.classList.remove('skeleton');
  };
  if (img.complete) done();
  else {
    img.classList.add('loading');
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }
}

// Header: hides on scroll down, returns on scroll up. Shown at the top, with the menu open or keyboard focus inside.
const bar = document.querySelector<HTMLElement>('[data-bar]');
if (bar) {
  let last = 0;
  let queued = false;
  const update = () => {
    queued = false;
    const y = Math.max(0, scrollY);
    const dy = y - last;
    if (Math.abs(dy) < 8 && y > 80) return;
    bar.toggleAttribute('data-floating', y > 8);
    bar.toggleAttribute('data-hidden', y > 80 && dy > 0 && !bar.matches(':has(:focus-visible, :popover-open)'));
    last = y;
  };
  addEventListener('scroll', () => queued || ((queued = true), requestAnimationFrame(update)), { passive: true });
}

// Floating Call and WhatsApp: gone while the hero or the footer is on screen, since both hold the same two buttons.
const float = document.querySelector('[data-float]');
if (float) {
  const inView = new Set<Element>();
  const watch = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) inView[isIntersecting ? 'add' : 'delete'](target);
    float.toggleAttribute('data-hidden', inView.size > 0);
  });
  for (const el of document.querySelectorAll('[data-hero], body > footer')) watch.observe(el);
}

// Smooth scroll and reveals load on the first touch too, and not at all under reduced motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const types = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'scroll'];
  const load = () => {
    for (const type of types) removeEventListener(type, load);
    void import('./motion');
  };
  for (const type of types) addEventListener(type, load, { passive: true });
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
