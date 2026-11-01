---
version: alpha
name: Lulwa
description: An Arabic-first, calm and trustworthy interface for Lulwa (لولوه), an air-conditioning and refrigeration repair shop in Al-Jalawiyah, Dammam. The system sits on a warm pearl canvas with deep ink text, a Gulf-teal signature colour for actions, and a single copper accent that only ever appears as the "pearl". Readex Pro carries both the Arabic and Latin headlines so the two scripts feel like one voice; real photos of the shop, the team and finished jobs do the selling. The register is a careful, polite neighbourhood technician, not a loud discount repair ad.

colors:
  primary: "#0F6E7A"
  primary-active: "#0B5862"
  on-primary: "#F4F1EA"
  accent: "#D9772B"
  accent-active: "#B9601E"
  ink: "#0B1F2A"
  body: "#24343D"
  muted: "#5B6B73"
  muted-soft: "#8A979D"
  canvas: "#F4F1EA"
  surface-card: "#FFFFFF"
  surface-soft: "#DCE5E6"
  hairline: "#DEDBD5"
  surface-dark: "#0B1F2A"
  surface-dark-elevated: "#15303E"
  on-dark: "#F4F1EA"
  on-dark-soft: "#A9B6BC"
  whatsapp: "#25D366"
  success: "#2E8B57"
  warning: "#C98A1B"
  error: "#B4442E"

typography:
  display-xl:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -1px
  display-lg:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.6px
  display-md:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.3px
  title-lg:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  title-md:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "Inter, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1.6px
  button:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  nav-link:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  display-xl-ar:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0
  display-lg-ar:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  title-md-ar:
    fontFamily: "Readex Pro, sans-serif"
    fontSize: 19px
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: 0
  body-md-ar:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0
  body-sm-ar:
    fontFamily: "IBM Plex Sans Arabic, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 28px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 88px

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 72px
  language-toggle:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 6px 12px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 24px
    height: 52px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 24px
    height: 52px
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 24px
    height: 52px
  floating-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 60px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl-ar}"
    padding: 88px
  service-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md-ar}"
    rounded: "{rounded.lg}"
    padding: 28px
  area-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  trust-strip:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  review-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md-ar}"
    rounded: "{rounded.lg}"
    padding: 28px
  before-after-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: 12px
  booking-form:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-ar}"
    rounded: "{rounded.xl}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-ar}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
    height: 52px
  text-input-focused:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  hours-table:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 24px
  map-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 0px
  badge-pill:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface-card}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  cta-band:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-lg-ar}"
    rounded: "{rounded.xl}"
    padding: 56px
  footer:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark-soft}"
    typography: "{typography.body-sm}"
    padding: 56px
---

## Overview

