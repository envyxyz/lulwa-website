# Lulwa website

Arabic-first, English-second marketing and lead site for لولوه للتكييف والتبريد, an AC and refrigeration repair shop in Al-Jalawiyah, Dammam. Replaces the live lulwa.com.sa. Nested repo, git-ignored by the client repo one level up, which holds brand, photos and growth files.

## Read first

| File | Owns |
|---|---|
| `PRODUCT.md` | Confirmed facts, what must never be invented, positioning |
| `DESIGN.md` | Tokens and rules. **Website Overrides at the end win** over the brand text above them |
| `docs/PRD.md` | Goals, sitemap, page templates, features, budgets |
| `docs/DESIGN-DIRECTION.md` | Direction contract, idea, section blueprints, motion |
| `docs/TEST-CONTRACT.md` | The tests, written before the code, and the phase that turns each green |
| `docs/AUDIT.md` | What the old site got wrong, with measurements |
| `docs/url-map.csv` | Every old URL and what happens to it |
| `docs/AGENTS.md` | How to split a phase across Opus, Sonnet and agy |
| `docs/PHASES.md` | Plan link and dated log |
| `design/reference/roofguard-inspiration.webp` | Layout inspiration, see "Reference update" in `docs/DESIGN-DIRECTION.md`. It replaces `design/mock/hero.html` as the hero target |
| `docs/LAUNCH-PLAN.md` | Ameer's launch rules of 2 Nov 2026. **Wins over everything below where they conflict** |
| `docs/AUTORUN.md` | Rules for unattended runs. **Wins over this file while it exists** |
| `docs/PHASE-PROMPTS.md` | The prompt for each phase |
| `docs/FOR-AMEER.md` | Questions and verifications gathered for Ameer |

Old site copy and metadata for migration: `docs/research/old-site-content.json`. Treat every claim in it as false until `PRODUCT.md` confirms it.

Brand assets: `../growth/Brand/`. Photos: `../growth/Photos/Edited/`. Copy into `public/` only what ships.

## Stack

Astro 7 static output · TypeScript strict · Tailwind CSS v4 through `@tailwindcss/vite` · vanilla TypeScript islands, no React · self-hosted subset fonts · Playwright + axe · Lighthouse CI · **pnpm** · **Hostinger** (Ameer, 2 Nov 2026): `dist/` goes into `public_html`, `public/.htaccess` gives clean URLs, 301s, headers and caching, `public/contact-submit.php` takes leads. No Worker.

Check current docs with context7 before using any library API. No dependency for what a few lines or the platform already does.

## Hard rules

1. **Copy lives in `src/content/` only**, one typed file per language (`ar.ts`, `en.ts`), same shape, checked by the type system. No literal user-facing text in components, aria-labels included.
2. **Arabic first.** Build the Arabic page, then the English twin. Arabic at the root, English at `/en/`, same slugs. Every page exists in both or in neither.
3. **Tokens only.** Colours, type, spacing, radii, durations come from `src/styles/tokens.css`. No raw hex, no arbitrary Tailwind values in components. Need a new value? Add a token.
4. **Logical CSS only.** `ms-`, `me-`, `ps-`, `pe-`, `start`, `end`, `inline`, `block`. Physical left and right fail lint. Directional icons mirror; logo, phone numbers, WhatsApp glyph and photos do not.
5. **One copper element per view,** and it is the pearl: a dot, never a fill larger than a pill. Teal carries actions and whole fields.
6. **No slop.** No eyebrows, no pill badges above headlines, no emoji, no gradients except a neutral photo scrim, no glass, no icon-topped card rows, no section numbers, no hairline dividers, no shadows at rest. Rounded tone-step cards are allowed. `design-taste-frontend` inspector and lint must pass.
7. **Type:** Beiruti for Arabic display, IBM Plex Sans Arabic for Arabic body, Schibsted Grotesk for all English. Readex Pro only inside the logo artwork. Never Inter, Cairo, Tajawal, Almarai or Noto Kufi. Thmanyah is licence-barred on the web.
8. **Phone** is written `056 802 2197`, dialled `tel:+966568022197`, WhatsApp `https://wa.me/966568022197`, from `site.ts` only. Wrap Latin and digits in Arabic text in `<bdi>`.
9. **Never invent claims.** Years, counts, percentages, prices, warranty terms, response times, "certified", "original parts", "24 hours", "same day", ratings. Each needs a dated line in `PRODUCT.md` first. `tests/claims.spec.ts` fails the build if one appears.
10. **Reviews are real or absent.** Copied from the Google listing with date and name as shown. No `AggregateRating` markup.
0. **Slugs and file names never change** (Ameer, 2 Nov 2026, critical). Every URL in `docs/url-map.csv` stays a real page at its original path.
11. **JavaScript budget:** content pages ship 0 KB of our own JS except the fault picker island, the mobile menu and the header's hide-on-scroll script (about 0.3 KB, Ameer's request of 1 Nov 2026), under 6 KB gzip together. Analytics load after first interaction. So do Lenis and Motion (`src/scripts/motion.ts`), Ameer's request of 1 Nov 2026, outside the 6 KB because they arrive after first load and never under reduced motion.
12. **Performance budget:** Lighthouse mobile 95+ in all four categories on every route in both languages, LCP under 2.0 s, TBT under 100 ms, CLS under 0.05, page weight under 250 KB on first load excluding analytics, fonts under 110 KB.
13. **Accessibility:** WCAG 2.2 AA, 44 px targets, visible focus, keyboard complete, `prefers-reduced-motion` respected.
14. **Light and dark themes follow the device** through `prefers-color-scheme`, with no toggle. `color-scheme: light dark`. Every colour token has both values, and both themes meet AA. The site must not flash the wrong theme on load.
15. **Images:** job photos are real, shown no larger than their source allows (the WhatsApp set is 287 to 680 px wide). Generated unbranded product images on white are allowed as product illustrations, listed in the provenance file, never shown as our jobs. AVIF and WebP with `srcset`, explicit `width` and `height`, lazy below the fold. AI mockups of the shop, uniforms or vehicles never ship.
16. **SEO:** every route has title, description, self canonical, reciprocal hreflang (`ar-SA`, `en-SA`, `x-default` to Arabic), OG, JSON-LD. Legal name and CR number in every footer.
17. **Security:** secrets only in `.env.local`, never in `public/`. `public/contact-submit.php` validates every lead (same origin, honeypot, per-IP rate limit). Headers in `public/.htaccess`. PDPL: consent line and privacy link at every form, no personal data in URLs or analytics events.
18. **Static only.** No SSR adapter. Anything needing a server is a small PHP file in `public/`. No Google Cloud billing APIs.

