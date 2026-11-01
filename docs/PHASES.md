# Phases

Plan and copy-ready prompts per phase: https://claude.ai/artifact/W6AdsSfBJqVDMyvDBtq1Hk (private to Ameer).

Order: 1 Contract and foundation (+ 2 Content and truth) → 3 Chrome and hero → 4 Home and picker → 5 Services and faults (+ 6 Areas, brands, rest) → 7 Leads → 8 SEO → 9 Audits → 10 Go live → 11 After shots and brag → 12 After launch.

Each phase appends a dated entry: what shipped, what is left, decisions made.

## Log

### 2026-11-01 · Phase 4: Homepage and fault picker
- Shipped: fault picker, all home bands in Arabic and English, `scripts/images.mjs` with sharp, `scripts/gen-products.py`. Screens in `docs/shots/phase-4/`, looked at and fixed.
- Green: T14, T22, and on `/` and `/en`: T6, T21, T7, T12, T13, T10, T11, T8, T9. T19, lint, typecheck. Full `test:contract` not run; other routes do not exist yet.
- Lighthouse, phone, one run per page, local preview, not a clean machine: `/` 99/100/96/100, LCP 1.6 s, TBT 0, CLS 0.002, 131 KB. `/en` 100/100/96/100, LCP 1.3 s, TBT 0, CLS 0, 61 KB. Best practices stays at 96 for the Phase 8 favicon 404.
- Followed the Reference update over the band list: heading beside text, bento picker, sideways service row with a tinted call card, tinted statement panel, simple process row. Rounded cards are structure.
- Decided: the pearl moves on line drawings in the picker, not product images, because a drawing gives exact spots and costs no network. Without JS every option is a plain link.
- Decided: quota ran out after window AC and outdoor unit. Fridge, washer and dryer cards use the same drawings, as the Reference update allows. `Home.astro` switches to an image as soon as `scripts/images.mjs` lists it. Outdoor unit raw is kept but not exported, nothing uses it. Compressor image dropped.
- Decided: photos come from `Edited`, shrunk to the WhatsApp original's width (287 or 680 px). Six of 12 used; the reasons for the others are in `scripts/images.mjs`.
- Decided: picker areas are Al-Jalawiyah and "another Dammam district", since nothing wider is confirmed. Source tag is `[home]`; Phase 7 generalises it.
- Decided: hours table has seven identical rows with today marked, because the prompt asks for it. A small script marks today and loads the map on tap. JS stays inside T13's 6 KB.
- Decided: `--container-page` is now 90rem so content shares the hero's margins at 1440. `--word-display` added because Beiruti's space is too thin at display size. Heading's quiet line is inline after a `<br>`, so T11 counts lines correctly.
- Test change: T6 ignores `<svg>`, since a lucide path holding `14.993` matched `/4\.9/`. Claims in text are still checked.
- Worked alone, no builders: one file set. agy: 2 images, 4 hit the 429 and cost nothing, 1 Arabic review (rejected `أرسلها` and `بدون تعديل`, the second is false for retouched photos). Fault lists and drawings written by the lead, so the planned agy jobs for those were skipped. agy design critique skipped; judged screenshots directly.
- T20 still red, owed by Phase 9. Not fixed on purpose: `side-scroll` and `eyebrow` (the Reference update's row, and the picker's step labels), `still-page` and `no-footage` (one authored moment, no stock video), `covered-text` (phone bar passing over text while scrolling). Also open: `headline-lines` on the statement paragraph (it is a `<p>`, as the inspector advises, and still flagged) and `ragged-edges`.
- T11 once passed while a screenshot showed "How it starts / Three steps" on 4 lines at 1440. Layout fixed; the test may measure before fonts load, worth a look in Phase 9.
- Left: fault-to-part technician check, three product images, exact map pin. All in `docs/FOR-AMEER.md`. Not tried on a real phone. `/ponytail:ponytail-review` by eye only. Links to service pages 404 until Phase 5.

