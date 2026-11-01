# Audit of lulwa.com.sa

Run 1 Nov 2026 from Pakistan, read-only. Lighthouse ran locally, so scores are indicative; compare them only with runs from this machine. Raw files in `docs/research/`. Screens in `docs/before/`.

## Scores

| Page | Perf | A11y | Best | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home, phone, run 1 | 72 | 100 | 100 | 100 | 2.7 s | 1,000 ms | 0.001 |
| Home, phone, run 2 | 76 | 100 | 100 | 100 | 2.4 s | 830 ms | 0.004 |
| Home, desktop | 88 | 100 | 100 | 100 | 1.5 s | 130 ms | 0.005 |
| AC repair, phone | 74 | 100 | 100 | 100 | 2.0 s | 1,290 ms | 0.025 |
| Dammam area, phone | 68 | 100 | 92 | 100 | 2.5 s | 1,460 ms | 0.002 |
| Contact, phone | 83 | 100 | 100 | 100 | 1.8 s | 640 ms | 0.021 |

Squirrelscan offline quick crawl, 25 pages: **51, F**. SEO group 51, performance 51, accessibility 50, structured data 43, agent experience 46, security 95. It is stricter than Lighthouse: three inputs without labels on `/services/dishwasher-repair`, focusable elements inside `aria-hidden` on two pages, Article schema without a publisher logo on two posts.

## Stack

Hand-built static HTML on Hostinger shared LiteSpeed. No framework, no visible build step, patched by scripts (the HTML names `tools/defer_tracking.py`). `/components/Header.js` (46 KB), `Footer.js` (35 KB) and `FloatingButtons.js` (5 KB) inject the chrome with JavaScript. CSS is inlined per page, 82 KB on the home page. HTML is 145 to 273 KB per page.

Worth keeping: clean slugs, AVIF images, CSP and HSTS headers, deferred analytics, unique Arabic titles and descriptions, a real volume of Arabic service copy, legal pages.

**The site was changed on 31 Oct 2026** (`Last-Modified`, sitemap `lastmod`), and it already carries the teal, the phone decision and a lam mark. Someone is actively editing it. Find out who before cutover.

## Findings, worst first

1. **Unverifiable claims on every page.** 5,000+ customers, 10+ years, 98% success, 50+ brands, 4.9/5, certified technicians (74 mentions of معتمد), original parts (142), same day (637), 30 to 60 minute arrival, inspection from SAR 150, repairs SAR 180 to 850. None has a source in the brief. They also appear in Google's snippets ("⭐ 5,000+ Repairs").
2. **Reviews that look invented.** Three star cards with names on the home page and a "Google ★ 5.0" card on service pages. The same review, "the technician arrived within an hour in Al-Rawdah", repeats across 21 city pages with only the city swapped. The real Google listing has 8 reviews. Phase 2 copies those in and drops these cards.
3. **Doorway risk.** 21 area pages share 45% of their text on average (5-word shingles, up to 57%) with one H1 pattern, and reach Al-Ahsa, Hofuf and Jubail on the site's own "90 minute" drive times. 32 brand pages share 23%, with invented-looking price ranges. Google's scaled content and doorway policies name exactly this.
4. **English is invisible.** One URL per page; a button swaps 650 `data-en` strings client-side. No `hreflang` on any page. The toggle sets `lang="en"` but leaves the Arabic `<title>`. Google has one version of each page. `/en` redirects to the Arabic home. `llms.txt` still says "English is primary".
5. **Language flip half done.** Google still shows old English titles such as "Appliance Repair Saihat | Same'Day Service" with a stray apostrophe, while the HTML is now Arabic. Two blog posts are English only on an Arabic site.
6. **Business facts contradict the brief.** Schema hours are 00:00 to 23:59 against the settled 8 AM to 11 PM. Services include dishwashers, microwaves, ovens and water heaters; the Balady licence covers AC and refrigeration. `streetAddress` is only the district. No `legalName`, no CR number in schema.
7. **Performance is a JavaScript and HTML weight problem.** TBT runs 640 to 1,460 ms on phones against a 200 ms target. LCP is acceptable. Patching can't fix this: chrome injection and per-page inline CSS are the architecture.
8. **Generic look.** Pill eyebrow, underlined headline, floating icon cards, emoji throughout (up to 139 per page), rainbow tinted icon squares, 10-line hero paragraph, 27,000 px tall on phones.
9. **Google Business Profile is off.** Public listing, 1 Nov 2026: name stuffed with keywords (مؤسسة لولوه صيانه الغسالات اتوماتيك والعادي الإلكترونيه والثلاجات مكيفات اسبلت), primary category "wholesale electronics supplies", old phone 055 192 2197, opens 8:30 AM. Not on page one for صيانة مكيفات الدمام, and not in the first 10 map results for it. Checked with `gl=sa` from Pakistan, so local results may differ in Dammam.
10. **Small defects.** OpenStreetMap iframe blocked by the site's own CSP on area pages. GTM iframe without a title. CCBot and ClaudeBot blocked in robots while the retrieval bots are open. Second site automaticwashingmachine.com still live with retired number 054 400 6384.

## Decision: rebuild, keep the content and the URLs

| Question | Patch the old site | Rebuild |
|---|---|---|
| 95+ performance on phones | Needs removing JS chrome and inline CSS from 75 files, which is a rewrite anyway | 0 KB JS baseline |
| Indexable English | Needs a second set of 75 files by hand | One typed content file per language |
| Design system | No components to hang tokens on | Tokens, lint rules and components from day one |
| Anti-slop look | Every section replaced | Designed fresh |
| Fake claims and doorways | Every page edited | Pages built only from confirmed facts |
| Ranking equity | Kept | Kept: same domain, same slugs, 301s for pruned pages |

Lighthouse accessibility and SEO are already 100, so the rebuild's case rests on performance, English, truth and looks. It does not rest on those two scores. Your instinct to start from scratch is right.
