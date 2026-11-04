# For Ameer

## Launch: what only you can do (2 Nov 2026)

The code side is done and tested (build, lint, typecheck, Playwright on real Apache and PHP). Nothing is on Hostinger yet; GitHub Pages only carries a noindex preview. Do these in order.

1. **Back up `public_html` on Hostinger** (File Manager, compress, download). Keep `config/`, `includes/`, `database/`, `admin/` and the database itself untouched: the new site does not use them.
2. **Upload:** `pnpm package` in this folder makes `hostinger-upload.zip`; the latest GitHub Actions run also offers it for download for 30 days. Extract it into `public_html` over the old files. It carries `.htaccess`, `contact-submit.php` and `logs/` at the root. Hostinger needs PHP 8.1 or newer with `mbstring` (hPanel, PHP Configuration).
3. **Mailbox:** leads go to `lulwadammam@gmail.com`, sent from `no-reply@lulwa.com.sa`, as on the live form. Make sure that sender is allowed for `mail()` on Hostinger, then **send one real test lead** from `/contact` on a phone and check it arrives. Leads are also saved to `logs/contact-submissions.log`, which the web cannot read.
4. **Check after upload:** a few old URLs open at the same address (home, `/services/ac-repair`, one brand, one area, `/blog/rss.xml`, `/sitemap.xml`, `/favicon.ico`), a real call and a real WhatsApp tap from a phone.
5. **Search Console:** the same verification tag is on every page, so the property keeps working. Resubmit `sitemap-index.xml` and inspect the home page. GA4 `G-XYKP3DY4X7`, GTM `GTM-TVK4BRTS` and Clarity `yf0k43euob` are the old IDs; confirm GTM is yours or the shop's.
6. **Know what changed on the site:**
   - No PHP admin, CMS or analytics dashboard any more. Edits go through the code.
   - The 20 area, 32 brand and 5 extra service pages (dishwasher, freezer, microwave, oven, water heater) **ask first**: they say the shop is in Al-Jalawiyah and the visitor sends the device and district on WhatsApp. They never say "we serve" or "we repair". Tell the client so they answer those messages.
   - All 15 fault pages are indexed as you asked, **without a technician having read them** (`docs/TECH-REVIEW.md`). The extra service pages' advice is also unread by a technician.
7. **By hand, outside the site:** Google Business Profile changes in `docs/GBP.md` (category and name are the biggest levers) and directory listings in `docs/CITATIONS.md`, with the same name, address and phone as the footer.
8. **Facts to confirm with the client** (none blocks launch): which areas, brands and extra appliances they really take; the Balady licence is still current; the 3 Google reviews not visible signed out; whether the 2 reviews with emoji should show.
9. **Reviews by people:** native Saudi Arabic read of `docs/ARABIC-REVIEW.md` and the new directory pages; a legal read of the privacy, terms and cookie pages (now naming Hostinger, Gmail, Google Analytics, Tag Manager and Clarity).
10. **Outer repo:** `website_old/` and `website_old.zip` sit untracked in the client repo. `website_old/config/` holds live database credentials. Never commit them; delete or move them out once the backup is safe.

Everything below is the history of earlier phases. Where it mentions Cloudflare, Workers, Apps Script, 410s or 301s to hubs, `docs/LAUNCH-PLAN.md` replaced it.


## Phase 1 (2026-11-01)
- Kitchen sink needs your OK: `docs/shots/phase-1/`. The dark toolbar in the shots is Astro's dev toolbar, not part of the site.
- The hero lines you kept (نجيك لحد بيتك / We come to you) promise home visits, which `PRODUCT.md` lists as unconfirmed. Only the dev kitchen sink uses them so far. Client must confirm before Phase 3 ships them; until then Phase 3 treats it as a placeholder.
- IBM Plex's OFL reserves the name "Plex", and subsetting counts as modifying the font. Self-hosted subsets are common practice, but a strict reading wants a renamed file or IBM's permission. Worth a look before launch.
- A quiet teal (`#3F838D`) was added for two-tone headings, a colour you have not seen in the brand. It sits at 3.84:1 on pearl, so large type only.

