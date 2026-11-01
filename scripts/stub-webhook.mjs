// Stands in for the Apps Script while testing locally: node scripts/stub-webhook.mjs [port]
// Checks the shared secret like the real script, prints each lead, answers {ok:true}. STUB_FAIL=1 answers 500 to test the WhatsApp fallback.
import { createServer } from 'node:http';

const secret = process.env.LEADS_WEBHOOK_SECRET ?? 'local-test-secret';
const port = Number(process.argv[2] ?? 8799);

createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  const lead = JSON.parse(body || '{}');
  const reply = (status, out) => (res.writeHead(status, { 'content-type': 'application/json' }), res.end(JSON.stringify(out)));
  if (lead.secret !== secret) return reply(200, { ok: false, error: 'unauthorized' });
  if (process.env.STUB_FAIL) return reply(500, { ok: false, error: 'stub_down' });
  const { secret: _drop, ...row } = lead;
  console.log('lead', JSON.stringify(row));
  reply(200, { ok: true, emailSent: true });
}).listen(port, '127.0.0.1', () => console.log(`stub webhook on http://127.0.0.1:${port}/exec`));
