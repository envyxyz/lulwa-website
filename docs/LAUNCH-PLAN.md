# Launch plan, 2 Nov 2026

Ameer's instructions today. These win over every older doc (CLAUDE.md, PRD, AUTORUN) where they conflict.

## Ameer's rules
1. **Hosted on Hostinger** (Apache/LiteSpeed with PHP, `public_html`), not Cloudflare. Remove the Worker path.
2. **Slugs and file names never change.** Every URL in `docs/url-map.csv` is a real 200 page at its original path. Old physical file names stay too: `about.html`, `services/index.html`, `services/ac-repair.html`, `areas/index.html`, `brands/index.html`, `contact-submit.php`, `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `manifest.json`, `browserconfig.xml`, `robots.txt`, `llms.txt`, `ai.txt`, `sitemap.xml`, `sitemap-index.xml`, `sitemap-pages.xml`, `sitemap-services.xml`, `sitemap-areas.xml`, `sitemap-brands.xml`, `sitemap-blog.xml`, `blog/rss.xml`, `images/og-default.png`, `images/brand/lulwa-logo.png`, `images/icons/*`, and every old image under `images/`, `assets/img/`, `uploads/`, `blog/images/`.
3. **Old site** in `../website_old` is the live site and its SEO works. Take its tags. Never copy `config/`, `includes/`, `database/`, `admin/`, `logs/`; `config/database.php` holds live credentials, never print or commit it.
4. **Button words:** just `WhatsApp` / `واتساب` and `Call` / `اتصال`. No "WhatsApp us", no "Call us".
5. **No sticky call and WhatsApp bar on phones.**
6. **Favicon** shows in Google and everywhere. **No NAP inconsistency.** Ready for search engines and LLMs.
7. Production ready. Nothing left on the code side.

## Facts settled today
- Slugs that were 410 or 301 (20 areas minus Dammam, 32 brands, 5 services) become real pages, in Arabic at the root and English under `/en/`. English twins are additive, so they change no old slug.
- Nothing has confirmed those services, areas or brands. So those pages **ask first**: they say the shop is in Al-Jalawiyah, Dammam, and that the visitor sends the device and district on WhatsApp and the shop replies whether it can take the job. They never say "we serve X", "we repair X", or promise a visit. Titles keep the old ranking words, for example `تصليح أجهزة LG في الدمام | لولوه للتكييف والتبريد`.
- Banned everywhere: 5,000 or any count, 10+ years, 98%, 99%, 4.9, certified or معتمد, 24 hours, same day or نفس اليوم, original or أصلية, arrival times, prices, SAR or ريال, warranty or ضمان, home visit or زيارة منزلية, "service report", invented reviews, emoji. Never make لولوه the subject of a verb (it is a woman's name): write "نرد عليك", "ورشتنا".
- Email `lulwadammam@gmail.com` is owner-approved (contact-submit.php comment, 31 Oct 2026). Geo `26.435556, 50.079611` and map `https://maps.app.goo.gl/6iLsTdG3y7FAq7jP9` come from the live schema.
- Tags: Search Console `NhugWL1gVcIPJCf6bi0eTNAXzZ2v7ZZvIHHS-Neh2E4`, GA4 `G-XYKP3DY4X7`, GTM `GTM-TVK4BRTS`, Clarity `yf0k43euob`, loaded as in the old `<!-- tracking:start -->` block (first interaction, or idle 3.5 s after load).
- The 15 fault pages get indexed: `src/reviewed-faults.ts` lists them all. Ameer wants nothing held back.

## Physical output
`dist/` is uploaded to `public_html` as is. A post-build step moves pages to the old physical shape: `dist/services.html` to `dist/services/index.html`, same for `areas`, `brands`, `blog`, `en`, and under `en/`: `en/services.html` to `en/services/index.html` and so on. Leaf pages stay `x.html`. Clean URLs come from `.htaccess`, based on `../website_old/.htaccess`.

## Work split and file ownership
Work in this folder. Edit only what you own. Others are editing at the same time, so a build error in a file you do not own means wait and retry. Build with `pnpm exec astro build --outDir <your own dir>`, never into `dist/` (the lead owns `dist/`). No commits, the lead commits. No deploys, no sign-ins, no messages to anyone.

| Owner | Files |
|---|---|
| **Hostinger builder** | `scripts/redirects.mjs`, new `scripts/postbuild.mjs`, new `scripts/package-hostinger.mjs`, `public/.htaccess`, `public/contact-submit.php`, `public/logs/`, `src/components/LeadForm.astro` (submit path only), remove `worker/`, `wrangler.jsonc`, `integrations/`, `public/_redirects`, `public/_headers`, `package.json`, `playwright.config.ts`, `pnpm-workspace.yaml`, `docs/url-map.csv`, `tests/redirects.spec.ts`, `tests/lead.spec.ts`, `tests/lib.ts`, `scripts/test-contract.mjs` |
| **SEO builder** | `src/layouts/Base.astro`, `src/seo.ts`, `src/site.ts`, `src/scripts/track.ts`, `astro.config.mjs`, `src/pages/*.txt.ts`, `src/pages/*.xml.ts`, `public/robots.txt`, `public/manifest.json`, `public/browserconfig.xml`, `public/favicon*`, `public/images/brand`, `public/images/icons`, `scripts/brand-assets.mjs`, old image copies, `tests/seo.spec.ts`, `tests/schema.spec.ts`, `tests/nap.spec.ts`, `tests/analytics.spec.ts`, `tests/budget.spec.ts`, `tests/hreflang.spec.ts`. May edit only the `shop` block of `src/content/ar.ts` and `en.ts`. |
| **agy orchestrator** | `src/content/directory/*.json`, `design/generated/`, `public/images/` new product exports, `src/images/provenance.json`, `docs/qa/agy-launch-*.md` |
| **Lead** | Everything else: `src/content/ar.ts`, `en.ts`, `types.ts`, pages, components, `BottomBar`, `TopBar`, the ask-first template, hubs, remaining tests, `CLAUDE.md`, `PRODUCT.md`, `dist/` |

## Directory data (agy orchestrator writes, lead renders)
`src/content/directory/brands.json`, one per old brand page, 32:
`{ "slug": "lg-appliance-repair", "name": { "ar": "إل جي", "en": "LG" }, "titleName": { "ar": "LG", "en": "LG" }, "note": { "ar": "...", "en": "..." }, "services": ["ac-repair", "refrigerator-repair", "washing-machine-repair", "dryer-repair"] }`
`titleName.ar` is the exact name inside the old Arabic title. `note` is one or two plain sentences about what that brand makes. `services` holds only slugs of `ac-repair`, `refrigerator-repair`, `washing-machine-repair`, `dryer-repair` that the brand really makes.

`src/content/directory/areas.json`, one per old area page except Dammam, 20:
`{ "slug": "appliance-repair-in-al-khobar", "name": { "ar": "الخبر", "en": "Al-Khobar" }, "km": 25, "note": { "ar": "...", "en": "..." }, "near": ["appliance-repair-in-dhahran", "..."] }`
`km` is straight-line distance from the shop at 26.435556, 50.079611, rounded to the nearest 5. `note` is one or two checked sentences of plain geography (which governorate, what it is next to). `near` is the 3 nearest area slugs.

`src/content/directory/services.json`, 5: dishwasher, freezer, microwave, oven-stove, water-heater, each with old slug:
`{ "slug": "dishwasher-repair", "name": { "ar": "غسالات الصحون", "en": "Dishwashers" }, "title": { "ar": "تصليح غسالات صحون في الدمام", "en": "Dishwasher repair in Dammam" }, "description": { "ar": "...", "en": "..." }, "problems": [{ "name": { "ar": "", "en": "" }, "signs": { "ar": "", "en": "" } }], "checks": { "ar": [""], "en": [""] }, "stop": { "ar": [""], "en": [""] }, "faq": [{ "q": { "ar": "", "en": "" }, "a": { "ar": "", "en": "" } }], "image": "dishwasher" }`
4 problems, 3 safe self-checks, 3 stop-and-call items (gas and electrics must be firm), 2 FAQs. Every sentence safe, general, and free of shop promises. Same-length arrays in both languages.

## Tests
Green at the end: typecheck, lint, every Playwright spec except where this plan changes the rule, then Lighthouse. T3's Arabic title limit is now 70 (the live home title is 68). T2 now expects every url-map row to return 200 at its original path, one-hop 301 for `.html`, trailing slash and the old `/ar/...` and root-slug aliases.
