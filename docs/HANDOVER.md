# Handover, 2 Nov 2026

Paste this into the next account, opened in `C:\Users\ameer\Desktop\lulwa\website`:

> Read `docs/HANDOVER.md` and `docs/LAUNCH-PLAN.md`, then finish the Lulwa launch. Don't stop until the tests are green. End with only what's left for Ameer.

Ameer's words are in `docs/LAUNCH-PLAN.md`, which wins over every older doc. Short version: Hostinger hosting, slugs and file names never change (critical), buttons say only WhatsApp/Call, no sticky phone bar, favicon in Google, no NAP drift, tags and Search Console carried over from `../website_old`. He does not want "I left x" for code. At the end, give him just what's left. No deploy, no sign-ins.

## State when the first account ran out
Three background agents were still running in this folder and **their results were never seen**. They may have died part way. Treat all their files as unverified. Nothing has been built or tested since the lead's edits.

### Done and committed by the lead
- Merged `phase-9-audit` into local `main` (not pushed).
- `src/components/AskPage.astro` (ask-first pages), routes `services|areas|brands/[slug].astro` in both languages, hubs linking every old slug, types, footer `/areas` link.
- `src/content/ar.ts` and `en.ts` import `./directory/*.json`, carry the old titles, and have the new button words. **The build fails until those three JSON files exist.**
- BottomBar removed. Phones get the WhatsApp icon in the header, and WhatsApp and Call in the menu.
- `CLAUDE.md` and `PRODUCT.md` updated.

### Check each workstream; finish what's missing yourself
Spec for all three, with file ownership and JSON shapes: `docs/LAUNCH-PLAN.md`.

1. **agy content:** `src/content/directory/brands.json` (32), `areas.json` (20, no Dammam), `services.json` (5). Slugs must equal old file names. Scan for the plan's banned terms. Also the 5 product images in `public/images/<name>-320|640.avif|webp` and `provenance.json`; if missing, leave out `image` and the template copes. Call agy as in the memory note `agy-usage-notes`.
2. **Hostinger layer:** every row in `docs/url-map.csv` is `keep`; `scripts/redirects.mjs` generates `public/.htaccess` from `../website_old/.htaccess`; `scripts/postbuild.mjs` moves hubs to `x/index.html`; `public/contact-submit.php` with `LeadForm.astro` posting to it; `public/logs/` denied; `scripts/package-hostinger.mjs` makes `hostinger-upload.zip`; `worker/`, `wrangler.jsonc`, `integrations/`, `_redirects`, `_headers` removed; Playwright on a real local Apache (portable, in the scratchpad) on port 4330; tests updated.
3. **SEO and tags:** `src/site.ts` as the one NAP source; `Base.astro` tags including `google-site-verification`; favicon set including a real `favicon.ico`; `manifest.json`, `browserconfig.xml`, `images/og-default.png`, `images/brand/lulwa-logo.png`, old images copied under the same names; JSON-LD `WebSite`, `WebPage`, full `HVACBusiness`; GA4, GTM and Clarity in `track.ts` loaded like the old block, with events also sent by `gtag`; own sitemap integration with the old file names plus `blog/rss.xml`; `robots.txt`, `ai.txt`, `llms.txt`, `llms-full.txt`; all 15 slugs in `src/reviewed-faults.ts`; hardened `tests/nap.spec.ts`; T3 Arabic title limit 70.

### Then, as lead
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test:e2e`, Lighthouse. Fix what's red. T17 snapshots must be refreshed because the design changed on purpose (bar removed). English and Arabic h1s must stay within two lines at 320 px (T11). Copy-parity needs equal arrays.
- Look at screenshots of one brand, area, extra-service page and both hubs at 390 and 1440, light and dark.
- `src/pages/llms*.txt.ts` and the breadcrumbs must include the new pages.
- `scripts/taste.mjs` has a stale comment about the bottom bar. `src/content/ar.ts` and `en.ts` blog English titles could carry the old keywords.
- `docs/PHASES.md` entry, commit, `pnpm package`, list the zip to confirm `.htaccess` and `logs/` are at the root.

## Never
- Never print or commit `../website_old/config/*`: it holds live DB credentials. `website_old/` and `website_old.zip` are untracked in the outer repo; leave them uncommitted and tell Ameer.
- Never say "ready, nothing left" unless the tests really pass.

## Final message to Ameer: what's left, facts to include
- Back up `public_html` on Hostinger, extract `hostinger-upload.zip` there. The new site has no PHP admin, CMS or analytics dashboard; old database stays untouched.
- Unconfirmed areas, brands and appliances ask first instead of promising, and fault pages are indexed without a technician read. He should know both.
- GBP and citations by hand per `docs/GBP.md`, `docs/CITATIONS.md`. Send one real test lead to confirm `mail()` on Hostinger.

## Late report from the agy agent (unverified by the lead)
- Directory JSON and the 5 product images landed; the agent reports its validation clean. Agy review jobs were still to run.
- **To fix:** old Arabic brand titles differ for 7 slugs. Chigo, Daikin, Fujitsu, Gree, O General, Sanyo use `تصليح مكيفات وأجهزة X في الدمام`; Zamil uses `تصليح مكيفات زامل في الدمام`. `brandItems` in `src/content/ar.ts` must key off those slugs.
- **To fix:** add dishwasher, freezer, microwave, oven-stove, water-heater to the `products` array in `scripts/images.mjs` before any rerun, or `provenance.json` loses them.
- `km` is null for Al-Rabwah; the template's `a.km ?` check already handles it.

## Late report from the SEO agent (unverified by the lead)
Stopped safely. Status: `docs/HANDOVER-seo.md`. Reports a good build of 190 pages to a scratch folder; Playwright specs not run. **To fix:**
- Address spelled without the number: `ar.ts` and `en.ts` line 334 (FAQ answer), `ar.ts` line 412 (about fact). Home, about and llms-full show the same drift.
- `0568022197` in the contact form error text, `ar.ts` and `en.ts` around line 412. The new nap test fails on it.
- `tests/lib.ts` `builtRoutes` still reads `dist/sitemap-0.xml`; check whether the Hostinger agent changed it.
- `src/scripts/chrome.ts` GTM loader is dead code: delete it. Drop `@astrojs/sitemap` from `package.json`.
- `.htaccess` must allow `/.well-known/` and the sitemap file names.

## Late report from the agy agent, final (unverified by the lead)
Stopped. Status: `docs/HANDOVER-agy.md`. Arabic and safety reviews ran but nobody read them; read and apply `C:\Users\ameer\AppData\Local\Temp\claude\c--Users-ameer-Desktop-lulwa\02cd0664-272d-4f2e-b0c8-52095807be0f\scratchpad\agy\qa-*.out`. The SEO audit never ran. Some brand `services` lists are judgment calls and area coordinates were only spot-checked.

## Late report from the Hostinger agent (unverified by the lead)
All agents have stopped. Status and run steps: `docs/HANDOVER-hostinger.md`. Real Apache ran on an older partial build: 153 passed; the failures it reported were pages not yet in that build plus the old-file-names test. Rerun on a fresh build. **To do:** update `scripts/test-contract.mjs`; run `pnpm package` and list the zip; check the per-IP rate limit (20 an hour); fix `tests/analytics.spec.ts` (still mocks `/api/lead`) and `lighthouserc.cjs` (still reads `sitemap-0.xml`). Extra file: `public/error-en.php` serves the English 404. Hostinger needs PHP 8.1+ with `mbstring`; `mail()` can only be proven on the host.
