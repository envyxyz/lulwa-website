# Phase prompts

Copied from the plan Artifact on 2026-11-01. docs/AUTORUN.md overrides anything here that conflicts with it.

## Phase 1: Test contract and foundation

**Goal:** All 22 tests written and red. Astro scaffold, tokens, fonts, content types, lint rules, kitchen sink.
**Skills:** design-system-init (adapted to Astro), impeccable craft floor, ponytail, context7
**Agents:** Lead + Sonnet A (scaffold, i18n, lint) + Sonnet B (all tests)
**Done when:** Lint rules proven to fire with deliberate violations. Tests exist and fail for the right reason. Kitchen sink approved.

PHASE 1: Test contract and foundation. Nothing user-facing beyond a kitchen sink.

Create the private repo first: gh repo create lulwa-website --private --source=. --remote=origin, committing the planning docs and docs/before.

Split per docs/AGENTS.md. Sonnet A in a worktree: scaffold latest Astro with pnpm into a temp folder and move it in (the folder is not empty), TypeScript strict, static output, Tailwind v4 through @tailwindcss/vite, i18n with ar as default at the root and en at /en/, no prefix on default. ESLint with eslint-plugin-astro plus stylelint: fail on raw hex, arbitrary Tailwind values, physical CSS direction, literal copy in components. Prove each rule fires with a deliberate violation, then remove it. Check current Astro and Tailwind docs with context7.

Sonnet B in a worktree: write every test in docs/TEST-CONTRACT.md with Playwright (installed Edge channel), @axe-core/playwright, and lighthouserc.cjs reading the built sitemap. A script test:contract runs them. They must fail now, for the right reason. Include scripts/check-photos.mjs and port design-taste-frontend's lint.mjs and inspect.mjs calls into a script.

Lead, yourself: src/styles/tokens.css from the Website Overrides in DESIGN.md. Fonts: pip install fonttools brotli, then subset and self-host Beiruti (Arabic, weights 800 to 900 only), IBM Plex Sans Arabic (400, 500), Schibsted Grotesk (variable Latin); confirm each OFL file is kept; size-adjust fallbacks; preload only the display face of the page's language; total under 110 KB. Base layout sets lang and dir. Components: Container, Section, Heading, Text, Button (whatsapp, call, quiet), Icon (lucide stroke 1.75, mirrored where directional), Img. src/site.ts holds name in both scripts, brand.latin, site.url, legal name, CR, phone formats, hours; one line changes the Latin name or domain. src/content/types.ts with ar.ts and en.ts stubs. /dev/kitchen-sink, noindex, excluded from production and the sitemap.

Green by the end: T19. Everything else red on purpose. Update Commands in CLAUDE.md.

## Phase 2: Content and truth

**Goal:** Every page's Arabic and English copy, from the old site where true, in typed files, with no unsourced claim.
**Skills:** antigravity-cli, anti-ai-slop-writing, impl-validator
**Agents:** Lead (truth, shape) + Sonnet A (types, parity) + Opus orchestrator with 15 agy jobs
**Done when:** T6 and T21 green. Doubtful Arabic listed for the native reader. Fact sheet gaps listed for me.

PHASE 2: Content and truth. Touch src/content/ and tests only.

Lead: send me the open questions from docs/PRD.md section 9 as one message I can forward to the client. Record each answer with its date in PRODUCT.md and only then allow it in tests/claims.spec.ts. Read the 8 real reviews from the public Google listing in the browser pane, signed out, and copy them exactly with name and date as shown, with the as-of date. Do not sign in. Confirm none of the old site's review cards is real before dropping it.

Sonnet A: finalise types.ts so a missing section in either language is a type error. Page groups: home, services, faults, areas, brands, about, contact, reviews, work, legal, blog.

