# Content strategy

Written 2 Nov 2026 for Phase 9.5. Goal: rank first for "repair + Dammam" searches in Arabic, and be the page Google's answer boxes and LLMs quote for appliance fault questions. Rules that win over this file: `PRODUCT.md` (facts), `docs/LAUNCH-PLAN.md` (Ameer, 2 Nov).

## Three page types, one link pattern

| Type | Job | Ranks for | Indexed |
|---|---|---|---|
| Service page (`/services/<slug>`) | Convert. Call or WhatsApp in the first screen | صيانة مكيفات الدمام, تصليح ثلاجات الدمام | yes |
| Fault guide (`/faults/<slug>`), hub دليل الأعطال / Repair guides at `/faults` | Answer one fault question, then hand off to the service | لماذا المكيف ينقط ماء, ثلاجة لا تبرد | yes, all 15 (`docs/LAUNCH-PLAN.md`); the technician review in `docs/TECH-REVIEW.md` still corrects them after launch |
| Guide (`/blog/<slug>`), hub أدلة / Guides at `/blog` | Maintenance, seasonal and decision topics | افضل درجة حرارة للمكيف, تنظيف مكيف سبليت | the lead decides when wiring them in; the launch plan holds nothing back, so the review corrects them after |

Links, the same everywhere: service → its fault guides and its guides; fault guide → its service, the hub, two sibling faults; guide → the service and fault guides it mentions, the hub. Home links both hubs once. No orphan pages. `/blog` keeps its URL (rule 0, slugs never change); only its label changes.

## Writing pattern (answer first)

1. h1 or h2 is the exact question people type, from `docs/research/raw/autocomplete-sa-2026-11-02.json`.
2. Under it, a direct answer of 40 to 60 words that stands alone when lifted.
3. Then steps, a short list or a two-column table where it genuinely helps. Nothing to pad.
4. Self-checks are safe: power off first, never open the unit, never touch wires or gas.
5. Close: send a photo or video on WhatsApp, or call. Never a visit promise, a time, a price.
6. Arabic first, natural Saudi; لولوه is never the subject of a verb ("ورشتنا", "نرد عليك"). English follows the meaning.

## Service-page depth (below the conversion area)

Existing sections already carry most of it: problems with signs, safe self-checks, the cutaway diagram, when to stop, job photos (AC only), common faults linking to fault guides, FAQ with `FAQPage`. Add, per service, both languages:
- **What we check** when a device comes in: plain list, no promise of time or result.
- **Maintenance between repairs**: 3 to 5 safe habits (filter, clearance, drain, door seal, lint filter).
- **Brands**: the launch plan makes brand pages real "ask first" pages; link the service to the brand pages whose `services` list includes it. No "we repair every brand" line.
- Target 600 to 900 useful words per language. Measure on the built page's `<main>` text, not the content file.

## Guides calendar

## Research

Google autocomplete, signed out, `gl=sa`, read 2 Nov 2026 through Google's public suggest endpoint: Arabic (`hl=ar`, 20 seeds) in `docs/research/raw/autocomplete-sa-2026-11-02.json`, English (`hl=en`, 12 seeds) in `docs/research/raw/autocomplete-sa-en-2026-11-02.json`.

**People Also Ask was not collected.** It only shows on a results page, and the browser pane's navigation to google.com was refused in this session, so it could not be read signed out without risking a CAPTCHA. agy cannot see the box either, so nothing stands in for it. Read it once by hand (google.com.sa, signed out, Arabic) for the 8 calendar questions and add the questions to the guides' headings.

