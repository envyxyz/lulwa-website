import { handleLead, type LeadEnv } from './lead';

// Runs only for /api/* (wrangler.jsonc run_worker_first). Every other path is a static file from dist/.
export default {
  async fetch(request: Request, env: LeadEnv): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/lead') return handleLead(request, env);
    // For an uptime monitor: proves the Worker runs, touches nothing.
    if (pathname === '/api/health') return Response.json({ ok: true }, { headers: { 'cache-control': 'no-store' } });
    return Response.json({ ok: false, error: 'not_found' }, { status: 404, headers: { 'cache-control': 'no-store' } });
  },
};