Spawn one Opus orchestrator in the background. It runs 10 parallel agy jobs, one per page group, each given that group's entries from docs/research/old-site-content.json, types.ts, the banned list from TEST-CONTRACT T6 and the voice rules in docs/DESIGN-DIRECTION.md, printing natural Saudi Arabic in the required shape, leaving a TODO for anything not in PRODUCT.md. Fault pages wait for phase 5. Then 5 agy jobs write the English twins as faithful plain English, not literal translation. It checks every result against PRODUCT.md, runs the claims test, applies anti-ai-slop-writing, and writes the files. agy invents facts; nothing unchecked passes. Never make لولوه the subject of a coming or visiting verb.

Unsure Arabic goes to docs/ARABIC-REVIEW.md for the native reader. Green by the end: T6, T21.

## Phase 3: Chrome and hero

**Goal:** Port the approved hero. Top bar, language link, footer, phone bottom bar, the seam moment.
**Skills:** impeccable, design-taste-frontend, apple-design, ponytail
**Agents:** Lead (hero) + Sonnet A (chrome) + Sonnet B (tests) + 2 agy reviews
**Done when:** T7, T12, T13 green. Hero matches the mock at every width. Lighthouse on home 95+ in a clean run.

PHASE 3: Chrome and hero.

Read impeccable's craft-floor before any UI edit. Lead ports design/mock/hero.html to Astro, Arabic first, then the English twin: two fields meeting at a hard horizon, question on pearl, answer on teal, copper pearl as the full stop. The mock hides a keyword line inside the h1; do not ship hidden text. Make the visible supporting sentence, with service and city, part of the h1 instead. WhatsApp and call buttons, with phone number and hours visible. The h1 never animates. One authored moment: the teal field rises to the horizon on load, from a visible default, off under reduced motion.

Sonnet A: top bar (logo from ../growth/Brand as inline SVG, three or four links, language link to the exact twin URL), phone menu as a small vanilla island, footer (phone number as the headline, address, hours, legal name, CR 2050163881), Ink bottom bar on phones with WhatsApp and Call. Theme selection, caret, focus rings, scrollbar, underlines from tokens.

Sonnet B: make T7, T12, T13 pass against the real pages and add any missing case.

Run 2 agy jobs: Saudi Arabic review of all chrome copy; second-opinion review of the diff. Check their output yourself. Run design-taste-frontend lint and inspect on the home page and fix every FAIL. Check apple-design for press feedback on buttons and the menu. Lighthouse on home, phone, 3 runs, clean machine, report the median.

## Phase 4: Homepage and fault picker

**Goal:** Every home band from the direction, the fault picker with drawn appliances, the photo pipeline.
**Skills:** design-taste-frontend, impeccable, apple-design, ui-ux-pro-max, anti-ai-slop-writing
**Agents:** Lead (picker logic, direction) + Sonnet A (bands) + Sonnet B (photos, tests) + 3 agy jobs
**Done when:** T14, T22 green. Neighbouring bands never share a geometry. Screens approved.

PHASE 4: Homepage and fault picker. Bands and order: docs/DESIGN-DIRECTION.md. Do not fall back to cards.

Lead: fault picker as a vanilla island under 4 KB. Appliance, then fault, then area. Pearl moves on the line drawing to the likely part, the WhatsApp link rewrites itself in the page's language, with a short source tag at the end. Without JS it is plain links to service and fault pages. Thumb-sized, keyboard complete.

Sonnet A: the other bands: what we repair as comparison text, how a visit works as stepped display lines, one real review at statement size, real work wall, the shop with address rows, hours table with today marked, tap-to-load map, questions with large type, close.

Sonnet B: scripts/images with sharp: export AVIF and WebP from ../growth/Photos/Edited, never larger than the source width, with a provenance entry per photo; keep the shopfront photo out, and check technician-package-unit_01 for another company's lettering. Then tests T14, T22.

3 agy jobs: fault lists per appliance in Saudi Arabic, line-diagram SVG drafts (geometry only, teal stroke, one copper pearl), design critique of the screenshots. A technician must confirm which part each fault points to; mark TODO until then and say so in the UI only as "likely".

Run design-taste-frontend's inspect and critique, three rounds at most. Screens for my OK.

## Phase 5: Services and fault pages

