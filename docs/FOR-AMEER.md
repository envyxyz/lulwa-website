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
