# SEO migration rules (8 Nov 2026)

Ameer's top priority: the new site must keep the rankings and domain age lulwa.com.sa has today, or improve them. These rules win over design and copy decisions. Check every change against them. Sources: Google Search Central (links below), the 8 Nov 2026 audit of the live site against this build, and what went wrong on Rehan Traders.

## Baseline (live site, 8 Nov 2026)
- 75 URLs, all 200, Arabic at the root, no trailing slash, no `/en/`. 73 pages are `lang="ar"`; the two English-language posts are `ac-repair-installation-maintenance-in-dammam-the-complete-guide` and `washing-machine-maintenance-repair-services-in-dammam`.
- Live titles are Arabic and say "تصليح X في الدمام" (services, brands), "تصليح الأجهزة المنزلية في <area>" (areas).
- Live pages have about 1,300 to 2,600 words of body each, and every page links to all 9 services, 21 areas and 32 brands.

## Must
1. **Same URLs, same count.** The sitemap is exactly the 75 live URLs plus their 75 `/en/` twins (`tests/routes.spec.ts`). No new indexable pages, except blog posts published from the CMS (13 Nov 2026), each with its `/en/` twin. Never change an Arabic slug. Old physical file names stay (`docs/LAUNCH-PLAN.md`).
2. **Arabic meta on Arabic pages.** Title and description in Arabic. Keep the live title's ranking phrase word for word inside the new title (for example `تصليح مكيفات في الدمام` sits inside `صيانة وتصليح مكيفات في الدمام`). Under 70 characters, no tashkeel. Descriptions 120 to 160 characters with the page's main phrase and a WhatsApp prompt.
3. **Keep content depth.** A ranking page never gets shorter than the topics it ranked for. Long-form copy lives in `src/content/guides/*.json` and must pass `node scripts/check-guides.mjs` (banned claims, ar/en parity, near-duplicates).
4. **No doorway pages.** Area and brand pages must differ in substance, not just the name. `check-guides.mjs` fails two pages of one kind sharing more than 20% of their 5-word runs. https://developers.google.com/search/docs/essentials/spam-policies#doorways
5. **Keep internal links.** Every page links to all services, areas and brands (header menu and footer), as the live site did. https://developers.google.com/search/docs/crawling-indexing/links-crawlable
6. **One-hop 301s** for http, www, `automaticwashingmachine.com`, trailing slash, `.html`, `index.html`, `/ar/...`. Never a 302 or 307. `tests/redirects.spec.ts`. https://developers.google.com/search/docs/crawling-indexing/301-redirects
7. **hreflang** `ar-SA`, `en-SA`, `x-default` to Arabic, reciprocal, self canonical per language, in the head and the sitemap. Never canonicalise `/en/` to Arabic. https://developers.google.com/search/docs/specialty/international/localized-versions
8. **No noindex leaks.** Only `/thanks` and the 404 pages are noindex. The GitHub Pages preview is noindex by design and is never the live site.
9. **Keep old asset URLs** (images, favicon set, sitemap file names, `blog/rss.xml`).
10. **lastmod** changes only when a page's content changes (`site.updated`, post dates). https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping

## Avoid
- Rewriting a ranking title into a different topic (the blog posts nearly lost theirs on 2 Nov).
- Keyword stuffing. "High density" means the main phrase in the title, h1, first paragraph and one h2, secondary phrases once each, not repetition.
- Hasty changes in the first 2 to 4 weeks after launch, while rankings settle.

## Lessons from Rehan Traders
- `www` served a 200 copy instead of a 301. Here: one-hop rule in `.htaccess`.
- A dev page shipped and was crawlable. Here: the kitchen sink is dev only.
- `/favicon.ico` and the manifest were 404. Here: both ship.
- Trailing slash and `.html` answered 307. Here: 301.
- Nothing was indexed at launch because Search Console came last. Here: Search Console is step one of go-live.

## Go-live, in order
1. Back up `public_html`, extract `hostinger-upload.zip`.
2. `curl -I` five old URLs, `http://www.lulwa.com.sa/about`, `/about/`, `/about.html`: 200 or a single 301.
3. Search Console (verification tag already in the head): resubmit `sitemap.xml`; URL Inspection, Request indexing for `/`, `/services/ac-repair`, `/services/washing-machine-repair`, `/areas/appliance-repair-in-dammam`, the three posts.
4. Watch Page indexing and Performance daily for two weeks. Compare clicks per URL with the four weeks before launch.

## Launch, 9 Nov 2026
- Live on Hostinger through `.github/workflows/deploy.yml` (push to main, checks first, `HOSTINGER_DEPLOY=on`). Rollback: run the workflow by hand with `rollback` = `latest` or `pre-launch`.
- Ameer's call: the two English posts (`ac-repair-installation-maintenance-in-dammam-the-complete-guide`, `washing-machine-maintenance-repair-services-in-dammam`) stay English at their root URL with the live title phrase; their `/en/` twin is a one-hop 301 to it (`src/english-root.json`). Sitemap: 148 URLs.
- Post-launch check: `docs/qa/post-launch.json` (148/148 answer 200, canonicals unchanged against `docs/qa/pre-launch.json`). Open: `http://www.` takes two hops because Hostinger forces HTTPS before `.htaccess` runs.