**Goal:** Service template and pages. 12 to 16 fault pages, the content moat.
**Skills:** impeccable (Read mode for faults), seo, ai-seo, anti-ai-slop-writing
**Agents:** Lead (templates) + Sonnet A (service) + Sonnet B (fault) + Opus orchestrator with 10 agy jobs
**Done when:** Every confirmed service and fault live in both languages, technician-review list delivered.

PHASE 5: Services and fault pages. Templates: docs/PRD.md section 6. Slugs: docs/url-map.csv and section 5.

Lead designs both templates, with the service page in Persuade mode and fault pages in Read mode with a direct answer in the first 50 words, a safe self-check, what needs a technician, the diagram with the pearl, and a contact close. Keep existing slugs. Only repairs confirmed in PRODUCT.md get a page; the rest follow docs/url-map.csv.

Sonnet A builds service routes. Sonnet B builds fault routes and the /faults index. Separate worktrees, no shared files.

Orchestrator: 10 agy jobs, one per fault, each with the keyword from docs/research/raw/keywords.md, printing a draft in the fault shape. Check every fact, cut every price, cut anything a homeowner could hurt themselves doing (electrical, refrigerant). English twins after Arabic. Include fault pages for what people actually type: AC not cooling, leaking water, freezing up, loud; fridge not cooling, leaking; washer not spinning, not draining, error codes; dryer not heating.

Write docs/TECH-REVIEW.md listing every technical claim for the technician, and docs/ARABIC-REVIEW.md additions. Pages with unreviewed claims stay out of the sitemap until reviewed; tell me which.

## Phase 6: Areas, brands and the rest

**Goal:** Only area and brand pages that can be true and useful. About, contact, reviews, work, legal, blog, 404.
**Skills:** impeccable, seo, design-system-audit, anti-ai-slop-writing
**Agents:** Lead (templates, pruning) + Sonnet A (area, brand) + Sonnet B (rest) + Opus orchestrator with 8 agy jobs
**Done when:** T1, T10, T11 green. Every route has a twin. Pruning applied to url-map.csv.

PHASE 6: Areas, brands and remaining pages.

Lead: update docs/url-map.csv from the client's coverage answers. An area page ships only with something true and local: neighbourhoods covered, a real job or review, real drive time from Al-Jalawiyah. Otherwise it does not exist. Brand pages: independent-service disclaimer, real error codes per family, no prices. If fewer than 10 brands earn a page, ship fewer.

Sonnet A: area and brand templates and hubs. The hubs name every brand and served area in plain text. Sonnet B: about (legal name, CR, Balady licence, real facts only), contact, /reviews, /work, truth-passed legal pages with PDPL wording checked, 3 existing blog posts with twins, 404, /thanks noindex.

Orchestrator: 8 agy jobs for local notes per served area and error-code tables per brand. Error codes must be checked against the manufacturer manual or dropped; agy invents these.

Migrate the privacy, terms and cookie text and list anything a Saudi lawyer should read. Green by the end: T1, T10, T11.

## Phase 7: Leads and tracking

**Goal:** Lead form, Worker, Sheet, email, WhatsApp fallback, conversion events.
**Skills:** security-review, ponytail
**Agents:** Lead (review) + Sonnet A (Worker, Apps Script) + Sonnet B (form, events, tests) + 1 agy review
**Done when:** T9, T15, T16 green. One real lead through to the Sheet.

PHASE 7: Leads and tracking. Reuse ../rehan-traders/website/worker/book.ts and integrations/booking-apps-script/ as the starting point: read them, strip what this site does not need (slots, photos, job cards, AI).

