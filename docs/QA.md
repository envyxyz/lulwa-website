# QA: Phase 9, 2 Nov 2026

Measured on commit `2f898b7` (the `main` tip after the redesign pass of 1 to 2 Nov) plus the Phase 9 fixes listed below. Raw logs are in `docs/qa/`.

## Machine
Windows 10, 12 GB RAM with roughly 1 to 2.5 GB free during runs, Edge (installed) headless, Node 26. A `rehan-traders` dev server and Next process were running and busy the whole time, so timings are noisier than a clean machine; the sweeps are single runs per route unless stated. Lighthouse is the lab default (mobile, simulated 4x CPU and 1.6 Mbps), served by `astro preview`. Playwright and squirrel were served by `wrangler dev`, which applies `_redirects` and `_headers`. Everything ran from a git worktree of `main`, because someone else was editing the main checkout while this ran.

## Result
| Check | Result |
|---|---|
| `pnpm build`, typecheck, eslint, stylelint | clean |
| `playwright test` (T1 to T17, scroll, themes, 703 tests) | **703 passed, 0 failed** after the T17 baselines were regenerated and one new touch test was added |
| T20 taste inspector, all 43 pages | **0 FAIL** (warnings only, listed below) |
| T22 photos | pass: 11 images, all with provenance |
| T18 Lighthouse, 72 routes, light | every route 95+ in all four categories, TBT 0 to 52 ms, CLS under 0.05, **except `/` (Arabic home): LCP 2.1 to 2.2 s against the 2.0 s limit** |
| T18 Lighthouse, 72 routes, dark (`preferredColorScheme=1`) | same: only `/` fails on LCP. Three first-pass outliers (`/en/blog/ac-repair-in-dammam` LCP 3.9 s, `/en/reviews` TBT 146 ms, `/work` LCP 2.1 s) re-measured three times each and all pass (LCP 1.36, 1.36, 1.67 s, TBT 0), so they were machine noise |
| squirrelscan, full coverage, 70 pages, `wrangler dev` | **61 / 100 (D)** raw. With the localhost-only rules off (https, sitemap domain and coverage, caching) **80 / 100 (B)**. The 90 target is **not met** |
| Lint proof (T19) | not re-run: `pnpm exec` aborts inside the worktree. It passed in the earlier watchdog run and no lint config changed |

`pnpm test:contract` as one command was not run; its parts were run separately above.

## Motion and smooth scroll (the new part)
- **Budget:** Lenis and Motion stay out of first load. Chunk is `motion.*.js`, 27.9 KB raw, 8.8 KB gzip, fetched on first touch, key or scroll. Lighthouse never interacts, so TBT and LCP are unaffected (TBT 0 to 52 ms across the sweep). First-load own JS: layout 1.5 KB gzip, track 0.3, picker 0.9 or form 1.0. T13 passes.
- **Cost after interaction:** at 4x CPU throttling the first touch costs one long task of 180 to 220 ms (loading, parsing and setting up Motion, Lenis and the reveals). About a quarter of that on a normal phone. Not in Lighthouse; recorded, not fixed. Knob: `src/scripts/chrome.ts` could wait for idle instead of the first touch.
- **Reduced motion:** Lenis does not load, Motion does not load, nothing is hidden, keyboard PageDown still scrolls (724 px). Verified in Edge with `reducedMotion: reduce`.
- **Keyboard, anchor, touch:** with smooth scroll on, `Tab` through 360 focus stops kept every focused element in view; the `#pick` anchor lands at 72 px; `PageDown` and `End` work. **Touch was broken and is fixed:** after smooth scroll loaded on the first touch, every later swipe did nothing (the first scrolled 485 px, the second 0), because the speed cap cancelled the zero-delta `touchstart`. The cap now applies to wheel events only (`src/scripts/motion.ts`), and `tests/scroll.spec.ts` has a two-swipe test. Second swipe now moves 800 px.
- **Known edge:** a native programmatic scroll (for example `scrollIntoView`, find in page) in the second right after a wheel event can be overridden by Lenis' last frame. Tab focus and anchors are not affected. Not fixed.
- **Animations watched running** (Edge, motion allowed, frames sampled): reveal rises 0 to 1 monotonically, starting about 70 to 100 ms after the card enters; all 31 revealed elements end at opacity 1 when scrolled to; the menu popover goes 0 to 1 inside 250 ms; the map skeleton shows for about 1 s after the tap, then the frame fades in over it and the skeleton goes. No page errors in Arabic or English.

## Fixes made in Phase 9
- Earlier watchdog batches (`phase 9 wip`) kept as they were.
- Touch scroll (above).
- Arabic pages preload the three fonts the first paint needs, not only the display font (`Base.astro`). Small LCP gain (2.2 to 2.1 s), not enough.
- Picker highlight class `.ring` collided with Tailwind's `ring` utility and gave it a box-shadow at rest; renamed `.halo`. A comment in `tokens.css` that contained the word "shadow" tripped the taste lint.
- Both logo links now carry the label on the link itself.
- T17 visual baselines regenerated: the redesign of 1 to 2 Nov changed every page on purpose.
- `scripts/lighthouse.mjs` takes `LH_RUNS`, `LH_ONLY`, `LH_DIR`, `LH_FLAGS` (dark mode); `scripts/lh-summary.mjs` prints the table. `playwright.config.ts` takes `PW_PORT`.

## Not met, with evidence
1. **Arabic home, mobile LCP 2.1 to 2.2 s (limit 2.0 s).** Nine runs, 2.1 to 2.2 s each, light and dark. LCP element is a picker product image; FCP is 1.5 s. Real cause not isolated. Tried: Arabic font preload (-80 ms), not hiding eager images behind the fade, starting the picker after first paint, and not forcing the other picker images eager. The last three changed nothing, so they were reverted. English home passes (1.7 to 1.8 s). The home is being redesigned in the main checkout, so the fix belongs there. No threshold was lowered.
2. **squirrelscan 80, not 90.** What remains is mostly by design or needs facts: 30 fault pages are `noindex` until a technician reviews them (schema plus noindex conflict); 68 pages count as thin content because we do not pad past what `PRODUCT.md` confirms; no `datePublished` on posts (no real dates exist); postal code unknown; visible text is under 15% of the HTML (inline SVG and utility classes); meta descriptions under squirrel's minimum on 43 pages; CSP still allows one inline script. The hidden honeypot input and `aria-command-name` findings look like false positives (axe passes on every route in both themes).
3. **Real Android phone in Arabic:** cannot be done here. In `docs/FOR-AMEER.md`.

## Taste inspector allowances
Listed in `scripts/taste.mjs`. Existing: card-rows, radius-mix, still-page, covered-text, eyebrow and edge-text on home, few-pictures and focal-point and (Arabic) off-centre on text pages. Added in Phase 9, each with its reason in the file:
- home: `emoji` (two real Google reviews contain emoji and are shown as written), `focal-point` (the type cap leaves the picker as the lead), `icon-cards` (the three-step line is a process with a connector).
- text pages, both languages: `off-centre` (reading measure).
- `/work`: `focal-point` (photos are at most 680 px wide).
- `/reviews`: `emoji`. Service pages: `lopsided` (short lists are all that is confirmed).

Remaining warnings are typeface count (three, by brand), no video, ragged left edges and a sideways row, all known.

## Audits not repeated
The five agy second opinions from the earlier run (`docs/qa/agy-*.md`) stand: the Worker and `_headers` have not changed since the fixes they led to. Weekly usage was high, so no new agy or Claude agents were started and no builders were needed: the fixes were small and touched separate files.
