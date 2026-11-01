# Live lulwa.com.sa home page: testimonials and FAQ, verbatim

Fetched 1 Nov 2026 with curl from `https://lulwa.com.sa/`. Text copied as served, typos included. The site carries both languages in `data-ar` / `data-en` attributes on the same element and swaps them client-side.

## Testimonials

Section label "آراء العملاء" / "Testimonials", heading "ماذا يقول عملاؤنا" / "What Our Customers Say". Eight cards in a slider (`#testimonialsTrack`), each with a hard-coded `★★★★★` line, a first name plus initial, and a city. No date, no source and no link on any card.

| # | Stars | Name (AR / EN) | Place (AR / EN) | Arabic text | English text |
|---|---|---|---|---|---|
| 1 | ★★★★★ | أحمد م. / Ahmed M. | الدمام / Dammam | خدمة رائعة! أصلحوا ثلاجتي في نفس اليوم. أنصح بهم بشدة! | Amazing service! They fixed my refrigerator the same day. Highly recommended! |
| 2 | ★★★★★ | فاطمة ر. / Fatima R. | الخبر / Al Khobar | محترفون جدا وأسعارهم شفافة. مكيفي يعمل بشكل ممتاز الآن. | Very professional and honest pricing. My AC is working perfectly now. |
| 3 | ★★★★★ | محمد س. / Mohammed S. | القطيف / Qatif | جاؤوا خلال ساعتين وأصلحوا غسالتي. عمل ممتاز! | They came within 2 hours and fixed my washing machine. Excellent work! |
| 4 | ★★★★★ | سارة أ. / Sara A. | الظهران / Dhahran | تشخيص سريع وسعر عادل. غسالة الصحون تعمل كأنها جديدة. | Quick diagnosis and fair price. My dishwasher works like new again. |
| 5 | ★★★★★ | يوسف ك. / Yousef K. | الجبيل / Jubail | الفني وصل في الوقت المحدد وأصلح الفريزر في زيارة واحدة. | Technician arrived on time and fixed our freezer in one visit. |
| 6 | ★★★★★ | نور هـ. / Noor H. | سيهات / Saihat | تواصل ممتاز على واتساب وحجز سريع. فريق رائع. | Great communication on WhatsApp and fast booking. Excellent team. |
| 7 | ★★★★★ | خالد ن. / Khaled N. | رأس تنورة / Ras Tanura | تم حل مشكلة تسخين الفرن في نفس اليوم. احترافية عالية. | Our oven heating issue was solved the same day. Very professional. |
| 8 | ★★★★★ | ليلى م. / Laila M. | الأحساء / Al Ahsa | نصيحة صادقة وقطع أصلية وعمل نةيف. أنصح بهم بشدة. | Honest advice, original parts, and clean work. Strongly recommended. |

(Card 8 has a typo in the Arabic, نةيف for نظيف, as served.)

The same block appears in `docs/research/old-site-content.json`, entry `u == "/"`, field `t`, at about character 10,540 ("آراء العملاء ماذا يقول عملاؤنا ★★★★★ خدمة رائعة! ..."). The two copies match word for word, so this is the site's standing content, not a recent edit. The same text block also shows "ساعات العمل ٢٤/٧" (hours 24/7) just before it.

## Verdict: the live testimonials are not the real Google reviews

- **None of the 8 match** any of the 5 visible Google reviews in `src/content/ar.ts` / `en.ts` `reviews.items` and `PRODUCT.md` (Jafar Sapra "Fast work", Shahbaz Ahmad "Good work", Sohail Jamil "Good experience for work", Usama Ch "Good Experience", Asad Amjad "Good work"). No name, no wording and no date lines up. The Google listing has 8 reviews in total; 3 are not visible signed out, but the 5 visible ones are one to four words in English, while these are polished bilingual sentences written in the site's own voice with a twin translation each, which no customer writes.
- They are consistent with `docs/AUDIT.md` point 2, "Reviews that look invented": named star cards with no source, alongside the invented "technician arrived within an hour in Al-Rawdah" review cloned across 21 area pages.
- Seven of the eight sit in cities beyond Dammam (Al Khobar, Qatif, Dhahran, Jubail, Saihat, Ras Tanura, Al Ahsa). Serving any area beyond Dammam is not confirmed.
- They must not migrate, in whole or in part. Hard rule 10 holds: reviews are real or absent.

### Banned claims inside them (PRODUCT.md "Not confirmed")

| Card | Claim | Banned item |
|---|---|---|
| 1 Ahmed M. | "same day" | same-day service |
| 7 Khaled N. | "same day"; oven | same-day service; ovens and stoves |
| 3 Mohammed S. | "within 2 hours" | arrival times |
| 5 Yousef K. | "arrived on time", visit | arrival times; home visits as a standing promise |
| 8 Laila M. | "original parts" | parts origin |
| 2 Fatima R. | "honest pricing" | price claims (implied) |
| 4 Sara A. | "fair price"; dishwasher | price claims (implied); dishwashers |
| 3, 5, 6 | "came", "booking", visit | home visits implied |
| 2 to 8 | Al Khobar, Qatif, Dhahran, Jubail, Saihat, Ras Tanura, Al Ahsa | every area beyond Dammam |
| all 8 | ★★★★★ per card with no source | ratings not taken from Google |

Next to the block: "ساعات العمل ٢٤/٧" (24/7) contradicts the confirmed hours, 8:00 AM to 11:00 PM.

## FAQ