Lulwa is a neighbourhood repair shop asking families to let a technician into their home, so the interface has one job: look calm, clean and accountable within the first screen. The base is a **warm pearl canvas** (`{colors.canvas}` — #F4F1EA) with **deep ink** text (`{colors.ink}` — #0B1F2A). It feels like a well-kept shop, not a flashy discount ad. **Gulf teal** (`{colors.primary}` — #0F6E7A) is the action colour, carried on every call and booking button, and it also echoes the cool of a working AC.

The brand's memorable detail is the **copper pearl** (`{colors.accent}` — #D9772B), the circle cradled in the Arabic lam of the logo. Copper is also the colour of refrigerant pipes. In the UI it appears rarely and deliberately: the "Recommended" badge, a small active indicator, the dot in the logo. Never a large fill.

The site is **Arabic first** (`dir="rtl"`, Arabic at `/`, English at `/en`). Readex Pro sets headlines in both scripts so Arabic and English feel like one voice. IBM Plex Sans Arabic and Inter carry body text. Proof comes from real photos of the shop, the technicians and finished jobs, never stock imagery.

**Key Characteristics:**
- Warm pearl canvas with deep ink text. Pure white is reserved for cards (`{colors.surface-card}`), so cards lift off the page without shadows.
- Gulf-teal `{component.button-primary}` and a green `{component.button-whatsapp}` side by side in the hero. Call and WhatsApp are the two conversions that matter.
- The copper accent is scarce and always small.
- Readex Pro display in Arabic and Latin; Arabic lines get 1.35 to 1.8 line height and no negative tracking.
- Rounded but not bubbly: 12 px buttons, 18 px cards, 28 px for large bands and the booking panel. This matches the brand guide and mockup board.
- Dark ink bands (`{colors.surface-dark}`) for the trust strip and footer give the page its rhythm: pearl, white cards, ink band, pearl, teal CTA, ink footer.

## Colors

### Brand & Accent
- **Gulf Teal** (`{colors.primary}` — #0F6E7A): Primary buttons, links, active tabs, focus rings, the main brand colour on large CTA bands.
- **Gulf Teal Active** (`{colors.primary-active}` — #0B5862): Pressed state of primary buttons.
- **Pearl on Teal** (`{colors.on-primary}` — #F4F1EA): Text and icons on teal.
- **Copper** (`{colors.accent}` — #D9772B): The pearl. Badges, small indicators, the logo dot. Never a background larger than a pill.
- **Copper Active** (`{colors.accent-active}` — #B9601E): Pressed state for the rare copper control.
- **WhatsApp Green** (`{colors.whatsapp}` — #25D366): A functional colour for WhatsApp buttons only, not a brand colour.

### Surface
- **Pearl Canvas** (`{colors.canvas}` — #F4F1EA): The page floor everywhere.
- **Card White** (`{colors.surface-card}` — #FFFFFF): Service cards, reviews, the booking form, the hours table.
- **Mist** (`{colors.surface-soft}` — #DCE5E6): Area chips, table headers, quiet bands.
- **Hairline** (`{colors.hairline}` — #DEDBD5): 1 px borders on cards and inputs (ink at about 9% on pearl).
- **Ink Surface** (`{colors.surface-dark}` — #0B1F2A): Trust strip, footer, the night photo band.
- **Ink Elevated** (`{colors.surface-dark-elevated}` — #15303E): Cards placed inside ink bands.

### Text
- **Ink** (`{colors.ink}` — #0B1F2A): Headlines and key text.
- **Body** (`{colors.body}` — #24343D): Running text.
- **Slate** (`{colors.muted}` — #5B6B73): Secondary text, captions, input labels.
- **Slate Soft** (`{colors.muted-soft}` — #8A979D): Placeholders, fine print.
- **Pearl on Ink** (`{colors.on-dark}` — #F4F1EA) and **Soft on Ink** (`{colors.on-dark-soft}` — #A9B6BC): Text on ink bands.

### Semantic
- **Success** (`{colors.success}` — #2E8B57): Booking sent, slot confirmed.
- **Warning** (`{colors.warning}` — #C98A1B): Busy-period notices.
- **Error** (`{colors.error}` — #B4442E): Form validation.

## Typography

### Font Family
**Readex Pro** (Google Fonts) sets every headline, button and nav label in both Arabic and Latin, the same family as the wordmark. **IBM Plex Sans Arabic** sets Arabic body text; **Inter** sets English body text. Fallbacks: `Readex Pro, Tajawal, sans-serif` and `Inter, -apple-system, Segoe UI, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl-ar}` | 56px | 700 | 1.35 | 0 | Arabic hero headline |
| `{typography.display-xl}` | 56px | 700 | 1.08 | -1px | English hero headline |
| `{typography.display-lg-ar}` | 40px | 700 | 1.4 | 0 | Arabic section heads, CTA band |
| `{typography.display-lg}` | 40px | 700 | 1.12 | -0.6px | English section heads |
| `{typography.display-md}` | 30px | 600 | 1.2 | -0.3px | Sub-sections, prices only if the client publishes them |
| `{typography.title-lg}` | 22px | 600 | 1.3 | 0 | Card group titles |
| `{typography.title-md-ar}` / `{typography.title-md}` | 19 / 18px | 600 | 1.6 / 1.4 | 0 | Service card titles |
| `{typography.body-md-ar}` / `{typography.body-md}` | 17 / 16px | 400 | 1.8 / 1.6 | 0 | Running text |
| `{typography.body-sm-ar}` / `{typography.body-sm}` | 15 / 14px | 400 | 1.8 / 1.6 | 0 | Footer, table rows |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Chips, labels |
| `{typography.caption-uppercase}` | 12px | 600 | 1.4 | 1.6px | English badges ("RECOMMENDED") |
| `{typography.button}` | 16px | 600 | 1 | 0 | Buttons |
| `{typography.nav-link}` | 15px | 500 | 1.4 | 0 | Top navigation |

### Principles
Headlines are bold and short; the brand speaks plainly. Arabic is never squeezed: give it its own line-height tokens and no negative tracking. Phone numbers use Western digits in the spaced format `056 802 2197` and stay left-to-right inside Arabic text.

### Arabic / RTL
- The page is `dir="rtl"` and the English pages are `dir="ltr"`; use logical CSS properties throughout.
- Directional icons (chevrons, arrows) mirror. The logo, phone numbers, the WhatsApp glyph and photos do not.
- Wrap Latin words and numbers inside Arabic text in `<bdi>` so punctuation does not jump.

## Layout

### Spacing System
- **Base unit:** 4px. Tokens: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 88.
- **Section padding:** `{spacing.section}` between bands on desktop, 56px on mobile.
- **Card padding:** 28px for service and review cards; `{spacing.xl}` for the booking form.

### Grid & Container
- Max content width 1120px, 12 columns, 24px gutters, 16px side gutters on phones.
- Services: 3-up desktop, 2-up tablet, 1-up phone. Reviews: 3-up, then a horizontal scroller on phones.
- Hero: 7/5 split, with the headline and two CTAs on the start side and a real shop photo on the end side (in RTL the photo sits on the left).

### Whitespace Philosophy
Calm comes from space. One idea per band, generous padding, and no more than two buttons in view at once.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | Pearl canvas, no border | Page, hero |
| Card | `{colors.surface-card}` with a 1px `{colors.hairline}` border, no shadow | Services, reviews, forms |
| Band | `{colors.surface-dark}` full-width | Trust strip, footer |
| Floating | `0 10px 30px -12px rgba(11,31,42,0.35)` | Only `{component.floating-whatsapp}` |

### Decorative Depth
- The brand pattern (the lam mark repeated in rows, alternate rows turned) may sit at 6 to 8% opacity in the CTA band and footer. Never behind body text.
- The supergraphic (oversized cropped marks) can fill one decorative tile per page.
- A subtle film grain is allowed on large photo bands only, matching the brand board.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Tiny tags |
| `{rounded.sm}` | 8px | Inputs |
| `{rounded.md}` | 12px | Buttons |
| `{rounded.lg}` | 18px | Cards, tables, map |
| `{rounded.xl}` | 28px | Booking panel, CTA band, large photos |
| `{rounded.pill}` | 9999px | Chips, badges, language toggle |
| `{rounded.full}` | 50% | Floating WhatsApp button, avatars |

### Photography & Illustrations
- Use real photos: the shop, technicians in the navy polo, hands on real units, and before and after shots. Shoot level, in daylight, with faces of customers and house numbers out of frame.
- The AI shopfront concepts in the brand guide are for client review only. Don't use them on the live site or on Google Business Profile.
- No stock photos of smiling technicians in Western homes. No AC clip-art or snowflakes.

## Components

### Navigation
**`top-nav`** — 72px pearl bar: logo on the start side; links (Services, Areas, Reviews, Contact) in `{typography.nav-link}`; then `{component.language-toggle}` and a compact `{component.button-primary}` "Call" on the end side. On phones it collapses to the logo, a call icon and a menu.

**`language-toggle`** — "English / العربية" as a quiet pill in `{colors.muted}`.

### Buttons
**`button-primary`** — Teal, pearl text, 52px tall, `{rounded.md}`. The label is a verb: "احجز زيارة" / "Book a visit". Pressed: `{component.button-primary-active}`.

**`button-secondary`** — White with a hairline border and ink text, for "Call 056 802 2197".

**`button-whatsapp`** — WhatsApp green with the WhatsApp glyph and ink text, opening a prefilled chat with 056 802 2197.

**`floating-whatsapp`** — A 60px circle fixed to the bottom end corner on phones only, with the one floating shadow.

### Cards & Containers
**`hero-band`** — Pearl canvas: an Arabic headline in `{typography.display-xl-ar}`, one supporting line, the primary and WhatsApp buttons, a row of `{component.area-chip}` items, and a real shop photo at `{rounded.xl}`.

**`service-card`** — White card with a line icon in teal, the service name in `{typography.title-md-ar}`, two lines on what is checked, and a text link. Services: split AC, window AC, central AC, fridges and freezers, washing machines and dryers (only those the client confirms).

**`area-chip`** — Mist pills naming neighbourhoods served (Al-Jalawiyah, Dammam, Khobar...). Show only areas the client actually covers.

**`trust-strip`** — An ink band of three to four facts in `{colors.on-dark}`: registered business with its registration number, warranty terms, opening hours, and the real Google rating once it exists. Never show invented numbers.

**`review-card`** — A real Google review: first name, date and stars, with a link to the listing. Show nothing until there are real reviews.

**`before-after-card`** — Two real photos side by side, with a caption naming the appliance and the fault.

**`booking-form`** — Name, phone, appliance type, area and preferred time on a white panel at `{rounded.xl}`. It submits to WhatsApp or a working endpoint; the form must have a real destination.

**`hours-table`** — The days of the week with 8:00 AM to 11:00 PM; the current day highlighted with a copper dot.

**`map-card`** — An embedded map of the verified shop pin, with a "Directions" link.

### Inputs & Forms
**`text-input`** — Pearl fill, hairline border, 52px tall, `{rounded.sm}`, with the label above in `{colors.muted}`. Focused (`{component.text-input-focused}`): white fill, a 2px teal border and a 3px teal ring at 15% opacity.

### Badges
**`badge-pill`** — Copper pill with white `{typography.caption-uppercase}`, used for "Recommended" or "New". One per view at most.

### CTA / Footer
**`cta-band`** — A teal band at `{rounded.xl}` with a short Arabic line in `{typography.display-lg-ar}` and the WhatsApp and call buttons. The pattern may sit at 6% opacity.

**`footer`** — Ink: the logo, address, hours, phone, links, and the **registered legal name and CR number** on every page (required for publications). Social icons only for profiles that exist.

## Do's and Don'ts

### Do
- Lead with real photos of the real shop and team.
- Keep `{colors.primary}` for actions and `{colors.accent}` for small moments.
- Show the phone number in one format, `056 802 2197`, everywhere.
- Put the legal name and CR number in the footer.
- Write Arabic first, natural and polite; English is a faithful second version.

### Don't
- Don't use pure white as the page background; pearl is the brand.
- Don't make large copper or orange fills; copper is the pearl, not a theme colour.
- Don't show ratings, review counts, years in business, "24 hours" or "certified" unless they are real and current.
- Don't use stock technicians, AC clip-art, snowflakes or gradients.
- Don't put the logo on busy photos without a solid panel behind it.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Phone | < 768px | Single column; hero photo below the headline; `{component.floating-whatsapp}` appears; services 1-up; reviews scroll sideways |
| Tablet | 768–1024px | Services 2-up; nav links collapse to a menu |
| Desktop | 1024–1440px | Full nav; 3-up services; 7/5 hero |
| Wide | > 1440px | Content capped at 1120px |

### Touch Targets
Buttons are 52px tall, inputs 52px, and the floating WhatsApp button 60px. Phone links are tappable (`tel:+966568022197`).

### Collapsing Strategy
Bands keep their order on phones: hero, services, trust strip, before and after, reviews, areas, hours and map, CTA, footer. Grids reduce columns rather than shrinking cards.

## Iteration Guide
1. Build Arabic first, then mirror for English.
2. Use tokens only; no raw hex in components.
3. One primary action per band; WhatsApp is always reachable on phones.
4. New components reuse `{rounded.lg}` cards on `{colors.surface-card}` with a hairline border.
5. When unsure, add space before adding colour.
6. Document default and pressed states only; no hover specs.

## Known Gaps
- No real job photos yet; the client has to supply original camera files.
- The Google rating and review count don't exist yet, so `{component.review-card}` and the rating in `{component.trust-strip}` stay hidden until they do.
- The final trade name depends on the Ministry of Commerce rename to لولوه للتكييف والتبريد; until then the footer shows the current registered name.
- Arabic headlines and service names need a native-speaker review before launch.
- Icon set not chosen; use a single line-icon family (e.g. Lucide) in teal at a 1.75px stroke.

---

## Website Overrides

These win over everything above on the website. Logo artwork and print files keep the brand guide. Decided 1 Nov 2026.

### Colour
- **Canvas becomes `#EEF2EF` Sea Pearl**, a cool pearl, replacing warm `#F4F1EA` on screen. Warm cream with a copper accent is the most recognisable AI-generated palette of the moment, and a real pearl's lustre is cool. Print keeps the warm pearl.
- **Gulf Teal `#0F6E7A` becomes a field colour.** The page is two grounds, Sea Pearl and Gulf Teal, with one Ink band. Colour does the work photos cannot.
- `on-primary` becomes Sea Pearl. Copper stays the pearl: one dot per view. WhatsApp green stays functional, on WhatsApp buttons only.
- Secondary text on Sea Pearl: `#3C4C55`. Secondary text on teal: Sea Pearl at full strength. Never grey on teal.
- Light theme only.

### Type
Beiruti replaces Readex Pro for Arabic display. It has the warmth of a hand-painted shop sign, holds up at huge sizes, and is rare on Saudi service sites, where Cairo, Tajawal and Almarai are everywhere. IBM Plex Sans Arabic stays for Arabic text. **Schibsted Grotesk replaces both Readex Pro and Inter for all English.** Readex Pro stays inside the logo only.

| Role | Arabic | English |
|---|---|---|
| Statement | Beiruti 900, `clamp(4rem,18.5vw,18.5rem)`, leading 1.06 | Schibsted Grotesk 800, `clamp(3.4rem,10.2vw,10.25rem)`, leading 1, tracking -0.03em |
| Section head | Beiruti 800, `clamp(2.25rem,5vw,4.5rem)`, leading 1.2 | Schibsted Grotesk 700, `clamp(2rem,4.2vw,4rem)`, leading 1.08 |
| Lead | IBM Plex 400, 1.5rem, leading 1.7 | Schibsted 400, 1.375rem, leading 1.5 |
| Body | IBM Plex 400, 1.125rem, leading 1.85 | Schibsted 400, 1.0625rem, leading 1.6 |
| Small | IBM Plex 500, 0.9375rem | Schibsted 500, 0.875rem |

Five sizes, no more. Subset and self-host: Beiruti Arabic limited to weights 800 to 900, Plex 400 and 500 Arabic range, Schibsted variable Latin. Preload only the display face of the page's language. `size-adjust` fallback so the swap does not shift the layout.

### Shape and depth
- Buttons: flat, 12 px radius, one fill, 56 px tall on desktop, 52 px on phones.
- Cards are not the page's structure. Where a surface is needed, it is a tone step with no border and no shadow. The only shadow on the site is an open menu.
- Photos: square corners, no filters beyond light levels.

### Chrome
- Plain top bar: logo, three or four links, language link. No pill nav, no glass, no CTA pill in the bar on desktop; the hero carries the actions.
- Phones: an Ink bottom bar fixed to the screen edge with WhatsApp and Call. This replaces `floating-whatsapp`.

### Removed from the brand list above
`badge-pill`, `area-chip` as a row of pills, `trust-strip` as a row of badges, `service-card` as icon cards, `review-card` grid, the floating shadow, film grain. Their content moves into the section blueprints in `docs/DESIGN-DIRECTION.md`.

### Motion
One authored moment: the seam. On load the teal field rises to the horizon behind the already-visible headline. Scroll: field colour changes by chapter. Section parts rise 16 to 24 px once, staggered 70 ms, from a visible default. Transform and opacity only. The h1 never animates.