## Setup (2026-11-01)
- Invoices still say Luluh and luluh.com.sa (`../growth/Documents/Luluh Quotation and Invoice - *.pdf`, source `../.agency/build/invoice/build.py`). Left alone because they are client documents with prices and may already be with Waleed. Reissue under Lulwa?
- Hero changed from the horizon mock to a design based on your reference. The old mock is still in `design/mock/`.
- Generated product images on white are now allowed on the site, unbranded and recorded as generated. This reverses the earlier "real photos only" rule, at your request.
- Who edited the live site on 31 Oct? They need to stop before cutover.
- Client fact sheet: `docs/PRD.md` section 9.
- Native Saudi Arabic reader and technician reviewer: nobody lined up.
- Go-live access: Cloudflare, .sa registrar, GA4, GTM, Clarity, Search Console, automaticwashingmachine.com, a shop Google account for the Apps Script.
- New files in the client repo are not committed: `growth/Notes/Business Profile.md`, `growth/Notes/Roadmap Checklist.md`. That repo also has your own uncommitted invoice work.

## Phase 2 (2026-11-01)
- **Client questions, one message to forward** (from `docs/PRD.md` §9; nothing was sent, no answers yet):
  > السلام عليكم. عشان نجهز الموقع الجديد بدقة نحتاج منكم: 1) وش الأجهزة اللي تصلحونها بالضبط (مكيف مركزي، أفران، غسالات صحون، مايكرويف، سخانات، تنظيف مكيفات، تعبئة غاز مكيفات، تركيب)؟ 2) وش المناطق اللي تخدمونها وكم يستغرق الوصول لكل منطقة؟ 3) هل تزورون العميل في بيته دائماً؟ وهل في خدمة بنفس اليوم أحياناً؟ 4) الضمان، بكلامكم. 5) رسوم الفحص وأي أسعار ثابتة تضمنونها. 6) سنة التأسيس، وأسماء الفنيين ومناصبهم وصورهم وموافقتهم على نشرها. 7) طرق الدفع. 8) الرقم الضريبي وQR المركز السعودي للأعمال. 9) موقع الورشة الدقيق على الخريطة. 10) أي حسابات التواصل الاجتماعي اللي هي لكم فعلاً. 11) عشر صور جديدة لأعمالكم تُرسل كمستندات في واتساب، منها صورتين قبل وبعد. 12) وش هدفكم بعد 3 و6 أشهر؟
- **Home visits (placeholder):** `home.hero.homeVisitLine` is empty in both languages, so nothing promises visits. Proposed text once confirmed: نجيك لحد بيتك / We come to you. The "how a visit works" band is written as "how it starts" (photo, WhatsApp, we reply) for the same reason. The dev kitchen sink still shows the line; it never builds.
- **Reviews:** read signed out on Google Maps, 1 Nov 2026. Only 5 of 8 load in the limited view ("See more reviews (3)" did not expand). Copied exactly in `reviews.items`: Jafar Sapra (6 months ago), Shahbaz Ahmad, Sohail Jamil, Usama Ch (a year ago), Asad Amjad (2 years ago). Google shows relative dates only. Please open the listing signed in and send the other 3 with dates. Two texts contain emoji; the no-emoji rule needs a call (strip or show as written). The old site's review cards are templated, same text on every town page, names not on Google: none real, none migrated.
- **Not on the site, waiting for client:** freezers (PRODUCT.md says "fridges"), AC gas refilling, central AC, dishwasher, microwave, oven, water heater pages; all areas except Dammam (Khobar, Dhahran, Qatif, Saihat stay "keep" in `url-map.csv` but have no copy); brand specifics (error codes, which units are seen, whether each brand is served). Brand pages hold only an independent-shop line and an invitation to send the unit label. `faults.items` is empty until Phase 5.
- **Privacy, terms and cookie text** are Claude drafts, based on the design (form to Sheet and email, analytics after interaction). Check against what actually runs, ideally with someone legal. "We do not sell your data" and the Saudi-law line are mine.
- **Blog:** the 3 old posts are replaced by short, generic how-to posts on the same slugs. The old posts were full of unsourced claims. Technician to confirm the advice (filter, drain hose, lint) is right.
- Arabic doubts for the native reader: `docs/ARABIC-REVIEW.md`.

