# Test contract

Written before the code. Phase 1 commits every test below, red, with a `test:contract` script. Each later phase turns its own tests green. A skipped test needs a reason in `docs/PHASES.md`.

| ID | Test | Fails when | Green by |
|---|---|---|---|
| T1 | `tests/routes.spec.ts` | A route in the sitemap isn't 200, or an Arabic page lacks its `/en/` twin | 6 |
| T2 | `tests/redirects.spec.ts` | Any `docs/url-map.csv` row misses its target, returns the wrong status (301 or 410), or takes more than one hop | 8 |
| T3 | `tests/seo.spec.ts` | Missing or duplicate title or description, title over 60 Arabic characters, missing self canonical, H1 count not 1 | 8 |
| T4 | `tests/hreflang.spec.ts` | `ar-SA`, `en-SA` and `x-default` are not reciprocal and self-referencing, or a target isn't 200 | 8 |
| T5 | `tests/schema.spec.ts` | JSON-LD doesn't parse, `HVACBusiness` lacks name, legalName, telephone, address, geo, hours, areaServed or a `hasMap` link to the Google listing, hours aren't 08:00 to 23:00, or `AggregateRating` appears | 8 |
| T6 | `tests/claims.spec.ts` | Built HTML contains a banned claim in either language: 5,000, 10+, 98%, 4.9, معتمد, certified, 24 ساعة, على مدار الساعة, 24/7, نفس اليوم, same-day, أصلية, خلال ساعة, ريال, SAR. A claim moves to the allowlist only with a dated line in `PRODUCT.md` | 2 |
| T7 | `tests/nap.spec.ts` | Any page shows a phone other than 056 802 2197, or a footer lacks legal name and CR 2050163881 | 3 |
| T8 | `tests/a11y.spec.ts` | axe finds a serious or critical issue on any route, either language, 1440 or 390 | 9 |
| T9 | `tests/keyboard.spec.ts` | Fault picker, menu, language link and lead form can't be completed by keyboard | 7 |
| T10 | `tests/overflow.spec.ts` | Horizontal scroll at 320, 360, 390, 768, 1024, 1440 or 1920 on any route | 6 |
| T11 | `tests/headlines.spec.ts` | Any heading exceeds two lines at any of those widths | 6 |
| T12 | `tests/rtl.spec.ts` | `dir` or `lang` wrong, phone digits reordered, a directional icon doesn't mirror, or Arabic falls back to a system font | 3 |
| T13 | `tests/budget.spec.ts` | Own JS over 6 KB gzip, fonts over 110 KB, first load over 250 KB excluding analytics, or a render-blocking third party | 3, rechecked 9 |
| T14 | `tests/fault-picker.spec.ts` | Picker fails without JS (plain links), or the WhatsApp URL doesn't carry appliance, fault and area in the right language | 4 |
| T15 | `tests/lead.spec.ts` | Worker accepts invalid input, leaks a secret, or fails to fall back to WhatsApp when the Sheet is down; consent line missing | 7 |
| T16 | `tests/analytics.spec.ts` | `call_click`, `whatsapp_click`, `directions_click`, `picker_complete` or `lead_submit` don't fire, or an event carries personal data | 7 |
| T17 | `tests/visual.spec.ts` | Playwright snapshot diff over threshold on home, one service, one fault at 1440 and 390, both languages | 9 |
| T18 | `lighthouserc.cjs` | Any route under 95 in any category on mobile, median of 3, or LCP over 2.0 s, TBT over 100 ms, CLS over 0.05 | 9 |
| T19 | ESLint and stylelint | Raw hex, arbitrary value, physical CSS direction, literal copy in a component. Each rule proven to fire | 1 |
| T20 | `inspect.mjs` and `lint.mjs` from `design-taste-frontend` | Any FAIL on built pages | 9 |
| T21 | `tests/copy-parity.spec.ts` | Arabic and English content files differ in shape, or a page has fewer English sections than Arabic | 2 |
| T22 | `scripts/check-photos.mjs` | A photo renders larger than its source width, or lacks a provenance entry | 4 |
| T23 | `tests/related-services.spec.ts` | A service page lacks the related section as the last thing above the footer, shows other than 3 cards, links to itself or crosses languages | 9 |

Reference update, 1 Nov 2026: rounded tone-step cards pass T19 and T20. Generated product images pass T22 when listed as `kind: generated`.

## Performance rule

Lighthouse scores are noisy on this machine. Run with nothing else heavy running, three runs per URL, take the median. Report ranges. Before go-live, also run from a Cloudflare deployment and record `cdn-cgi/trace` `colo`.
