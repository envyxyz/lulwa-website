# Phases

Plan and copy-ready prompts per phase: https://claude.ai/artifact/W6AdsSfBJqVDMyvDBtq1Hk (private to Ameer).

Order: 1 Contract and foundation (+ 2 Content and truth) → 3 Chrome and hero → 4 Home and picker → 5 Services and faults (+ 6 Areas, brands, rest) → 7 Leads → 8 SEO → 9 Audits → 10 Go live → 11 After shots and brag → 12 After launch.

Each phase appends a dated entry: what shipped, what is left, decisions made.

## Log

### 2026-11-01 · Setup for overnight run
- Private repo created. Name settled as Lulwa. Added `docs/AUTORUN.md`, `docs/FOR-AMEER.md`, `docs/PHASE-PROMPTS.md`, and the reference update in `docs/DESIGN-DIRECTION.md`. Phases run one at a time in chats titled `#web-phase-N`.

### 2026-11-01 · Phase 0: audit, research, planning
- Shipped: read-only audit (`docs/AUDIT.md`), 62 before screenshots (`docs/before/`), Lighthouse and squirrelscan baselines, old site content (`docs/research/old-site-content.json`), URL map for all 75 old URLs (`docs/url-map.csv`), real-SERP competitor table (`docs/PRD.md`), PRD, design direction, test contract, agent workflow, repo rules, approved-direction hero mock (`design/mock/`), `scripts/shots.mjs` for the after shots, local git.
- Decided: rebuild, keep domain, slugs and analytics IDs. Astro 7 static on Cloudflare Workers free plan. Arabic at root, English at `/en/`. Beiruti, IBM Plex Sans Arabic, Schibsted Grotesk. Sea Pearl canvas, teal as a field, copper a dot only. Fault picker to WhatsApp. No AI chat, no dark mode.
- Thmanyah rejected: licence forbids reachable font files through web embedding and any modification.
- agy critique of the plan (`docs/research/raw/plan-critique.md`). Taken: no blanket hub redirects for unserved areas (410 instead), attribution tag on WhatsApp messages, `areaServed` and `hasMap`. Declined: Arabic slugs (ASCII slugs hold the existing equity and paste cleanly), KV lead buffer (add when failures appear).
- Left: Latin name and domain, who edited the site on 31 Oct, client fact sheet, native Arabic reader, technician reviewer, private GitHub repo (Phase 1). Client-facing audit PDF not rendered: the audit lives in `docs/AUDIT.md` and the plan; a delivery report comes in Phase 11.
- Not verified: Google results were read from Pakistan with `gl=sa`. Cloudflare's Dammam location and Hostinger's data centres are agy's claims; check `cdn-cgi/trace` at go-live. Search volumes unknown. Beiruti's designer credit and agy's legal claims about mandatory website disclosures are unconfirmed.