## Phase 4 (2026-11-01)
- **Home OK?** `docs/shots/phase-4/`. Layout follows your reference: picker bento, service row with call card, tinted statement, process, review, photo wall, shop, questions, close.
- **Technician check needed:** every fault-to-part link in the picker (`home.picker.appliances` in `src/content/ar.ts` and `en.ts`, pearl spots in `src/components/appliance-art.ts`) is my own reasoning. The site labels them only as "likely" (القطعة المتوقعة). Nobody has confirmed them.
- **Product images:** done in Phase 8.5. Fridge, washer and dryer are generated, checked (no logos or lettering) and exported; `scripts/gen-products.py` is only needed to redo one.
- **Photo captions are read from the photos and their file names,** not from the shop: "compressor change", "checking the wiring". Client or technician to confirm.
- **Rooftop units:** two wall photos show rooftop package units, and central AC is still unconfirmed in `PRODUCT.md`. Captions say only "rooftop AC". Drop the two photos if the client does not want to imply that work.
- **Faces:** technicians are partly visible in the photos (`compressor-install`, `rooftop-unit-repair`). Get the client's OK to publish.
- **Photos left out:** shopfront (old sign), technician-package-unit (coverall reads AJCO, another company), delivery truck and street night (plates, other shops), LG outdoor units (could read as an LG agency).
- **Reviews on home:** the two with emoji are left off until you make the Phase 2 call. Only "Good Experience" and two "Good work" show, which is thin at statement size. A longer review from the 3 unseen ones would help.
- **Map:** the tap-to-load map searches "Al-Jalawiyah, Dammam", not a pin. Needs the exact pin from the client (question 9). Directions opens the Google listing.
- **Picker areas:** Al-Jalawiyah and "another Dammam district" only, because no other area is confirmed.
- **New Arabic words for the native reader:** see `docs/ARABIC-REVIEW.md`.
- **Links:** service cards and the picker's no-JS links 404 until Phase 5 builds those pages.

## Phase 3 (2026-11-01)
- **Hero OK?** `docs/shots/phase-3/`. It follows your reference: teal panel, giant لولوه / LULWA, one AC tile.
- **Home-visit swap:** the hero says `صوّر العطل وأرسله واتساب` / `Photograph the fault and send it on WhatsApp`, which are confirmed facts. When the client confirms visits, add a dated line to `PRODUCT.md`, then set `home.hero.homeVisitLine` to `نجيك لحد بيتك` / `We come to you` in `src/content/ar.ts` and `en.ts`. It replaces the line with no code change. `home.hero.service` could then be reviewed too.
- **Hero wording I added, please check:** `نصلحه في الدمام` and `Dammam repair`. The English is short only because it must fit two lines at 320 px, and it reads a little stiff.
- **Generated image:** the AC in the tile is AI-generated and unbranded, recorded in `src/images/provenance.json`. It links to the AC service page and is never captioned as our work.
- **Logo wordmark:** only PNGs exist, so the website's is traced from one. Fine at header size. If you have a vector, it can replace the path in `src/components/Logo.astro`.
- **Two copper dots in view:** the logo's pearl and the hero's pearl. I read the logo as exempt from the one-per-view rule. Tell me if you want a one-colour logo in the bar.
- **Links:** Services, Faults, Reviews, Contact and the tile 404 until Phases 5 and 6 build those pages.