What the Arabic data says:
- Questions start with لماذا (لماذا المكيف ينقط ماء, يثلج, يطلع ريحه, يفصل) and with هل (هل المكيف يصرف كهرباء). Guide headings use these exact forms.
- Saudi spelling and words: مكيف سبليت and سبلت, مكيف شباك, نشافة, غسالة اتوماتيك, فريون. Use them, not formal synonyms.
- City and brand modifiers are common (صيانة مكيفات الدمام, ثلاجة سامسونج لا تبرد من الاسفل, نشافة بيكو لا تنشف). Brand words belong on the launch plan's brand pages, not in guide titles.
- Car AC is a large share of "AC cuts out" and "AC not cooling" searches (عند وقوف السيارة). The shop does not do car AC, so guides say "home AC" in the first line to avoid that traffic.
- English: "inverter ac error code list", "should i repair or replace my ac unit", "best ac temperature for sleeping", "dryer not drying clothes but getting hot". No error code lists (brand-specific, unverifiable).

## Guides calendar

Slugs are new, so rule 0 is untouched.

| # | Slug | Arabic question (search) | English | Links to | Status |
|---|---|---|---|---|---|
| 1 | `ac-summer-checklist` | صيانة المكيف قبل الصيف: ماذا تفحص بنفسك؟ | Before summer: an AC check list | ac-repair, ac-not-cooling, ac-leaking-water | draft, in TECH-REVIEW |
| 2 | `repair-or-replace` | تصليح الجهاز أو تغييره؟ | Repair or replace? | all four services | draft, in TECH-REVIEW |
| 3 | `ac-error-code` | ماذا يعني رمز الخطأ على المكيف الانفرتر؟ | What an error code on an inverter AC means | ac-repair, ac-not-turning-on | draft, in TECH-REVIEW |
| 4 | `best-ac-temperature` | افضل درجة حرارة للمكيف في الصيف | Best AC temperature in summer | ac-repair, ac-not-cooling | draft, in TECH-REVIEW |
| 5 | `ac-keeps-cutting-out` | المكيف يفصل ويشتغل: ما السبب؟ | Why does my AC keep switching off and on? | ac-repair, ac-not-cooling | topic only |
| 6 | `ac-bad-smell` | لماذا المكيف يطلع ريحه؟ | Why does my AC smell? | ac-repair | topic only |
| 7 | `fridge-not-cooling-bottom` | ثلاجة لا تبرد من الأسفل | Fridge cold at the top, warm at the bottom | refrigerator-repair, fridge-not-cooling | topic only |
| 8 | `dryer-not-drying-clothes` | نشافة الملابس لا تنشف | Dryer runs but clothes stay damp | dryer-repair, dryer-not-drying-well | topic only |

Drafts: `docs/drafts/guides/<slug>.json` (source, the shape the content files need) and `<slug>.md` (to read). agy wrote two passes against the launch plan's banned list; Claude scanned every string for banned words and numbers, fixed what was left (padding words, a salesy close), and cut the first pass's defects: a line implying a visit, an uncited 24 °C setting, a wrong claim that inverter compressors run at fixed capacity, a broken JSON file. 486 to 609 words per language. Still owed before they ship: a native Saudi Arabic read (the Arabic is correct but leans formal) and the technician's ticks in `docs/TECH-REVIEW.md`.

## Schema

- Service pages: `Service` + `FAQPage` (exists) + `BreadcrumbList`.
- Fault guides and guides: `Article` with `author` and `publisher` as the business (no named person exists), `BreadcrumbList`; `FAQPage` only where the page shows Q and A; `HowTo` only for a real numbered procedure (filter cleaning). `dateModified` only from a real review date: the technician's sign-off date, never the build date.
- No `AggregateRating` (rule 10).

## llms.txt and llms-full.txt

Add both hubs and every indexed guide with its one-line answer. Unreviewed guides stay out, the same way `src/pages/llms.txt.ts` filters faults by `reviewed`.

## Technician review

One page per guide, Arabic first, ready to forward on WhatsApp or print: the question, the answer, each self-check with a tick box (safe? right?), the "needs a technician" list, a line for what to add or remove, name and date. Generate from content (`docs/tech-review/<slug>.md`) so it cannot drift from the page. The signed date becomes the page's "last reviewed" line and `dateModified`.

## Not doing

City or brand pages beyond what `docs/LAUNCH-PLAN.md` defines; error-code tables per brand; counts, prices, times, "best in Dammam" lines; AI images presented as jobs.
