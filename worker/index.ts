import { gone } from './gone';
import { handleLead, type LeadEnv } from './lead';

// Runs only for /api/* and the removed URLs listed in wrangler.jsonc (wrangler.jsonc run_worker_first). Every other path is a static file from dist/.
export default {
  async fetch(request: Request, env: LeadEnv): Promise<Response> {
    const { pathname } = new URL(request.url);
    // Removed area pages: a deliberate 410, not a 404 (docs/url-map.csv).
    if (gone.has(pathname)) return new Response('Gone', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
    if (pathname === '/api/lead') return handleLead(request, env);
    // For an uptime monitor: proves the Worker runs, touches nothing.
    if (pathname === '/api/health') return Response.json({ ok: true }, { headers: { 'cache-control': 'no-store' } });
    return Response.json({ ok: false, error: 'not_found' }, { status: 404, headers: { 'cache-control': 'no-store' } });
  },
};
