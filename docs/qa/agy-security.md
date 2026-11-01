### Security Audit Findings

Prioritized audit covering `worker/lead.ts`, `worker/index.ts`, `wrangler.jsonc`, `public/_headers`, `integrations/leads-apps-script/Code.gs`, and `src/components/LeadForm.astro`.

---

#### 1. Formula Injection / CSV Injection (Improper Neutralization)
* **Severity:** Medium
* **File & Line:** `integrations/leads-apps-script/Code.gs:80`
* **Defect:** `cell(v)` checks `/^[=+\-@]/` and prepends a single quote (`'`), but modern spreadsheet engines (including Google Sheets, Excel, and LibreOffice) also treat tab characters, carriage returns, pipe (`|`), and `%` (e.g., `%0A=cmd`) or Unicode formula prefixes as formula triggers. More critically, in `Code.gs:31`, `data.phone` is interpolated unescaped into a WhatsApp formula string:
  ```javascript
  'https://wa.me/' + String(data.phone).replace(/^\+/, '').replace(/^00/, '').replace(/^0/, '966')
  ```
  While `worker/lead.ts` strips non-digits, `data.phone` is directly accepted and written to `getRange().setValues()` without formula escaping.
* **Fix:** In `Code.gs:80`, expand the regex check to `/^[\s=+\-@\t\r]/` or use `SpreadsheetApp`'s `.setValue()` with explicit plain text formatting (`setNumberFormat('@')`) prior to writing user data, or enforce prefixing `'` on all string-type inputs.

---

#### 2. Logging PII in Worker Cloudflare Console Logs
* **Severity:** Medium
* **File & Line:** `worker/lead.ts:78`
* **Defect:** In the catch block of `handleLead`:
  ```typescript
  console.error('lead webhook failed', String(err), JSON.stringify(row));
  ```
  `row` contains cleartext personal data: customer's full name, telephone number, district, and freeform message (`row.name`, `row.phone`, `row.message`). These logs are streamed and persisted in Cloudflare dashboard logs / logpush pipelines, violating data minimization principles and creating unneeded exposure of personal data.
* **Fix:** Log only non-identifying operational metadata in the error message (e.g. `ref`, error code, appliance type, and timestamp) and omit `row.name`, `row.phone`, and `row.message`:
  ```typescript
  console.error('lead webhook failed', String(err), JSON.stringify({ reference: ref, error: String(err) }));
  ```

---

#### 3. Unauthenticated Origin Spoofing / Missing Origin Check on Non-Browser Clients
* **Severity:** Low
* **File & Line:** `worker/lead.ts:44-45`
* **Defect:**
  ```typescript
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: 'origin' });
  ```
  If `origin` is absent (which can occur on certain non-CORS requests, server-side tools, or stripped headers), the check passes. Furthermore, `new URL(origin).host` parsing will throw an unhandled exception if a malformed `Origin` header value is sent (e.g. `Origin: null` or `Origin: invalid`), causing an uncaught 500 error instead of a graceful 403/400.
* **Fix:** Wrap the origin URL parsing in a `try/catch` and reject malformed origins. Additionally check `request.headers.get('sec-fetch-site')` (`same-origin`) to restrict submissions strictly to first-party browser contexts.

---

#### 4. Google Sheets Script Properties Timing / Concurrency Lock Window
* **Severity:** Low
* **File & Line:** `integrations/leads-apps-script/Code.gs:24-25`
* **Defect:**
  ```javascript
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return reply({ ok: false, error: 'busy' });
  ```
  The lock timeout is set to 5000ms. If multiple leads arrive concurrently or Google Sheets execution lags, the lock fails and returns `{ ok: false, error: 'busy' }`. In `worker/lead.ts:73`, this causes the Worker to treat it as an unrecoverable failure and redirects the user to WhatsApp.
* **Fix:** Increase the `tryLock` duration (up to 15,000–30,000ms) or implement exponential backoff retry in `worker/lead.ts` before failing to 502.

---

### Audit Findings by Requested Category

* **Input Validation:**
  * `worker/lead.ts:13-27`: Thorough validation with Zod (`name`, `phone`, `appliance`, `area`, `message`, `website` honeypot). Regexes strip control characters and limit lengths. `strict()` prevents schema pollution.
* **Secret Leaks:**
  * `wrangler.jsonc:8`: Clean. No hardcoded credentials or API tokens. Secrets are passed via environment bindings (`LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET`).
  * `LeadForm.astro`: Clean. Exposes no server secrets.
* **CORS & Origin:**
  * `worker/lead.ts:44-45`: Validates cross-origin requests when `Origin` header is present. No wildcard `Access-Control-Allow-Origin: *` headers emitted on API routes.
* **Header Injection:**
  * `worker/lead.ts:11`: `lineText` regex `^[^\n\r]*$` explicitly prevents CRLF injection on single-line inputs.
  * `worker/index.ts`: Uses standard static response headers without dynamically inserting unescaped input into response headers.
* **Formula Injection:**
  * Detected in `integrations/leads-apps-script/Code.gs:80` (see defect #1 above).
* **CSP (Content Security Policy):**
  * `public/_headers:7`: Strong configuration (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`).
  * *Note:* Contains `'unsafe-inline'` for `script-src` and `style-src`. This is expected for standard static Astro SSG deployments without dynamic nonce injection, but could be tightened with SHA-256 hashes if zero-inline is required.
* **PDPL Consent (Saudi Personal Data Protection Law):**
  * `LeadForm.astro:52`: Displays explicit consent copy and links to `/privacy-policy`.
  * `src/content/en.ts:281-292` & `src/content/ar.ts`: Clear disclosures specifying purpose, storage, entity CR, and subject rights (access/deletion). Consent is implicit upon submission under contractual necessity for repair quote fulfillment.
* **Personal Data in URLs or Analytics:**
  * `src/scripts/track.ts:1-22`: Clean. `track()` only captures `{ event, location: slug() }`. No user input, phone numbers, or PII are passed to `dataLayer`.
  * `LeadForm.astro:100-101`: Post-submit redirect routes to `/thanks` without PII query parameters.
  * `LeadForm.astro:110` / `worker/lead.ts:37-38`: The fallback WhatsApp link passes form content in the URL (`?text=...`). Because this opens the official WhatsApp API client (`wa.me`), this is by design for direct communication, though the URL is transmitted to WhatsApp's domain.
