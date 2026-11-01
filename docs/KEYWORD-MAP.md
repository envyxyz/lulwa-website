# Keyword map

One primary query per page, so no two pages compete. Sources: the PRD section 4 targets, and Google autocomplete read on 1 Nov 2026 with `gl=sa`, `hl=ar` (suggest endpoint, not the results page; volumes unknown). The live SERP was not re-read this phase; the 1 Nov competitor table in `docs/PRD.md` stands.

| Page | Primary (Arabic) | Primary (English) | Also covers | Seen in autocomplete |
|---|---|---|---|---|
| `/` | صيانة وتصليح مكيفات بالدمام | AC, fridge and washing machine repair in Dammam | the shop name | yes: صيانة مكيفات الدمام |
| `/services` | صيانة الأجهزة المنزلية بالدمام | home appliance repair in Dammam | hub only, no body keywords | n/a |
| `/services/ac-repair` | تصليح مكيفات في الدمام | AC repair in Dammam | تصليح مكيفات سبليت الدمام, فني مكيفات الدمام | yes, both |
| `/services/refrigerator-repair` | تصليح ثلاجات في الدمام | fridge repair in Dammam | تعبئة غاز ثلاجة | yes |
| `/services/washing-machine-repair` | صيانة غسالات أوتوماتيك في الدمام | automatic washing machine repair in Dammam | | yes |
| `/services/dryer-repair` | صيانة نشافات في الدمام | dryer repair in Dammam | | no suggestions at all: low volume, keep the page lean |
| `/faults/ac-not-cooling` | المكيف يشتغل وما يبرّد | AC not cooling | المكيف لا يبرد | yes (car AC mixed in) |
| `/faults/ac-leaking-water` | المكيف يسرّب ماء | split AC leaking water | تسريب ماء من المكيف السبلت | yes |
| `/faults/fridge-not-cooling` | الثلاجة ما تبرّد | fridge not cooling | الثلاجة لا تبرد والفريزر لا يجمد | yes |
| `/faults/washer-not-spinning` | الغسالة الأوتوماتيك ما تعصر | washing machine not spinning | الغسالة لا تعصر | yes |
| other 11 fault pages | their own question | their own question | | one question each, no overlap |
| `/areas/appliance-repair-in-dammam` | تصليح الأجهزة المنزلية في الدمام | appliance repair, Al-Jalawiyah, Dammam | neighbourhood | local page; must not chase the service queries |
| `/brands` | ماركات الأجهزة | appliance brands | | none, by design |
| `/about`, `/contact`, `/reviews`, `/work`, legal, `/blog/*` | their own names | | | brand and navigational |

## Rules that keep pages apart
- The service page owns "[service] + الدمام". Fault pages own the symptom question and never use the service-plus-city phrase as their title.
- The home page owns the broad AC term; `/services` owns no body keyword.
- Blog posts are how-tos and are not written against a fault page's question.

## Findings worth acting on later
- Brand modifiers are heavy: صيانة مكيفات with LG, سامسونج, كارير, جري, الزامل, ماندو. Brand pages stay unbuilt until the client confirms brands and a technician supplies facts (`docs/FOR-AMEER.md`, Phase 6).
- Suggestions exist for central AC (مركزية) and neighbourhoods (طيبة, بدر, النور). Central AC is unconfirmed, so no page. A neighbourhood list needs the client's real coverage.
- "فني مكيفات فلبيني" and car-AC variants are other markets: ignore.
- AC pages should be indexed by February. The 15 fault pages are noindex until the technician review in `docs/TECH-REVIEW.md`; that is the biggest SEO gap and needs Ameer.
