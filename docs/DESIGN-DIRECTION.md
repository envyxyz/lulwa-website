# Design direction

Dealt with `design-taste-frontend` (direction `type-only-statement`, seed 977375509, palette and type kept from brand). Mode: Persuade on home and services, Read on faults. Approved hero: `design/mock/hero.html`.

## Contract

- **THESIS:** A repair shop you can check, in a results page full of ones you can't.
- **OWN WORLD:** The Gulf at Dammam. The name means pearl. Copper is the pipe inside every AC and the pearl in the logo.
- **STORY:** Something broke. Here's who comes, what they check, and how to reach them in one thumb.
- **FIRST VIEWPORT:** Two flat fields, Sea Pearl above and Gulf Teal below, meeting at a hard horizon. The question stands on the land, the answer on the water. The full stop of the answer is the copper pearl.
- **FORM:** Huge type, whole fields of colour, few pictures shown honestly small. No cards as structure.
- **FINISH:** Reads like a well-painted shop sign, not a template.

## The idea

> On this page, **the copper pearl from the logo** becomes **the mark that lands on what's wrong**.

It ends the hero's sentence. In the fault picker it sits on the failing part of a drawn appliance. On fault pages it marks the part being discussed. Competitor test: no other shop has a pearl for a name.

## The live thing

**Fault picker:** tap the appliance, tap what it's doing. The line drawing shows the pearl moving to the likely part, and the WhatsApp button rewrites itself: `السلام عليكم، عندي مكيف سبليت ما يبرد في حي ...`. Plain links without JS. Thumb-sized. Under 4 KB.

## Section blueprints, home

| Band | Ground | Geometry |
|---|---|---|
| Hero | Pearl over teal | As mock |
| Fault picker | Teal continues | Appliance names set large as a row of words, faults below, drawing on the end side |
| What we repair | Pearl | Comparison set as text: each repair at display size, what it covers beside it. Alternating tone rows, no lines, no icons |
| How a visit works | Ink | Lines that step across: four clauses at display size, each starting further along the grid |
| Reviews | Pearl | One real review at statement size, name and date beside, the rest as a plain list. Link to Google |
| Real work | Teal | Word tiles and small real photos on a wall, each captioned with appliance and fault |
| The shop | Pearl | Address in display rows, hours table, tap-to-load map |
| Questions | Pearl | Large questions, answers beside |
| Footer | Ink | Phone number as the headline, then legal name and CR |

Service, area, brand and fault pages reuse these parts and never stack two of the same geometry.

## Fonts, chosen by looking

Trialled in the real hero: Thmanyah Sans, Thmanyah Serif Display, Alexandria, Beiruti, Reem Kufi, Markazi Text, Readex Pro.

- **Beiruti, chosen.** OFL. Warm, sign-painter weight, compact enough to fill the width, rare on Saudi service sites. 57 KB variable before subsetting. Confirm the designer credit from its OFL file before quoting it anywhere.
- **Thmanyah, barred.** Best-looking serif, but its licence forbids making font files reachable through web embedding, and forbids modification, so no subsetting. Community CDN copies don't change that. Would need written permission from Ask@thmanyah.com.
- **Alexandria, runner-up.** Grand but colder.
- **Readex Pro, kept in the logo.** Generic at display size.
- **Reem Kufi, rejected.** Decorative, reads as an event poster.
- **Markazi, rejected.** Bookish and thin at these sizes.
- **Cairo, Tajawal, Almarai, Noto Kufi, Inter:** the default look of every competitor or every generated page.

## Colour

Sea Pearl `#EEF2EF`, Gulf Teal `#0F6E7A`, Ink `#0B1F2A`, Copper `#D9772B` as a dot only, WhatsApp `#25D366` on WhatsApp buttons only. Why this over the warm brand pearl: see Website Overrides in `DESIGN.md`.

## Copy voice

Saudi Arabic, spoken but respectful. Never make لولوه the subject of a verb of coming or visiting (لولوه تجيك): it's also a woman's name and reads badly. Use نجيك, فنينا, فريق لولوه. Buttons: تواصل واتساب, اتصل بنا. Hero copy passed one agy review; a native Saudi reader signs off before launch. English: plain and direct.

Conversion lines to use once true: warranty in the client's words, inspection fee waived on repair, WhatsApp a photo of the fault. WhatsApp a photo works today and is the strongest honest line: `صوّر العطل وأرسله واتساب`.

## Imagery

Real photos at honest sizes: 12 WhatsApp photos, 287 to 680 px wide, final. They appear small and captioned, never as a full-bleed hero. The shopfront photo stays off until the new sign is up. The drawn appliance diagrams are crisp geometry in teal with a copper pearl. No stock, no AI mockups, no clip art. `technician-package-unit_01` shows lettering that may be another company's: check before use.

## Motion

See Website Overrides. One authored moment, the seam rising on load. Colour by chapter on scroll. Nothing hidden behind an animation.

## Skills by surface

`design-taste-frontend` inspector and lint on every built page · `impeccable` craft floor before UI edits, audit and polish in Phase 9 · `apple-design` for picker and menu feedback · `web-design-guidelines` review in Phase 9 · `ui-ux-pro-max` UX checks, keep its rules, ignore its palettes · `design-system-init` adapted to Astro in Phase 1 · `design-system-audit` in Phase 9.

