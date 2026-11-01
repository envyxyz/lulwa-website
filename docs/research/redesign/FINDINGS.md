# Redesign research: verified findings (1 Nov 2026)

10 agy jobs checked by an Opus orchestrator against PRODUCT.md, live HTTP and a Python WCAG calculator. Raw agy output is in the session scratchpad. Companion files: `live-sitemap.txt`, `live-testimonials-faq.md`.

## Testimonials verdict
All 8 testimonials on the live lulwa.com.sa are invented: names not on Google, word-for-word templated, and full of banned claims (same day, within 2 hours, original parts, fair prices, dishwasher and oven jobs, other cities). Nothing migrates. `reviews.items` (the real Google reviews) is the only source. The 9 live FAQ answers also break the claim rules; the questions are reused, the answers are rewritten below.

## Sitemap (lead decision)
Keep the current route set. No new thin pages: no `/faq` (7 answers live on home), no `/how-it-works`, no `/pricing` or `/warranty` until facts exist, no extra area or brand pages. Nav: Services · Faults · Work · Reviews · Contact, plus a WhatsApp CTA. `/areas` and `/brands` stay in the footer only.

## Dark palette (all pairs pass AA, recomputed)
```css
:root { --color-pearl:#121415; --color-pearl-step:#1a1d1f; --color-pearl-hover:#24282a; --color-teal:#47b6c2; --color-teal-active:#349ea9; --color-teal-quiet:#7daab0; --color-ink:#eef2ef; --color-ink-soft:#9fa9af; --color-error:#ff8c77; }
/* after the light-value reset for [data-tone] / .bg-white / .bg-whatsapp */
[data-tone='teal'] { --color-teal:#0b4a52; --color-teal-active:#083c43; --color-teal-step:#0a434a; --color-teal-hover:#083a40; }
[data-tone='ink'] { --color-ink:#0a0b0c; }
```
Ratios: ink on pearl 16.35, ink-soft on pearl 7.71, teal on pearl 7.69, pearl on teal 7.69, teal-quiet on pearl 7.26, #eef2ef on teal field 8.78, white on WhatsApp 5.40.

## Header
Inset solid bar (`bg-pearl-step`, `rounded-card`, 64 px, 8 px top inset, `px-gutter`); logo, centred nav, language, phone (lg+), one green WhatsApp CTA. Phones: logo, language and menu; WhatsApp and call stay in the bottom bar. Hide on scroll down with `translate`, sticky not fixed, `:focus-within` and an open popover keep it shown, `scroll-padding-block-start` set. About 0.4 KB JS on every page: rule 11 needs the exception noted.

## Footer
Ink band, 12-column grid: Shop (phone, WhatsApp + call, `<address>`, Directions), Services (4 + all faults), Company (About, Work, Reviews, Blog, Brands, Contact), Hours and area. The bottom row has the legal name, CR `2050163881`, legal links, language and ©. No dividers, no underlines at rest except the bottom row. On mobile: Shop, then Services and Company two-up, then hours, then the bottom row, padded above the bottom bar.

## Reviews
Summary column (5.0 from 8 on Google Maps, as-of date, Maps link) beside a 3-column grid of equal cards: quote in `<blockquote lang="en" dir="ltr">`, name in `<bdi>`, relative date in ink-soft. 5 cards plus a 6th "see all on Google Maps" card. No per-card stars, no "verified" wording, no Review/AggregateRating JSON-LD. Mobile: stacked, no carousel.

## FAQ (PRODUCT.md facts only, native reviewer to check)
1. وش الأجهزة اللي تصلحونها؟ مكيفات السبليت والشباك، والثلاجات وتعبئة غازها، والغسالات الأوتوماتيك، والنشافات. / Which appliances do you repair? Split and window ACs, fridges including gas refilling, automatic washing machines and dryers.
2. وين محلكم؟ في حي الجلوية بالدمام، على شارع الأمير عبدالمحسن بن جلوي. اضغط «الاتجاهات» ويفتح لك الموقع على الخريطة. / Where is your shop? In Al-Jalawiyah, Dammam, on Prince Abdulmohsen bin Jalawi Street. Tap "Directions" to open it on the map.
3. متى تفتحون؟ كل يوم، من 8 الصبح إلى 11 الليل. / When are you open? Every day, 8:00 AM to 11:00 PM.
4. كيف أوصّل لكم العطل؟ صوّر الجهاز أو سجّل مقطع قصير وأرسله واتساب على <bdi>056 802 2197</bdi> مع اسم حيّك، أو اتصل على نفس الرقم. / How do I tell you about the fault? Take a photo or a short video and send it on WhatsApp to 056 802 2197 with your district, or call the same number.
5. ثلاجتي ما تبرد، وش أسوي؟ خلّ الباب مسكّر عشان تحافظ على البرودة، وتأكد إن الفيش موصول وإن ورا الثلاجة فيه مسافة للهوا. إذا ما تحسنت، أرسل لنا صورة أو مقطع على الواتساب. / My fridge is not cooling. What should I do? Keep the door shut to hold the cold, check it is plugged in and has space behind it for air. If it does not improve, send us a photo or video on WhatsApp.
6. تصلحون ماركة جهازي؟ أرسل صورة الملصق اللي عليه الماركة والموديل على الواتساب، ونرد عليك. / Do you repair my brand? Send a photo of the label with the brand and model on WhatsApp, and we will reply.
7. هل محلكم مسجّل؟ إيه، باسم مؤسسة لولوه عبدالله فرحان المرشود للتبريد والتكييف، سجل تجاري رقم <bdi>2050163881</bdi>. / Is your shop registered? Yes, as مؤسسة لولوه عبدالله فرحان المرشود للتبريد والتكييف, commercial registration 2050163881.

Dropped: home visits (unconfirmed, ask Ameer), same day, warranty, outside Dammam. Presentation: heading column (4 cols) beside the accordion (8), `<details name="faq">` exclusive, first item open, a plus that turns to an x, rows `min-h-14`, FAQPage JSON-LD that mirrors the visible text.

## Other critique points (checked against screenshots)
Steps stagger in unequal widths: use an equal grid. Reviews fall apart: see above. At 390 the services row overflows with no cue: show part of the next card. At 390 the hero buttons are unequal: make both `flex-1`. Work grid tiles render empty in full-page shots: check lazy loading on preview after a scroll-through.

## Lighthouse risks
Header: translate only, sticky, focus handling, rule 11 exception. Footer and reviews: static, no JS. FAQ: native details. Before merge: Lighthouse on `/`, `/en`, `/contact` and a fault page at 95+, own JS under 6 KB with the header counted.
