# Overnight autorun rules

Set by Ameer on 2026-11-01, who is asleep. These override CLAUDE.md, docs/PHASE-PROMPTS.md and docs/AGENTS.md where they conflict.

## Never stop for Ameer
- Do not ask, wait for an OK, or use AskUserQuestion. Decide, record the decision in docs/PHASES.md, carry on.
- Anything needing Ameer goes as one line in `docs/FOR-AMEER.md` under the phase: question, verification, access, client fact. Use a clearly marked placeholder or leave the unconfirmed thing out, and keep going.
- Save the screenshots the prompt says to show (1440 and 390, Arabic and English) to `docs/shots/phase-N/`. Look at them yourself and fix what is wrong.
- Never ask Ameer to send anything to the client. Collect client questions in FOR-AMEER.md.

## Hard limits
- Do not run Phases 10, 11 or 12. They need Ameer's accounts and a live domain. After Phase 9, write the go-live checklist to FOR-AMEER.md and stop.
- No production deploy, no DNS, no changes to the live site, Hostinger, Google listing or any third-party account. No sign-ins, no CAPTCHA solving, no purchases, no messages to anyone. If a step needs one, record it and move on.
- Never publish a claim not in PRODUCT.md. Placeholders must not read as facts. Unknown facts are omitted from the page, not guessed.
- Phase 7: build and test against a local stub. The Apps Script deploy and the real lead wait for Ameer.
- Stay in this repo, plus read access to `../growth` and `../rehan-traders/website`. Push only to origin of this repo.

## Name
The Latin name is **Lulwa**, the domain lulwa.com.sa. Settled. Luluh is dropped. Logo files in `../growth/Brand/` already say Lulwa.

## Design
Read the "Reference update" section at the end of docs/DESIGN-DIRECTION.md. It replaces the hero mock as the target. Reference image: `design/reference/roofguard-inspiration.webp`. Look at it before UI work.

## Surviving limits
- Limits will run out mid-phase. Commit and push working checkpoints often (`phase N wip: ...`), so a resumed chat loses nothing. This replaces the one-commit-per-phase rule. Keep `docs/PHASES.md` current.
- On resume: read this file, `docs/PHASES.md`, `git log -15`, then continue from what exists. Do not redo work.
- Check limits with get_usage before spawning agents. Above 85% of the 5-hour window, do small work yourself and start no new agents.
- Save limits: agy for bulk, Sonnet for builders, at most two builders at a time, no agent for what five tool calls can do.

## Finishing a phase
Finish means: its tests are green (or the reason they cannot be is in FOR-AMEER.md), a dated entry `### YYYY-MM-DD · Phase N: title` is in `docs/PHASES.md`, and the final commit `phase N: title` is pushed. Do not start the next phase yourself. The parent chat or the hourly watchdog does.

Order, one at a time: 1, 2, 3, 4, 5, 6, 7, 8, 9. Titles: `#web-phase-N - short name`.

The prompts' opening `/caveman` is optional. Keep ponytail on.