### 2026-11-01 · Phase 3: Chrome and hero
- Shipped: top bar, phone menu, language link to the exact twin, footer, Ink bottom bar on phones, hero in Arabic and English, one generated tile image. Screens in `docs/shots/phase-3/`, looked at and fixed.
- Green: T7, T12, T13 on `/` and `/en`. Also T6, T21, T19, T22, typecheck, and for these two pages T8, T10, T11 and the T9 language and menu cases. The full `test:contract` was not run; other routes do not exist yet.
- Lighthouse, phone, 3 runs, local preview, median: `/` 100/100/96/100, LCP 1.37 s, TBT 0, CLS 0.002, 84 KB. `/en` 100/100/96/100, LCP 1.21 s, TBT 0, CLS 0, 48 KB. Best practices stays at 96 because `/favicon.ico` 404s until Phase 8. Measured one word of English copy before the final build. Not a guaranteed-clean machine.
- Hero follows the Reference update: rounded teal panel, giant name, h1 low on the start side, two buttons, one product tile. Not the horizon mock.
- Decided: h1 is two short display lines with the city in it (`المكيف وقف؟ / نصلحه في الدمام`, `AC gave up? / Dammam repair`). The prompt asked for the support sentence inside the h1, but that breaks T11 and the inspector at phone widths, so it stays a visible `<p>` right after. Nothing is hidden.
- Decided: `hero.answer` shows until `homeVisitLine` is filled; the template already prefers that field, so the swap is copy only. No visit is promised.
- Decided: phone menu is a native `popover`, not a JS island: Esc, light dismiss and focus return with 0 KB of JS. The prompt's "small vanilla island" is not needed.
- Decided: the seam is a strip of pearl lifting off the top of a teal panel, so the panel is always a real teal ground. Off under reduced motion, h1 still.
- Decided: `--text-giant` added for the name, sized in `cqi` to its container and capped by `svh`. A sixth size, on purpose, because the Reference update asks for it. English pages may fetch Plex (25 KB) for the legal name and the language link.
- Decided: the logo's pearl stays copper in the top bar beside the hero's pearl, so two copper marks are in view. Logo artwork is treated as outside the one-per-view rule.
- Logo: no vector wordmark exists, so `Logo.astro` holds the real mark SVG plus a wordmark traced from `lulwa-logo-horizontal.png`. Clean at header size, not for large use.
- Image: tile exported once with Pillow to `public/images/`, listed in `src/images/provenance.json` as generated. Phase 4's sharp pipeline takes this over. One image used, 13 or so left in the quota window.
- Worked alone, no Sonnet builders: small file set. Two agy reviews ran. Code review: no real bugs; `aria-expanded`, duplicate nav label and physical inset findings do not apply (popover exposes state, only one nav shows at a time, Tailwind's `inset-x` is logical). Arabic review: rejected its brand "spelling fix" (لولوه is the legal name) and `فورية` (an invented claim); the rest went to `docs/ARABIC-REVIEW.md`.
- T20 inspector still reports, by design for now, 3 FAIL: `few-pictures` and `still-page` (the page is hero and footer until Phase 4) and `covered-text` (the phone bar passes over the giant word while scrolling; body padding clears it at the end). WARN: `no-footage`, `off-centre`, `grey-body`. Lint reports 4 emoji in review texts, waiting on the call in `docs/FOR-AMEER.md`. T20 is owed by Phase 9.
- Left: nav and tile links 404 until Phases 5 and 6. Seam and press feedback checked in code and screenshots, not on a real phone. `/ponytail:ponytail-review` run by eye only.

### 2026-11-01 · Phase 2: Content and truth
- Shipped: `src/content/types.ts` with all 11 page groups (home, services, faults, areas, brands, about, contact, reviews, work, legal, blog); full `ar.ts` and `en.ts`. T6 and T21 green (15 tests), typecheck clean, build clean.
- Written by the lead alone, no agy or agents: the copy is short and almost all of it is gated by PRODUCT.md, so verifying agy output would have cost more than writing it. Plain-English twin written from the Arabic meaning, not literally.
- Truth rules applied: four services only (AC split and window, fridges with gas refilling, automatic washers, dryers), Dammam only, no price, time, years, warranty, certification, home visit or "same day". `home.hero.homeVisitLine` is empty in both languages as the placeholder. Brand pages say only that the shop is independent and invite a unit-label photo. Blog posts rewritten as short generic how-tos on the old slugs.
- Reviews: 5 of 8 copied exactly from the signed-out Google Maps listing; the rest need a signed-in look. `Content.status` stays, now only `'final'`, because T6 reads it.
- Decided: client questions are one forwardable message in `docs/FOR-AMEER.md`; the PRD stays the source. Unsure Arabic in `docs/ARABIC-REVIEW.md`.
- Left: faults items (Phase 5), area pages beyond Dammam (Phase 6, needs coverage), photo captions for `work` (Phase 4), chrome copy beyond the skip link (Phase 3), the 3 missing reviews. Impl-validator and ponytail-review passes not run: no agents, small diff.

### 2026-11-01 · Phase 1: Test contract and foundation
- Shipped: Astro 7 static scaffold (TypeScript strictest, Tailwind v4, ar at root, en at `/en`), tokens, self-hosted fonts, Base layout, Container, Section, Heading, Text, Button, Icon, Img, `src/site.ts`, content types with ar and en stubs, dev-only kitchen sink, lint rules with `scripts/prove-lint.mjs`, all 22 contract tests, `test:contract`. Screens in `docs/shots/phase-1/`.
- State: T19 green. Typecheck clean. T1 to T17, T20 to T22 run and are red (`--fast` run, one fix since). T18 red: a missing page fails with a 404 load error.
- Red reasons checked: missing routes, footer, tel link, picker, `worker/lead.ts`, provenance file, stub content. T20 fails on the bare stub pages. Later specs fix their hooks in header comments: `data-testid`, `data-picker-*`, `#lead-form`, `handleLead(request, env, fetcher)`, `src/images/provenance.json`.
- Fonts: Arabic pages 69 KB (Beiruti 800 to 900, Plex 400 and 500), English 34 KB. Budget 110 KB. OFL files in `public/fonts/licenses/`. Arabic subset cut to Saudi letters and essential OpenType features to fit.
- Decided: `build.format: 'file'` and `trailingSlash: 'never'`, so old slugs keep their exact URL and the English home is `/en`, not `/en/` as `docs/url-map.csv` writes it; Phase 8 redirects `/en/`. TypeScript 5, since 7 is newer than the Astro tooling was tried with. Kitchen sink injected only under `astro dev`, so it cannot reach dist. Tokens clear Tailwind's default palette, radii, shadows and type sizes, so off-token utilities produce nothing.
- Design change: `--radius-card`, `--radius-panel`, `--color-pearl-step`, `--color-teal-step`, `--color-ink-step` added for rounded tone-step cards, which lint allows and proves it allows. `--color-teal-quiet` is 3.84:1 on pearl, large type only. `taste.mjs` passes `--allow card-rows,radius-mix` because the Reference update wins over the inspector. T22 accepts `kind: generated` with the raw file in `design/generated/`, and rejects a generated image marked `data-job`.
- T7, T12, T13 run on built pages, because they are due in Phase 3 before most pages exist; the others run on all owed routes from `docs/url-map.csv`. T18 does too.
- Worked alone with no agents: the 5-hour window was at 94% at the start. Phase 1 ran across a limit reset.
- Not verified: `Img` has not rendered, as no exports exist until Phase 4; it is typechecked only. Kitchen sink reports `Plex Arabic Fallback` as loaded on Arabic pages, cause not traced; visible text renders in Plex. T2 runs on `astro preview` until Phase 8 points it at wrangler. The full `test:contract` with Lighthouse was not run end to end.

### 2026-11-01 · Setup for overnight run
- Private repo created. Name settled as Lulwa. Added `docs/AUTORUN.md`, `docs/FOR-AMEER.md`, `docs/PHASE-PROMPTS.md`, and the reference update in `docs/DESIGN-DIRECTION.md`. Phases run one at a time in chats titled `#web-phase-N`.

### 2026-11-01 · Phase 0: audit, research, planning
- Shipped: read-only audit (`docs/AUDIT.md`), 62 before screenshots (`docs/before/`), Lighthouse and squirrelscan baselines, old site content (`docs/research/old-site-content.json`), URL map for all 75 old URLs (`docs/url-map.csv`), real-SERP competitor table (`docs/PRD.md`), PRD, design direction, test contract, agent workflow, repo rules, approved-direction hero mock (`design/mock/`), `scripts/shots.mjs` for the after shots, local git.
- Decided: rebuild, keep domain, slugs and analytics IDs. Astro 7 static on Cloudflare Workers free plan. Arabic at root, English at `/en/`. Beiruti, IBM Plex Sans Arabic, Schibsted Grotesk. Sea Pearl canvas, teal as a field, copper a dot only. Fault picker to WhatsApp. No AI chat, no dark mode.
- Thmanyah rejected: licence forbids reachable font files through web embedding and any modification.
- agy critique of the plan (`docs/research/raw/plan-critique.md`). Taken: no blanket hub redirects for unserved areas (410 instead), attribution tag on WhatsApp messages, `areaServed` and `hasMap`. Declined: Arabic slugs (ASCII slugs hold the existing equity and paste cleanly), KV lead buffer (add when failures appear).
- Left: Latin name and domain, who edited the site on 31 Oct, client fact sheet, native Arabic reader, technician reviewer, private GitHub repo (Phase 1). Client-facing audit PDF not rendered: the audit lives in `docs/AUDIT.md` and the plan; a delivery report comes in Phase 11.
- Not verified: Google results were read from Pakistan with `gl=sa`. Cloudflare's Dammam location and Hostinger's data centres are agy's claims; check `cdn-cgi/trace` at go-live. Search volumes unknown. Beiruti's designer credit and agy's legal claims about mandatory website disclosures are unconfirmed.

### 2026-11-01 · Phase 5: Services and fault pages
- Shipped: `/services`, 4 service pages (AC, fridge, automatic washer, dryer), `/faults` index and 15 fault pages, each in Arabic and English. Fault page: question h1, direct answer under 50 words, safe self-checks, what needs a technician, line drawing with the pearl on the likely part, contact close. Shots in `docs/shots/phase-5/`, looked at and fixed (oversized h1 and stretched diagram card).
- Green on these routes: T8, T10, T11, T12, T6, T21, typecheck, lint, build. Still red, owed later: T3, T4, T5 (Phase 8), T17 (no baselines until Phase 9), blog routes (Phase 6). Full `test:contract` not run.
- Unreviewed fault pages: all 15 are `noindex` and filtered from the sitemap by `reviewed` in `src/reviewed-faults.ts` (empty). List and claims in `docs/TECH-REVIEW.md`. Hubs and service pages are indexed.
- Decided: only the four confirmed services get pages. `/services/freezer-repair` set to `confirm`, 301 to the fridge page in `docs/url-map.csv`, since PRODUCT.md says fridges. No AC gas refill service is claimed; gas appears only as "needs a technician".
- Decided: washer error-code page gives no codes (brand-specific, unverifiable). Fault diagrams reuse the picker's line drawings and pearl spots; the part labels are still unconfirmed "likely" guesses.
- Decided: written by the lead alone, no agy or builders. The 10 planned agy fault drafts were skipped: copy is short, every claim needed checking anyway, and the usage notes warn agy invents facts. English h1 for the washer shortened to "Automatic washer repair" so it fits two lines at 320 px.
- Product images retried: agy 429, about 3h44m left. Fridge, washer and dryer still use drawings. Logged in `docs/FOR-AMEER.md`.
- Left: technician review, native Arabic read of the fault copy (`docs/ARABIC-REVIEW.md`), service pages have no job photos or generated product images yet. `/ponytail:ponytail-review` by eye only.

### 2026-11-01 · Phase 6: Areas, brands and the rest
- Shipped, both languages: `/about` (legal name, CR, unified number, Balady licence and expiry from PRODUCT.md), `/areas` hub and `/areas/appliance-repair-in-dammam`, `/brands` hub, `/contact` (no form until Phase 7), `/reviews`, `/work`, privacy, terms and cookie pages, `/blog` with the 3 old slugs, `/404`, `/thanks` (noindex, out of the sitemap). Footer now links to the plain pages. One template, `src/components/Page.astro`. Shots in `docs/shots/phase-6/`, looked at.
- Pruning, `docs/url-map.csv`: no coverage answers exist, so only Dammam is served. The other 17 area URLs are `410`; all 32 brand URLs are `301` to `/brands`. Which areas could return, and what each needs, is in `docs/FOR-AMEER.md`.
- Decided: no brand pages. Nothing confirms which brands the shop services and no manufacturer manual was available, so no error codes are published. The hub lists the 10 brands in plain text under the independent-shop line. No agy jobs: the area and brand notes would have been unverifiable inventions.
- Decided: no technician names, social links or legal claims beyond PRODUCT.md. Legal pages are Claude drafts, flagged for a lawyer in `docs/FOR-AMEER.md`. Emoji reviews stay off `/reviews`, as on home.
- Decided: English blog h1s shortened ("AC trouble? Check first", "Get your AC ready for summer") to hold two lines at 320 px. Phone number in legal and about text is wrapped in `<bdi>` through `set:html` in `Page.astro`.
- Green: T1, T10, T11 on every route (full e2e of routes, overflow, headlines, rtl, claims, copy parity, nap: 251 passed, then headlines re-run 43 passed after the last copy change). Typecheck, lint, build clean. `test:contract --fast` reports most tests "skipped", so I ran the specs with `pnpm test:e2e` directly. Lighthouse not run.
- Left: `/ponytail:ponytail-review` by eye only. `scripts/phase-shots.mjs` now prints errors; under Git Bash set `MSYS_NO_PATHCONV=1` or routes get rewritten. English 404 exists at `/en/404`, but Cloudflare serves one 404 page; Phase 8 decides.

### 2026-11-01 · Phase 7: Leads and tracking
- Shipped: `worker/lead.ts` (`handleLead`, Zod, 32 KB limit, honeypot, Origin check, reference, WhatsApp fallback on 502 with the lead in Worker logs), `worker/index.ts` (`/api/lead`, `/api/health`), `wrangler.jsonc` (dist as assets, Worker first for `/api/*`), `integrations/leads-apps-script/` (Sheet row, email, formula-safe cells), `integrations/README.md` (local test, deploy, first real lead), `scripts/stub-webhook.mjs`. Form on `/contact` and `/en/contact` (`LeadForm.astro`): inline errors, consent line with privacy link, success to `/thanks`, failure opens WhatsApp with the message. Events `call_click`, `whatsapp_click`, `directions_click`, `picker_complete`, `lead_submit` as `{event, location}`; GTM loads on first touch; every WhatsApp message gets `[slug utm_campaign]`. Shots in `docs/shots/phase-7/`.
- Verified: T15, T16, T9 green (15 tests). Full `pnpm test:e2e`: 417 passed; the only reds are T17 (no baselines until Phase 9) and two T3 title checks (Phase 8). Wrangler dev with the stub: lead stored, down stub gave the WhatsApp fallback, foreign Origin 403. Typecheck, lint, lint proof, build clean. Our JS gzip: chrome 0.5 KB, picker 0.7 KB, form 0.9 KB, shared 0.3 KB.
- Decided: consent is a line, not a checkbox (T16 never ticks one). The Origin check replaces a JSON-only content type check, since the T15 requests carry none. The Worker makes the reference, so the script needs no counter or lock. No rate limit beyond the honeypot (add on spam). Fixed `Button` writing `data-action` twice, which hid `directions_click`. T16 `lead_submit` now waits for the `/thanks` redirect, since the click cannot know the Worker's answer.
- Added deps: `zod`, `wrangler`; pnpm builds allowed for `esbuild`, `workerd`. ESLint ignores `.wrangler`. Script named `worker:deploy` because `pnpm deploy` is a built-in.
- Not done: no deploy, no real lead, no real secret (docs/FOR-AMEER.md). agy second opinion skipped (limits, small Worker); security review done by hand: strict schema, no secret or webhook URL in any response, no user data in URLs or events, Sheet formulas and HTML escaped. `/ponytail:ponytail-review` by eye only.
