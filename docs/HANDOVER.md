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
