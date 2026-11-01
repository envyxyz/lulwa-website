import { z } from 'zod';
import { site } from '../src/site';

export type LeadEnv = { LEADS_WEBHOOK_URL?: string; LEADS_WEBHOOK_SECRET?: string };

const MAX_BODY = 32 * 1024;
const WEBHOOK_TIMEOUT_MS = 20_000;

// No control characters or angle brackets in any text. Leading = + - @ is neutralised in the Apps Script, where a Sheet could read it as a formula.
const text = (max: number) => z.string().trim().max(max).regex(/^[^\p{Cc}<>]*$/u);
const lineText = (max: number) => text(max).regex(/^[^\n\r]*$/);

const Lead = z
  .object({
    name: lineText(80).min(1),
    // Saudi mobiles are written 05x, +9665x or 009665x; any 8 to 15 digits are kept so a number from abroad still works.
    phone: z.string().trim().max(24).regex(/^\+?[\d\s-]{8,24}$/).refine((p) => /^\d{8,15}$/.test(p.replace(/\D/g, ''))),
    appliance: lineText(60).min(1),
    area: lineText(60).min(1),
    message: z.string().trim().max(1000).regex(/^(?:[^\p{Cc}<>]|[\n\t\r])*$/u).default(''),
    /** Slug of the page the form was on, and utm_campaign if the visit had one. Both come from the browser, so both are only labels. */
    page: lineText(80).default(''),
    utm: lineText(80).default(''),
    /** Honeypot: hidden from people, so only bots fill it. */
    website: z.string().max(200).default(''),
  })
  .strict();

const json = (status: number, body: object) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });

const reference = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `L-${[...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
};

const whatsappLink = (lead: { name: string; appliance: string; area: string; message: string; page: string }, ref: string) =>
  `${site.phone.whatsapp}?text=${encodeURIComponent(`${lead.appliance}, ${lead.area}. ${lead.message}`.trim() + ` [${lead.page || 'contact'} ${ref}]`)}`;

/** POST /api/lead: validate, hand the lead to the Apps Script (Sheet row plus email to the shop), return a reference. If the Sheet is down the answer still carries a WhatsApp link with the message. */
export async function handleLead(request: Request, env: LeadEnv, fetcher: typeof fetch = fetch): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' });
  // A browser always sends Origin on a cross-site POST, so another site's form cannot post here.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: 'origin' });
  if (Number(request.headers.get('content-length')) > MAX_BODY) return json(413, { ok: false, error: 'size' });
  const raw = await request.text();
  // Characters, not bytes, but the declared length above already stopped a large byte count.
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'size' });

  let parsed;
  try {
    parsed = Lead.safeParse(JSON.parse(raw));
  } catch {
    return json(400, { ok: false, error: 'invalid' });
  }
  if (!parsed.success) return json(400, { ok: false, error: 'invalid', fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] });
  const lead = parsed.data;
  const ref = reference();
  // A bot gets the same answer as a person and nothing is stored.
  if (lead.website) return json(200, { ok: true, reference: ref });

  const row = { reference: ref, name: lead.name, phone: lead.phone.replace(/[\s-]/g, ''), appliance: lead.appliance, area: lead.area, message: lead.message, page: lead.page, utm: lead.utm };
  try {
    if (!env.LEADS_WEBHOOK_URL || !env.LEADS_WEBHOOK_SECRET) throw new Error('webhook not configured');
    const res = await fetcher(env.LEADS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.LEADS_WEBHOOK_SECRET, ...row }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    const out = (await res.json()) as { ok?: boolean; error?: unknown; emailSent?: boolean; emailError?: unknown };
    if (!out.ok) throw new Error(`webhook said ${String(out.error)}`);
    if (out.emailSent === false) console.error('lead saved but email failed', ref, String(out.emailError));
    return json(200, { ok: true, reference: ref });
  } catch (err) {
    // Never lose a lead silently: the full lead goes to the Worker logs (the Cloudflare dashboard, this account only), and the customer is sent to WhatsApp with the message.
    console.error('lead webhook failed', String(err), JSON.stringify(row));
    return json(502, { ok: false, error: 'webhook', reference: ref, whatsapp: whatsappLink(lead, ref) });
  }
}