## Commands

Keep this list in sync with `package.json`.

- `pnpm dev`: dev server. Kitchen sink at `/dev/kitchen-sink` and `/en/dev/kitchen-sink`, dev only, never built.
- `pnpm build`, `pnpm preview`, `pnpm typecheck`
- `pnpm lint`: ESLint and stylelint. `pnpm test:lint-proof` proves each rule fires (T19).
- `pnpm test:contract`: builds, runs T1 to T23, prints each against the phase that owes it. Add `--fast` to skip Lighthouse. About 20 minutes while pages are missing.
- `pnpm test:e2e`: Playwright only, on the built site served by real Apache and PHP on :4330, in installed Edge. `pnpm test:e2e tests/nap.spec.ts` for one. Apache and PHP are portable copies in `.tools/` (git-ignored); set `HTTPD_DIR` to use another.
- `pnpm serve`: the built `dist/` on Apache, as Hostinger runs it. `pnpm package`: build, then `hostinger-upload.zip` to extract into `public_html`.
- `pnpm pages`: after a build, copies `dist/` to `dist-pages/` for the GitHub Pages preview (prefixed URLs, noindex, no PHP). Every push to `main` deploys it through `.github/workflows/deploy.yml` and keeps the Hostinger zip as a run artifact.
- `pnpm test:photos` (T22), `pnpm test:taste` (T20), `pnpm test:lighthouse` (T18)
- `node scripts/images.mjs`: exports photos and product images to `public/images`, rewrites `src/images/provenance.json`. `python scripts/gen-products.py [names]`: product images with agy.
- `python scripts/subset-fonts.py <raw font dir>`: rebuilds `public/fonts`. `node scripts/sink-shots.mjs`: kitchen sink screenshots. `node scripts/phase-shots.mjs <n> [routes]`: screenshots in light and dark to `docs/shots/phase-<n>/`, after `pnpm build` (in Git Bash set `MSYS_NO_PATHCONV=1` when passing routes).

## How work happens

- One chat per phase, prompts in the plan Artifact (link in `docs/PHASES.md`). Each chat opens with `/caveman`, keeps `/ponytail` on, reads this file and the table above.
- Tests in `docs/TEST-CONTRACT.md` exist before the code they check. A phase is done when its tests are green, not when it looks done.
- Split work per `docs/AGENTS.md`. The lead reviews every agent's output before it is merged. agy output is unverified until checked.
- Each phase ends with: build, lint, typecheck and its tests passing; `/ponytail:ponytail-review` on the diff; screenshots at 1440 and 390 in Arabic and English shown to Ameer for visual phases; a dated note in `docs/PHASES.md`; one commit.
- Audits run at the end in Phase 9, not after every phase.

## Git

`main` only. Commit per phase: `phase 3: chrome and hero`. Never commit `.env*` except `.env.example`, `node_modules`, `dist`, `.astro`, test reports. `docs/before/` is committed: it is the brag video's source.
