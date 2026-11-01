# For Ameer

Questions, verifications and access needed, gathered while Ameer sleeps. Nothing here blocked the work. Phase sessions append under their phase.

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
- **Product images incomplete:** agy's image quota ran out (429, reset about 4.5 hours after 09:15 on 1 Nov). Window AC and outdoor unit came through, checked, no logos or lettering. Fridge, washer and dryer cards show line drawings for now. To swap: `python scripts/gen-products.py`, look at each image, `node scripts/images.mjs`, `pnpm build`. The cards pick them up with no code change. The compressor image was dropped, since nothing on the page uses it.
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
- **Product images still missing:** retried 1 Nov 2026 on fridge. agy returned 429 with about 3h44m left. Fridge, washer and dryer still use drawings. To finish: `python scripts/gen-products.py`, look at each, `node scripts/images.mjs`, `pnpm build`.
- **Washer error-code page** gives no codes on purpose; codes differ by brand. Phase 6 brand pages need manufacturer-checked tables.
- **Arabic additions for the native reader** are the fault pages in `src/content/ar.ts` (`faults.items`); they were written by the lead alone, not by agy.