## Phase 5 (2026-11-01)
- **Technician review needed:** `docs/TECH-REVIEW.md` lists every claim on the 15 fault pages (AC not cooling, leaking, freezing, loud, not turning on; fridge not cooling, leaking, loud; washer not spinning, not draining, error code, shaking; dryer not heating, not drying well, not tumbling). All 15 are `noindex` and left out of the sitemap, so none is indexed yet. The `/faults` and `/services` hubs and the 4 service pages are in the sitemap. After the technician checks a page, add its slug to `reviewed` in `src/reviewed-faults.ts` and rebuild.
- **Pages left out:** `/services/freezer-repair` is now `confirm` in `docs/url-map.csv` with a 301 to the fridge page, because PRODUCT.md says fridges, not freezers. The dishwasher, microwave, oven and water heater pages stay `confirm` as before. No page claims gas refilling for ACs.
- **Washer error-code page** gives no codes on purpose; codes differ by brand. Phase 6 brand pages need manufacturer-checked tables.
- **Arabic additions for the native reader** are the fault pages in `src/content/ar.ts` (`faults.items`); they were written by the lead alone, not by agy.

## Phase 6 (2026-11-01)
- **Coverage answers never came, so only Dammam is served.** `docs/url-map.csv`: `/areas/appliance-repair-in-dammam` is kept; the other 17 area URLs are now `410` (no page built). Area pages that could return once the client confirms coverage, in priority order from the old `keep` rows: Al-Khobar, Dhahran, Qatif, Saihat. The rest, only if the client truly serves them and has a real job or drive time to show: Abqaiq, Al-Ahsa, Al-Awamiyah, Al-Jish, Al-Mallaha, Al-Mubarraz, Al-Qudaih, Al-Rabwah, Darin, Hofuf, Jubail, Ras Tanura, Safwa, Sanabes, Tarout, Umm As-Sahik. Each needs: a dated line in `PRODUCT.md`, neighbourhoods covered, a real drive time from Al-Jalawiyah, one real job or review. Check Search Console for traffic on these URLs before the 410 goes live.
- **Brand pages: none built.** All 32 old brand URLs now 301 to `/brands`, which lists the 10 brands in plain text under an independent-shop disclaimer. No brand has a manufacturer-checked error-code table, and nothing in `PRODUCT.md` says which brands the shop services. To earn a page a brand needs: the client confirming they repair it, and an error-code table copied from that brand's own manual (give me the manual, or a technician to read the unit's label). I did not use agy for codes; it invents them.
- **Lawyer should read** (all Claude drafts, dated 1 Nov 2026, in `src/content/ar.ts` and `en.ts` under `legal`): privacy policy (PDPL wording: who collects, what, why, where kept, rights; no mention of the Saudi data authority, retention period, cross-border transfer to Google/Cloudflare, or a contact for complaints), terms of use ("governed by the laws of the Kingdom", brand non-affiliation), cookie policy (analytics start after interaction). The "we do not sell your data" line is mine. Also the `/about` page prints the CR, unified number, Balady licence number and its Hijri expiry, all from `PRODUCT.md`; confirm the licence is still current at launch.
- **Contact page has no form yet** (Phase 7 builds it, with the consent line and privacy link). It shows WhatsApp, call, address, hours and directions.
- **Reviews page** shows the 3 emoji-free reviews; the 2 with emoji stay off until you decide. 3 of the 8 reviews are still unseen.
- **Blog:** the 3 posts keep their old slugs with short generic advice; the technician should confirm the tips.
- **No technician names or social links** are published anywhere.
- **Dammam area page is thin on purpose:** shop address, hours, the four services. No drive time, job or review is tied to Dammam specifically.