Sonnet A: worker/lead.ts with Zod (name, phone, appliance, area, message; 32 KB body limit), honeypot, posts to the Apps Script webhook using a secret, returns a reference. Apps Script: Sheet row plus email to the shop. Secrets only in .env.local and Worker secrets. wrangler config serving dist/ with /api/* to the Worker.

Sonnet B: form on /contact with labels, inline errors, PDPL consent line and privacy link, no pre-ticked boxes; on success /thanks with a WhatsApp button; if the Sheet fails, WhatsApp still opens with the message. Events through GTM after first interaction: call_click, whatsapp_click, directions_click, picker_complete, lead_submit, with a location slug and no personal data. Source tag on every WhatsApp message: page slug, plus utm_campaign in sessionStorage.

Skipped on purpose: KV buffer. Add when Sheet failures show in logs.

Lead runs /security-review, plus one agy second-opinion on the Worker. I deploy the Apps Script from the shop's Google account; give me exact steps in integrations/README.md. One real test lead when it's deployed.

## Phase 8: SEO and AI search

**Goal:** Redirects, hreflang, schema, titles, sitemap, robots, keyword pass, GBP and citation hand-offs.
**Skills:** seo, schema, seo-audit, ai-seo, core-web-vitals
**Agents:** Lead (keyword map, titles) + Sonnet A (schema, hreflang, sitemap) + Sonnet B (redirects, robots, OG) + Opus orchestrator with 8 agy jobs
**Done when:** T2 to T5 green. docs/GBP.md and docs/CITATIONS.md delivered.

PHASE 8: SEO and AI search.

Lead: recheck real Google in the browser pane with gl=sa for the queries in docs/PRD.md section 4, plus Google autocomplete for each service and city. Never bypass a CAPTCHA. Use what is found, not what agy says ranks. If Search Console access exists, pull existing queries and check any pruned URL with traffic before removing it. Finish docs/KEYWORD-MAP.md: one primary query per page, no cannibalising.

Sonnet A: JSON-LD: HVACBusiness with name, legalName, telephone, address, geo, hours 08:00 to 23:00, areaServed, hasMap to the Google listing, sameAs only for profiles the client confirmed; Service; BreadcrumbList; FAQPage for AI search only; Article with publisher logo. No AggregateRating. Sitemap with xhtml:link alternates in both languages. Reciprocal hreflang ar-SA, en-SA, x-default to Arabic.

Sonnet B: public/_redirects from docs/url-map.csv in one hop, including /en and second-domain handling; the Worker returns 410 for removed area URLs. robots.txt per docs/PRD.md section 8. llms.txt generated from content. Static OG images per page in the brand. Favicon set from the logo. _headers with CSP matching what actually loads.

Orchestrator: 8 agy jobs: title and meta drafts per page group (Arabic under 60 characters, service plus city first, phone in the description), and teardowns of the top 5 real results per service. Check everything.

Write docs/GBP.md for me: exact listing changes (category, phone, name without stuffing, hours, services, photos, website link with UTM). Write docs/CITATIONS.md: the directories to join, with one identical name, address and phone. Do not tell the client to verify from KSA unless I say so.

## Phase 9: Tests and audits

**Goal:** Everything green. Every audit run once, fixes applied, numbers recorded.
**Skills:** web-quality-audit, audit-website, seo-audit, web-design-reviewer, web-design-guidelines, impeccable audit and polish, design-taste-frontend, apple-design, design-system-audit, ponytail-audit, security-review, core-web-vitals
**Agents:** Lead (triage) + Sonnet A, B, C (fix batches) + Opus orchestrator with 5 agy audits
**Done when:** All 22 tests green. Lighthouse 95+ on every route both languages, squirrelscan 90+. docs/QA.md written.

PHASE 9: Tests and audits. This is the full audit pass.

Run with nothing else heavy on the machine: pnpm test:contract, Lighthouse CI on every route in both languages (3 runs, median), squirrel audit on the local build with --level full --offline. Then /web-quality-audit, /audit-website, /seo-audit, /web-design-reviewer, /web-design-guidelines, /impeccable audit and polish, design-taste-frontend inspect and its critique rubric, apple-design on all motion and press states, /design-system-audit, /ponytail:ponytail-audit, /security-review.

Orchestrator: 5 agy second-opinion audits on the built site: accessibility in Arabic, technical SEO, performance, copy against docs/PRODUCT.md, security. Verify before accepting a finding.

Lead triages into three independent fix batches, Sonnet A, B and C, each in its own worktree, no shared files. Fix root causes. Re-run until green. Do not lower a threshold to pass; if one truly cannot be met, tell me with evidence. Test by hand on a real Android phone in Arabic, keyboard only on desktop, and with reduced motion.

Write docs/QA.md: every score, with the machine conditions. Report ranges honestly.

## Phase 10: Go live

**Goal:** Move the domain with no downtime. Search and analytics connected.
**Skills:** seo, core-web-vitals
**Agents:** Lead with me. No parallel work on a live domain.
**Done when:** Live on Cloudflare, every URL in the map checked in production, colo recorded, rollback tested on paper.

PHASE 10: Go live. Do each outward step only after I confirm it. I sign in to every dashboard.

Preflight: a full backup of the old site from Hostinger stored outside the repo; who edited it on 31 Oct has stopped; client approved the site; native Arabic and technician sign-offs done; no TODO in src/content; docs/QA.md green. Check DNS for MX and other records on the domain, and copy every record before moving anything.

Steps: Cloudflare Workers deploy to a preview URL and run test:contract and Lighthouse against it. Add the domain to Cloudflare, recreate DNS records, lower TTL. I change nameservers at the .sa registrar, with the client's OTP if required. Disable or update DNSSEC first if it's on. Confirm SSL, HSTS, redirects. Check cdn-cgi/trace colo from a Saudi connection if the client can open it; record the result. Set Worker secrets, rate-limit /api/* with a Cloudflare rule.

After: Search Console and Bing verified, sitemap submitted, URL inspection on top pages, IndexNow, GA4 conversions and GTM checked in preview, GBP website link with UTM, automaticwashingmachine.com 301s to the matching pages if I have access, a real call, WhatsApp and lead from a phone. Keep Hostinger hosting paid for 30 days. Rollback: put the old nameservers back. Write docs/LAUNCH.md.

## Phase 11: After shots and brag video

**Goal:** Same pages, same widths, same machine. A short video and a change report built from real numbers.
**Skills:** brag, create-audit-proposal Mode D, anti-ai-slop-writing
**Agents:** Lead (video, report) + Sonnet A (after shots) + 2 agy jobs
**Done when:** docs/after/ matches docs/before/ file for file. Video and report approved.

PHASE 11: After shots and brag video.

Sonnet A: node scripts/shots.mjs https://the-live-domain docs/after/ using the same pages and viewports as docs/before/, on the same machine. Run Lighthouse the same way as docs/research/lighthouse-before/ for a fair comparison. Build a table of before and after numbers: Lighthouse, squirrelscan, JS, HTML weight, pages indexable in English, unsourced claims removed.

Lead: run /brag to make the launch video in Hyperframes from the real site and the paired shots. Opening: the old hero's paragraph and floating cards. Middle: the seam, the fault picker with the pearl moving. Close: scores and the phone number. Use measured numbers only. Save the raw before and after pairs for social.

Then /client-kit:create-audit-proposal in Mode D for the delivery report, in English and Urdu, with the Arabic SAR version for the client if I ask. Keep before and after screenshots in it. Copy the finished PDFs to ../growth/Documents. Two agy jobs: Urdu and Arabic review of the report.

## Phase 12: After launch

**Goal:** Ongoing rank and review work. One item per chat.
**Skills:** seo-audit, ai-seo, audit-website
**Agents:** As needed, one item per chat
**Done when:** Rolling.

PHASE 12: After launch. One item per chat. Tell me which item this chat is for.

- Weeks 2, 4, 8, 12: Search Console review: striking-distance queries in positions 8 to 20, weak click-through titles, indexing errors, hreflang errors. Re-audit with squirrel; compare against the Phase 9 baseline.
- Reviews: a QR sticker and a one-line WhatsApp request after each job, in Arabic. Replies to every review.
- Content: one real fault or job page every two weeks, written with the technician. AC faults and cleaning must be indexed by February, ahead of the summer peak.
- Short real videos on Instagram and TikTok, Arabic captions naming service and city. No AI video.
- Replace small WhatsApp photos as better job photos arrive; swap the shopfront in when the new sign is up.
- Ads only after conversion tracking has run clean for two weeks, landing on the matching service page.
