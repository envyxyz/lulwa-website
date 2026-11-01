# Redesign pass, 1 Nov 2026: chrome, dark mode, reviews, FAQ, footer, sitemap

Lead audit: full-page shots of `/`, `/en`, `/en/services/ac-repair` and `/en/contact` in light and dark, at 1440 and 390, plus the `design:design-critique` frame.

## Critique (what is wrong now)

| Area | Problem | Fix |
|---|---|---|
| Header | A flat row of 4 links and an underlined language link. There is no CTA, no active state and no surface, and it scrolls away. | Sticky bar that hides on scroll down and returns on scroll up. Nav sits in a tone-step pill with an active state, plus a phone icon button and a compact WhatsApp CTA. |
| Dark mode | Navy `#0b1f2a` ground and `#15303e` cards everywhere, which reads blue and muddy. | Near-monochrome graphite with a faint teal cast. Teal and copper become hints only. **Light mode is untouched.** |
| Side margins | Gutter `clamp(1rem,3vw,2rem)` puts content almost at the screen edge at 1440. | Slightly wider gutter (token only). |
| How it starts | Three cards stagger downward with uneven heights and no step markers, so it looks broken. | Equal-height row. Each card gets a step number in teal, a title and a line, top-aligned. |
| Reviews | One review as a big quote, two tiny "Good work" lines and a huge empty gap. | Rating summary card (5.0, 5 stars, 8 reviews, as-of date, Google Maps link) plus a grid of real review cards (initial avatar, name, relative date, 5 stars, text verbatim). Show all 5 visible Google reviews, emoji as written. |
| FAQ | Three questions, full-width bars and a weak heading. | Two columns: heading, lead and a WhatsApp CTA on one side, accordion on the other. Questions are the old site's real questions with answers rewritten to confirmed facts only. The first one is open. |
| Footer | A giant phone number, a loose dl row and an underlined link row, so it looks unfinished. | Structured footer: brand column (logo, one line, WhatsApp and call buttons), Services, Company, and Visit us (address, hours, directions). Bottom row has the legal name, CR, legal links, language and ©. |
| Statement panel | Copy that talks about itself ("We only write here what we can show"). | Out of scope here. Content stays. |

## Things the lead decided against

- **Old-site testimonials will not ship.** They are templated cards (Ahmed M., Fatima R. …) whose names are not on Google, and they claim same-day, within two hours, original parts and transparent prices, all banned in `PRODUCT.md`. `docs/AUDIT.md` §2 already flagged them as invented. Publishing them would be fake reviews. We use the 5 real Google reviews and present them properly.
- **No new pages for unserved areas or appliances.** The old sitemap's 21 area pages and 30 brand pages were near-duplicate thin pages. `docs/url-map.csv` already 301s or 410s them. Adding them back would hurt SEO and the truth rules. Pages are added only where real content exists: a `/faq` page (both languages, FAQPage schema), reachable from the header menu and the footer.
- **Light mode stays exactly as it is.**

## Workforce

- Lead (Opus): audit, plan, merge, final checks, ship.
- agy orchestrator (Opus) runs 10 agy jobs (sitemap, competitors, header, palette, footer, reviews, FAQ, critique, perf) and writes `FINDINGS.md`.
- Builder 1 (Sonnet): header, gutter, dark palette, footer. Files: `TopBar.astro`, `Footer.astro`, `BottomBar.astro`, `tokens.css`, `global.css`, `chrome.ts`, `Base.astro`, plus the `chrome`/`footer` keys in content.
- Builder 2 (Sonnet): steps, reviews (home and `/reviews`), FAQ (home and new `/faq`), consistency of section heads. Files: `Home.astro`, `Faq.astro`, `reviews.astro` (both languages), new `faq.astro` (both languages), `seo.ts` for FAQPage, plus the `home`/`reviews`/`faq` keys in content.
- Then the lead runs the consistency and responsiveness check (`design-system-audit`, screenshots at 390, 768 and 1440 in both themes), runs Lighthouse, applies fixes and ships.