## Phase 7 (2026-11-01)
- **Deploy the lead path, then send one real lead.** Nothing is deployed. Exact steps: `integrations/README.md` (Sheet and Apps Script from the shop's Google account, two Worker secrets, `pnpm worker:deploy`, then a test lead through `/contact` to the Sheet and the email). Locally it passes against a stub: a good lead is stored, a down Sheet sends the visitor to WhatsApp with the message.
- **Need from you or the client:** the email address that should receive leads (`SHOP_EMAIL` script property), and a Google account that owns the Sheet.
- **GTM container `GTM-TVK4BRTS` now loads on first touch,** the ID kept from the old site. Ownership is unconfirmed. If it is not yours or the shop's, swap `site.analytics.gtm` in `src/site.ts`. Inside GTM you must create triggers on the events `call_click`, `whatsapp_click`, `directions_click`, `picker_complete`, `lead_submit` (each carries only `location`, the page slug) and send them to GA4.
- **Consent is a line, not a checkbox:** "By sending this request you agree...", with the privacy link. T15 and the PRD ask for a consent line. If a lawyer wants a ticked box, say so.
- **Privacy policy check:** it should name Google Sheets, Gmail and Cloudflare as places a lead passes through. Not edited this phase.
- **No form without JavaScript:** the form needs JS to send. Without it the WhatsApp and call buttons still work.
- **Rate limiting** is only the honeypot plus Cloudflare's defaults. Add a rule if spam shows.

## Phase 8 (2026-11-01)
- **Search Console access does not exist,** so no pruned URL was checked for traffic. Before go-live, open Search Console for the old site and check these: the 17 area URLs now `410` and the 32 brand URLs now `301` to `/brands` (`docs/url-map.csv`). Any with real traffic and a real service behind it should get a page back instead.
- **Schema `geo` is a placeholder:** the Dammam city centre (26.4207, 50.0888), not the shop. Send the exact pin (client question 9) and set it in `src/seo.ts`.
- **`sameAs` is empty** on purpose: no social profile is confirmed.
- **Second domain:** `public/_redirects` sends `automaticwashingmachine.com` to the washing machine page and `www.lulwa.com.sa` to the apex. They only work once those hostnames are on the same Cloudflare account. Confirm you own the second domain and what it should point to.
- **Do by hand:** `docs/GBP.md` (listing changes, nothing changed) and `docs/CITATIONS.md` (directories, nothing submitted). The GBP category fix and cleaning the stuffed name are the biggest ranking levers.
- **Technician review is the SEO bottleneck:** the 15 fault pages stay `noindex` until `docs/TECH-REVIEW.md` is done. Aim for February.
- **CSP** allows `'unsafe-inline'` scripts, because the home page has one small inline script. Tighten with hashes if wanted. After go-live, load every page once with GTM and check the console for blocked requests (GA4 and Clarity endpoints may need adding; Clarity is not in the CSP because the site does not load it).
- **OG image** is one brand card (logo on pearl, no text) for every page and both languages, not one per page.
- **Google SERP was not re-read** this phase (only autocomplete, `docs/KEYWORD-MAP.md`); the 1 Nov competitor table stands. No CAPTCHA met.

## Phase 8.5 (2026-11-01)
- **Arabic check for the new state lines:** `اختر الجهاز عشان نبدأ.`, `رسالتك جاهزة.`, `جاري تحميل الخريطة`, `جاري الإرسال`. Written by Claude, not reviewed by a native speaker.
- **Lead failure changed:** a failed form no longer jumps to WhatsApp by itself. It keeps the typed text and offers a WhatsApp button. Say if you want the jump back.

## Phase 9 (2026-11-02)
- **Look at the phone test:** nobody could hold a real Android phone overnight. Please do this once, in Arabic: open the site on the phone, swipe through the home page three or four times (it must scroll every time, no sticking), open the menu, tap the picker (pick a device, then a fault), tap the map, send a test lead, tap call and WhatsApp. Also try Chrome with the phone set to dark mode. Smooth scroll had a bug on touch that the tests found and fixed, so a real thumb is the last proof.
- **Arabic home is slightly over the speed limit:** LCP 2.1 to 2.2 s on the simulated slow phone against our 2.0 s limit. Everything else passes. See `docs/QA.md`. The home page was redesigned in the main folder during this phase, so the fix should be done there.
- **squirrelscan 80 of 100, not 90:** what is left needs facts or your decision. Notably: the 15 fault pages (30 with Arabic) stay hidden from Google until a technician checks them; the postal code of the shop is not known (add to `src/seo.ts` `postalCode` and `src/content` if you have it); posts carry no dates because no real dates exist.
- **Phase 9 is on branch `phase-9-audit`, not on `main`.** The main folder was being edited while Phase 9 ran (hero, picker, home, header, tokens, content, `gone.ts`, `_redirects`; uncommitted), and its local `main` holds redesign commits (since `2f898b7`) that were never pushed; `origin/main` is still Phase 8.5. Pushing `main` would have published that unfinished redesign, so Phase 9 ran in a separate git worktree on `2f898b7` and pushed only its branch. To take it: commit or stash the redesign work in the main folder, then `git merge phase-9-audit`. Overlaps to expect: `Picker.astro` (class `.ring` renamed `.halo`), `TopBar.astro` and `Footer.astro` (aria-label on the logo link), `tokens.css` (one comment reworded), `motion.ts`. The T17 visual baselines need regenerating again once the redesign settles: `pnpm exec playwright test tests/visual.spec.ts --update-snapshots`.
- **Lint-proof (T19)** was not re-run in Phase 9 (pnpm refuses inside a worktree). Run `pnpm test:lint-proof` once in the main folder.
- **Leftover processes I could not stop** (the tool refused): an `astro dev` and a `wrangler dev` from this repo on ports 4322 and 4321 from earlier sessions. Phase 9 used other ports. Close them if they are still running.

### Go-live checklist (Phase 10 is yours, with accounts; nothing below was done)
1. **Before anything:** back up the old site from Hostinger and store it outside the repo. Confirm who edited the live site on 31 Oct has stopped. Client approves the site. Native Arabic reader and technician sign-offs (`docs/ARABIC-REVIEW.md`, `docs/TECH-REVIEW.md`). No `TODO` left in `src/content`. Answers to the client fact sheet in `docs/PRD.md` section 9 (home visits, other areas, postal code, hours, gas refilling and other services).
2. **Decide:** the two Google reviews with emoji are shown as written; the PDPL privacy, terms and cookie text are drafts and want a legal read; second domain `automaticwashingmachine.com` needs to be on the same Cloudflare account for its redirect to work.
3. **Record DNS first:** copy every DNS record at the current host, especially MX, before moving anything. Lower the TTL a day ahead. If DNSSEC is on at the `.sa` registrar, switch it off before changing nameservers.
4. **Cloudflare:** `pnpm worker:deploy` to a preview URL; set Worker secrets (the Apps Script URL and token from `integrations/README.md`); add a rate-limit rule on `/api/*`; run `pnpm test:contract` and Lighthouse against the preview.
5. **Cutover:** add the domain to Cloudflare, recreate the records, change nameservers at the registrar (the client's OTP may be needed). Check SSL, HSTS, the redirects in `docs/url-map.csv` one by one, the 410s, `www` to apex. Check `/cdn-cgi/trace` for the colo from a Saudi connection and write it down.
6. **Apps Script:** deploy the lead sheet script from a shop Google account, point the Worker at it, send one real test lead and see it arrive in the sheet and the email.
7. **Search:** verify Search Console and Bing, submit `sitemap-index.xml`, inspect the home and the four service pages, IndexNow, GA4 conversions and GTM in preview, set the Google Business Profile website link with its UTM (`docs/GBP.md`), join the directories in `docs/CITATIONS.md` with the identical name, address and phone.
8. **After:** a real call, a real WhatsApp and a real lead from a phone; keep Hostinger paid for 30 days; rollback is putting the old nameservers back.

