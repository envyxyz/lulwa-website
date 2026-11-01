# Agent workflow

Five seats per phase, at most. The lead stays small: it decides, reviews and merges, and does not type bulk work.

| Seat | Model | Does | Never |
|---|---|---|---|
| Lead | Opus 5.5, this chat | Reads the phase, writes each agent's brief, reviews diffs and screenshots, merges, runs the tests | Bulk copy, per-page boilerplate |
| Builder A | Sonnet 5.5, own worktree | Template or component work in its own file set | Touch another builder's files |
| Builder B | Sonnet 5.5, own worktree | Second independent file set | Same |
| Builder C | Sonnet 5.5, own worktree, only when a third independent file set exists | Tests, or a third file set | Same |
| agy orchestrator | Opus 5.5, background | Fans out 5 to 10 agy jobs, checks every result, returns verified files | Trust agy's facts, or write outside its folder |

## Rules

- Spawn with the `Agent` tool, `isolation: "worktree"` for builders, `model: "sonnet"`. Give each agent the file list it owns and its tests.
- Two writers never share a file. If they must, run them in sequence.
- Merge order: orchestrator content first, then components, then tests.
- A quick job stays with the lead. Don't spawn an agent for five tool calls.

## agy on this machine

```bash
C:/Users/ameer/AppData/Local/agy/bin/agy -p "PROMPT" --print-timeout 4m30s --effort low > out/NAME.md 2>&1 &
```

- One task per call, printed to stdout, then `wait`. The orchestrator writes the files.
- Prompts that ask agy to write files or make many searches hang. Split them.
- `--dangerously-skip-permissions` is blocked. Don't use it.
- Images: about 14 per quota window, then a long 429. Spend only on what's needed. Generated images are product illustrations on white only, per docs/DESIGN-DIRECTION.md, and never pass as job photos.

## What agy may do

Per-page copy drafts from `old-site-content.json` against a fixed shape · English twins · Arabic copy review, one file per job · keyword and People Also Ask research · competitor page teardowns · SVG icon and diagram drafts · JSON-LD drafts · alt text · second-opinion code review of a finished phase.

## What the orchestrator checks before returning anything

1. Every fact against `PRODUCT.md`. agy invents hours, warranties, prices, and SERP results. The 1 Nov run listed some titles that don't match Google, so real rankings come only from the browser pane.
2. Output parses and matches the type in `src/content/types.ts`.
3. `tests/claims.spec.ts` passes on the result.
4. Arabic reads as Saudi, not literal English. Anything doubtful goes in a list for the native reviewer.
5. No AI writing tells, per `anti-ai-slop-writing`.

## Per-phase split

| Phase | Lead | Sonnet | agy jobs |
|---|---|---|---|
| 1 Contract and foundation | Tokens, fonts, review | A: Astro, i18n, lint. B: all 22 tests, red | 0 |
| 2 Content and truth | Truth pass, shape | A: `types.ts`, parity tests | 10: one per page group, Arabic. 5: English twins |
| 3 Chrome and hero | Port hero, review | A: nav, footer, bottom bar. B: `rtl`, `nap`, `budget` | 2: copy review, code review |
| 4 Home and picker | Direction, picker logic | A: sections. B: photo pipeline, picker tests | 3: picker fault lists, diagrams, review |
| 5 Services and faults | Template | A: service. B: fault | 10: fault drafts |
| 6 Areas, brands, rest | Template, prune | A: area and brand. B: about, contact, reviews, work, legal | 8: local notes and error codes |
| 7 Leads | Security review | A: Worker. B: form, events | 1: code review |
| 8 SEO and AI search | Keyword map, titles | A: schema, hreflang, sitemap. B: redirects, robots | 8: title and meta drafts, SERP teardowns |
| 9 Audits | Fix triage | A, B, C: fix batches | 5: second-opinion audits |
| 10 Go live | Runs it, with Ameer | 0 | 0 |
| 11 After and brag | Video | A: after shots | 2 |
| 12 After launch | One item per chat | As needed | As needed |