Heading "الأسئلة الشائعة حول صيانة الأجهزة في الدمام" / "Frequently Asked Questions About Appliance Repair in Dammam". Intro: "إجابات سريعة حول مناطق الخدمة وأنواع الأجهزة وحجز الصيانة والضمان." / "Quick answers about service areas, appliance types, repair booking and warranty." Nine `.faq-item` buttons with `aria-expanded`, all closed by default; a `FAQPage` JSON-LD block (`@id https://lulwa.com.sa/#faq`) sits in the head.

1. **هل تقدمون صيانة الأجهزة في الدمام؟** نعم. تقدم لولوه خدمات صيانة الأجهزة المنزلية في الدمام للثلاجات والغسالات ووحدات التكييف والأفران والمواقد وغسالات الصحون والفريزرات والميكروويف والنشافات وسخانات المياه.
   *Do you provide appliance repair in Dammam?* Yes. Lulwa provides home appliance repair services in Dammam for refrigerators, washing machines, AC units, ovens, stoves, dishwashers, freezers, microwaves, dryers and water heaters.
2. **ما الأجهزة التي تصلحونها؟** نقوم بصيانة مجموعة واسعة من الأجهزة المنزلية، بما في ذلك الثلاجات والغسالات والمكيفات والأفران والمواقد وغسالات الصحون والفريزرات والميكروويف والنشافات وسخانات المياه.
   *What appliances do you repair?* We repair a wide range of household appliances, including refrigerators, washing machines, air conditioners, ovens, stoves, dishwashers, freezers, microwaves, dryers and water heaters.
3. **هل تصلحون الغسالات في المنزل؟** نعم. نقدم صيانة الغسالات المنزلية في الدمام ويمكننا تشخيص المشاكل الشائعة مثل عدم الدوران أو التصريف أو التعبئة أو التشغيل أو إكمال دورة الغسيل.
   *Do you repair washing machines at home?* Yes. We provide home washing machine repair in Dammam and can diagnose common problems such as failure to spin, drain, fill, start or complete a washing cycle.
4. **ثلاجتي لا تبرد. هل يمكنكم إصلاحها؟** نعم. قد يكون لعدم تبريد الثلاجة عدة أسباب محتملة. يمكن لفنيينا فحص الجهاز وتحديد المصدر المرجح لمشكلة التبريد.
   *My refrigerator is not cooling. Can you repair it?* Yes. A refrigerator that is not cooling can have several possible causes. Our technician can inspect the appliance and identify the likely source of the cooling problem.
5. **هل تصلحون ماركات مختلفة من الأجهزة؟** نعم. نحن نخدم العديد من الماركات الكبرى للأجهزة. إذا لم تكن متأكدًا مما إذا كنا نخدم الماركة أو الطراز الخاص بك، أرسل لنا اسم الماركة ونوع الجهاز وسيتأكد فريقنا من ذلك.
   *Do you repair different appliance brands?* Yes. We service many major appliance brands. If you are unsure whether we service your particular brand or model, send us the brand and appliance type and our team can confirm.
6. **هل تقدمون صيانة الأجهزة في نفس اليوم؟** قد تتوفر خدمة في نفس اليوم بحسب توفر الفني وموقعك ونوع التصليح المطلوب. تواصل معنا مع منطقتك ومشكلة الجهاز حتى نتمكن من تأكيد الخدمة المتاحة.
   *Do you provide same-day appliance repair?* Same-day service may be available depending on technician availability, your location and the type of repair required. Contact us with your area and appliance problem so we can confirm the available service.
7. **هل تقدمون ضمانًا على التصليحات؟** تخضع خدمات التصليح المؤهلة لضمان التصليح المعمول به لدينا. وقد تعتمد شروط الضمان على نوع الإصلاح وقطعة الغيار المستخدمة.
   *Do you provide a warranty on repairs?* Eligible repair services are covered by our applicable repair warranty. Warranty terms can depend on the type of repair and replacement part used.
8. **كيف يمكنني حجز فني صيانة أجهزة؟** يمكنك الاتصال بلولوه أو التواصل معنا عبر واتساب. أخبرنا بنوع جهازك والمشكلة والموقع، وسيساعدك فريقنا في ترتيب الخدمة.
   *How can I book an appliance repair technician?* You can call Lulwa or contact us through WhatsApp. Tell us your appliance type, problem and location, and our team will help arrange the service.
9. **هل تقدمون صيانة الأجهزة خارج الدمام؟** نخدم الدمام ومدنًا ومجتمعات مختارة قريبة في المنطقة الشرقية. تواصل معنا مع منطقتك الدقيقة لتأكيد التوفر.
   *Do you provide appliance repair outside Dammam?* We serve Dammam and selected nearby cities and communities in the Eastern Province. Contact us with your exact area to confirm availability.

### Banned claims inside the FAQ

| Q | Claim | Banned item |
|---|---|---|
| 1, 2 | ovens, stoves, dishwashers, microwaves, water heaters | services not confirmed |
| 3 | repair "at home" | home visits as a standing promise |
| 4 | "our technicians", inspection | technician count implied; home visit implied |
| 5 | "many major brands" | unverifiable breadth; brands are not confirmed per appliance |
| 6 | same-day "may be available" | same-day service |
| 7 | "applicable repair warranty" | warranty terms |
| 9 | "selected nearby cities and communities" | every area beyond Dammam |

Usable as written: none. Q4 and Q8 survive only when rewritten to the confirmed facts (see `FINDINGS.md` job 8).