## Reference update, 1 Nov 2026

Ameer's own direction, and it wins over the contract, blueprints and mock above where they conflict. Reference: `design/reference/roofguard-inspiration.webp`. "A bit inspired", so borrow the structure and rhythm, in Lulwa colours, with Lulwa's own idea. It is not a copy.

**Take from the reference:**
- Hero as a big rounded panel inset from the page edges, under a plain top bar, with one giant word running across its top. Here: لولوه in Arabic, LULWA in English, in Sea Pearl on Gulf Teal. The h1 and its supporting line sit low on the start side, two buttons beneath.
- Two-tone headings: first line Ink, second line a quieter teal.
- A heading beside a short paragraph, then a bento row of mixed-width rounded tiles.
- Service cards in a horizontally scrolling row: title, one sentence, product image on white, arrow. A first tinted "call now" card holds the phone number.
- A large centred statement in a soft tinted rounded panel, with part of the sentence in the quieter colour. Flat tint, no gradient.
- A simple process row, a reviews row, a contact form panel beside a teal field, a footer ending in the giant name cropped at the bottom.

**Keep from Lulwa:** the palette and fonts. The copper pearl is still the only copper and still lands on what's wrong, for example on the failing part of a product image, and as the full stop of the hero answer. Actions are teal and WhatsApp green, never orange. Hero lines stay: المكيف وقف؟ نجيك لحد بيتك / AC gave up? We come to you. Fault picker stays, as a bento tile or band. No shadows at rest, no glass, no emoji, no pills above headlines, no invented numbers. The reference's "Pricing starts at" tile and stock people do not come across.

**Changed rules:** rounded surfaces and cards are now allowed as structure, with tone steps and no border or shadow, and a radius token for them. Photo corners may round to match. Neighbouring bands still differ in geometry. Where the taste inspector objects to something this section asks for, this section wins; note it in docs/PHASES.md.

**Images:**
- Generate clean product images on pure white with agy: split AC indoor unit, window AC, outdoor unit, fridge, washing machine, dryer, compressor. No logos or brand names, same angle and lighting, about 14 per quota window, so spend them on these. Keep the raw files in `design/generated/`, export AVIF and WebP, list each in the photo provenance as AI-generated.
- They are product illustrations, never shown as our jobs or customers. Real work stays real photos, captioned, at honest sizes.
- The hero uses type and one product tile, not a generated scene of a technician. If quota is out, use the line drawings and record it in FOR-AMEER.md.

## Ameer's feedback, Phase 8.5, 1 Nov 2026

Ameer has seen the home page. This wins over everything above, including the Reference update and the type table in `DESIGN.md`.

**Type: no huge text.** Remove the giant لولوه / LULWA from the hero and the giant name from the footer. Ameer dislikes both. Bring the whole scale down: confident but ordinary marketing-site sizes, with no statement-size display type anywhere. Hero h1 about 2.25 to 3.5rem on desktop scale, section heads smaller, phones comfortable at two lines. The hero carries a good headline, supporting line, buttons and the product tile. Update tokens, not page by page. Keep the rounded bento rhythm, and rebalance spacing so bands don't look empty after the type shrinks.

**Feedback and motion everywhere.** Every interactive element responds smoothly:
- Buttons, links, cards, tiles: hover, press (slight scale or tone), focus. Arrows nudge on hover. Cards lift through tone, not shadow.
- Fault picker: selection transitions, the pearl glides to the part, the WhatsApp button updates with visible feedback.
- Menu, FAQ and any open/close: animated height and fade, using `<details>` and CSS where possible.
- Service row: scroll snap, smooth arrows, visible edge states.
- Sections reveal gently on scroll with CSS `animation-timeline: view()` where supported, always visible by default. Nothing is hidden if the animation doesn't run.
- Smooth page changes with cross-document CSS `@view-transition`, no JS router.
- Use `apple-design` for timing: short, interruptible, ease-out. Duration tokens only. Everything respects `prefers-reduced-motion`.

**Loading and state.**
- Images: tone-step skeleton behind each until it loads, then a fade-in, with no layout shift.
- Tap-to-load map: skeleton with a loading state until the iframe is ready.
- Lead form: inline validation as people leave a field, submit button with spinner and disabled state, clear success and error states, and the WhatsApp fallback. Never lose what they typed.
- Picker: empty, selected and complete states. Copy and call actions confirm where relevant.
- Styled 404 and clear empty states. No skeleton for content that is already in the static HTML; that would only slow it down.

**Dark and light mode, following the device.** See rule 14 in `CLAUDE.md`. Dark ground from Ink with step tones, teal lifted until it passes AA, white logo variant, copper still the only copper. Product images on white stay in their own white rounded tile. Job photos may dim slightly. Screens at 1440 and 390, in Arabic and English, in both themes. Update any test that assumes light only, and extend contrast and axe checks to dark. Do not weaken a test otherwise.

**Limits stay:** JS and page budgets, Lighthouse 95+, no shadows at rest unless a card truly needs one on dark, no invented claims. Prefer CSS. Add a dependency only if the platform can't do it.
