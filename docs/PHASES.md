# Phases

Plan and copy-ready prompts per phase: https://claude.ai/artifact/W6AdsSfBJqVDMyvDBtq1Hk (private to Ameer).

Order: 1 Contract and foundation (+ 2 Content and truth) → 3 Chrome and hero → 4 Home and picker → 5 Services and faults (+ 6 Areas, brands, rest) → 7 Leads → 8 SEO → 9 Audits → 10 Go live → 11 After shots and brag → 12 After launch.

Each phase appends a dated entry: what shipped, what is left, decisions made.

## Log

### 2026-11-01 · Phase 1: Test contract and foundation
- Shipped: Astro 7 static scaffold (TypeScript strictest, Tailwind v4, ar at root, en at `/en`), tokens, self-hosted fonts, Base layout, Container, Section, Heading, Text, Button, Icon, Img, `src/site.ts`, content types with ar and en stubs, dev-only kitchen sink, lint rules with `scripts/prove-lint.mjs`, all 22 contract tests, `test:contract`. Screens in `docs/shots/phase-1/`.
- State: T19 green. Typecheck clean. T1 to T17, T20 to T22 run and are red (`--fast` run, one fix since). T18 red: a missing page fails with a 404 load error.
- Red reasons checked: missing routes, footer, tel link, picker, `worker/lead.ts`, provenance file, stub content. T20 fails on the bare stub pages. Later specs fix their hooks in header comments: `data-testid`, `data-picker-*`, `#lead-form`, `handleLead(request, env, fetcher)`, `src/images/provenance.json`.
- Fonts: Arabic pages 69 KB (Beiruti 800 to 900, Plex 400 and 500), English 34 KB. Budget 110 KB. OFL files in `public/fonts/licenses/`. Arabic subset cut to Saudi letters and essential OpenType features to fit.
- Decided: `build.format: 'file'` and `trailingSlash: 'never'`, so old slugs keep their exact URL and the English home is `/en`, not `/en/` as `docs/url-map.csv` writes it; Phase 8 redirects `/en/`. TypeScript 5, since 7 is newer than the Astro tooling was tried with. Kitchen sink injected only under `astro dev`, so it cannot reach dist. Tokens clear Tailwind's default palette, radii, shadows and type sizes, so off-token utilities produce nothing.
- Design change: `--radius-card`, `--radius-panel`, `--color-pearl-step`, `--color-teal-step`, `--color-ink-step` added for rounded tone-step cards, which lint allows and proves it allows. `--color-teal-quiet` is 3.84:1 on pearl, large type only. `taste.mjs` passes `--allow card-rows,radius-mix` because the Reference update wins over the inspector. T22 accepts `kind: generated` with the raw file in `design/generated/`, and rejects a generated image marked `data-job`.
- T7, T12, T13 run on built pages, because they are due in Phase 3 before most pages exist; the others run on all owed routes from `docs/url-map.csv`. T18 does too.
- Worked alone with no agents: the 5-hour window was at 94% at the start. Phase 1 ran across a limit reset.
- Not verified: `Img` has not rendered, as no exports exist until Phase 4; it is typechecked only. Kitchen sink reports `Plex Arabic Fallback` as loaded on Arabic pages, cause not traced; visible text renders in Plex. T2 runs on `astro preview` until Phase 8 points it at wrangler. The full `test:contract` with Lighthouse was not run end to end.

### 2026-11-01 · Setup for overnight run
- Private repo created. Name settled as Lulwa. Added `docs/AUTORUN.md`, `docs/FOR-AMEER.md`, `docs/PHASE-PROMPTS.md`, and the reference update in `docs/DESIGN-DIRECTION.md`. Phases run one at a time in chats titled `#web-phase-N`.

### 2026-11-01 · Phase 0: audit, research, planning
- Shipped: read-only audit (`docs/AUDIT.md`), 62 before screenshots (`docs/before/`), Lighthouse and squirrelscan baselines, old site content (`docs/research/old-site-content.json`), URL map for all 75 old URLs (`docs/url-map.csv`), real-SERP competitor table (`docs/PRD.md`), PRD, design direction, test contract, agent workflow, repo rules, approved-direction hero mock (`design/mock/`), `scripts/shots.mjs` for the after shots, local git.
- Decided: rebuild, keep domain, slugs and analytics IDs. Astro 7 static on Cloudflare Workers free plan. Arabic at root, English at `/en/`. Beiruti, IBM Plex Sans Arabic, Schibsted Grotesk. Sea Pearl canvas, teal as a field, copper a dot only. Fault picker to WhatsApp. No AI chat, no dark mode.
- Thmanyah rejected: licence forbids reachable font files through web embedding and any modification.
- agy critique of the plan (`docs/research/raw/plan-critique.md`). Taken: no blanket hub redirects for unserved areas (410 instead), attribution tag on WhatsApp messages, `areaServed` and `hasMap`. Declined: Arabic slugs (ASCII slugs hold the existing equity and paste cleanly), KV lead buffer (add when failures appear).
- Left: Latin name and domain, who edited the site on 31 Oct, client fact sheet, native Arabic reader, technician reviewer, private GitHub repo (Phase 1). Client-facing audit PDF not rendered: the audit lives in `docs/AUDIT.md` and the plan; a delivery report comes in Phase 11.
- Not verified: Google results were read from Pakistan with `gl=sa`. Cloudflare's Dammam location and Hostinger's data centres are agy's claims; check `cdn-cgi/trace` at go-live. Search volumes unknown. Beiruti's designer credit and agy's legal claims about mandatory website disclosures are unconfirmed.
