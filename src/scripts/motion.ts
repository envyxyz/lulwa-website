// Loaded by chrome.ts on the first touch, key or scroll, and never under reduced motion.
// Nothing is hidden until this file has run, so the page is complete without it.
import Lenis from 'lenis';
import { inView } from 'motion';
import { animate } from 'motion/mini';

// Lenis moves LERP of the remaining distance each frame, so capping that distance caps the speed:
// 0.1 x 300 px = 30 px a frame, about 1800 px/s at 60 Hz. Tune MAX_LEAD to change the top speed.
const LERP = 0.1;
const MAX_LEAD = 300;
const STAGGER = 0.05;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const lenis: Lenis = new Lenis({
  autoRaf: true,
  lerp: LERP,
  virtualScroll: (data) => {
    const lead = lenis.targetScroll - lenis.animatedScroll;
    data.deltaY = Math.max(-MAX_LEAD, Math.min(MAX_LEAD, lead + data.deltaY)) - lead;
    // At the cap Lenis sees no movement and ignores the event, which would let the browser scroll natively.
    if (data.deltaY === 0 && data.event.cancelable) data.event.preventDefault();
    return true;
  },
});

// Only what is still below the fold: nothing on screen ever blinks out.
const below = (el: Element) => el.getBoundingClientRect().top > innerHeight;
const reveal = (el: HTMLElement, delay = 0) => {
  el.style.opacity = '0';
  inView(el, () => {
    el.style.opacity = '';
    animate(el, { opacity: [0, 1], translate: ['0 1.25rem', '0 0'] }, { duration: 0.5, delay, ease: EASE_OUT });
  });
};

const cards = '.rounded-card:not(.rounded-card .rounded-card), .rounded-panel';
for (const section of document.querySelectorAll<HTMLElement>('main > *')) {
  if (!below(section)) continue;
  const inner = [...section.querySelectorAll<HTMLElement>(cards)];
  if (!inner.length) reveal(section);
  // Siblings in a row arrive one after the other.
  for (const card of inner) reveal(card, Math.min([...card.parentElement!.children].indexOf(card), 5) * STAGGER);
}
