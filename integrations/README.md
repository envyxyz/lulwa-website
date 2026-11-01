# Lead integration: deploy steps

How a lead flows: contact form → `POST /api/lead` (Cloudflare Worker, `worker/lead.ts`, validates with Zod) → Apps Script web app (`leads-apps-script/Code.gs`) → a row in the shop's Google Sheet plus an email to the shop. If the Sheet path fails, the visitor is sent to WhatsApp with the message, and the full lead is in the Worker logs.

Nothing here has been deployed. Everything below is for Ameer, signed in to the shop's Google account and the Cloudflare account.

## 0. Test locally first (no secrets, no real lead)

```bash
pnpm build
pnpm worker:stub      # fake Apps Script on 127.0.0.1:8799, prints each lead
pnpm worker:dev       # Worker plus dist/ on http://127.0.0.1:8788, reads .dev.vars
```

Copy `.dev.vars.example` to `.dev.vars` first (local-only values, git-ignored). Open `http://127.0.0.1:8788/contact`, send the form, and the stub prints the lead. Stop the stub and send again to see the WhatsApp fallback.

## 1. Google Sheet and Apps Script (shop's Google account)

1. Create a Google Sheet named `Lulwa leads`. Extensions, Apps Script.
2. Replace `Code.gs` with `integrations/leads-apps-script/Code.gs`. Project Settings, tick "Show appsscript.json", and replace it with `appsscript.json` from the same folder.
3. Pick a long random secret (32+ characters, from a password manager). Project Settings, Script properties, add:
   - `SECRET` = the secret
   - `SHOP_EMAIL` = the address that should receive leads
4. Select the function `setup` and Run. Accept the permission prompts (Sheet and Mail). A `Leads` tab appears and a test email arrives.
5. Deploy, New deployment, type Web app. Execute as: Me. Who has access: Anyone. Copy the web app URL (ends in `/exec`).
6. Quick check. A wrong secret must answer `unauthorized`:

```bash
curl -sL -XPOST "WEB_APP_URL" -H "content-type: application/json" -d '{"secret":"wrong"}'
```

After any later change to `Code.gs`: Deploy, Manage deployments, edit, New version. The URL stays the same.

## 2. Cloudflare Worker

```bash
pnpm exec wrangler login
pnpm exec wrangler secret put LEADS_WEBHOOK_URL
pnpm exec wrangler secret put LEADS_WEBHOOK_SECRET
pnpm worker:deploy
```

Paste the `/exec` URL from step 1.5 for the first secret and the same `SECRET` for the second. `pnpm worker:deploy` builds, then runs `wrangler deploy`. The first deploy creates the Worker `lulwa-website` on a `workers.dev` address. Custom domain and DNS are Phase 10, not here.

## 3. The first real lead

1. Open `https://<the workers.dev address>/contact`, fill the form with a real phone of yours, send.
2. Expect: the Thank-you page, a new top row in `Leads`, an email to `SHOP_EMAIL`.
3. If WhatsApp opened instead, the Sheet path failed. Read the Worker logs (Cloudflare dashboard, Workers, lulwa-website, Logs) for `lead webhook failed`. The lead is in that log line.
4. Delete the test row.

## Notes

- Emails go through Apps Script `MailApp` (about 100 recipients a day on a free Google account, far above need).
- No rate limit beyond Cloudflare's own and the honeypot. Add a Cloudflare rate-limiting rule or a per-phone count in the script if spam shows up.
- The secret rides in the JSON body because Apps Script web apps cannot read request headers.
