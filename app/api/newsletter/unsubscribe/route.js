import { unsubscribeByToken } from '../../../../lib/subscribers';

export const dynamic = 'force-dynamic';

function page(title, body) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — aiwar.dev</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#c9c6c0;
       color:#1b1a17;font-family:'Courier New',Courier,monospace;padding:24px}
  .card{max-width:460px;background:#f2efe6;border:1px solid rgba(27,26,23,.14);padding:28px 26px;
        box-shadow:0 1px 2px rgba(0,0,0,.22),0 8px 18px rgba(0,0,0,.14)}
  h1{margin:0 0 12px;font-size:20px}
  p{margin:0 0 14px;line-height:1.65;color:#4c4a45;font-size:14px}
  a{color:#1b1a17}
</style></head><body><div class="card"><h1>${title}</h1>${body}</div></body></html>`,
    { headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

async function handle(token) {
  const email = await unsubscribeByToken(token);
  if (!email) {
    return page(
      'That link has expired',
      `<p>We couldn't find that subscription — it may already be removed.</p>
       <p><a href="/">Back to aiwar.dev</a></p>`
    );
  }
  return page(
    "You're unsubscribed",
    `<p><strong>${email}</strong> won't get any more issues. No hard feelings.</p>
     <p>If it was a mistake, you can <a href="/newsletter#join">join again</a> any time.</p>
     <p><a href="/">Back to aiwar.dev</a></p>`
  );
}

// GET for the footer link, POST for one-click List-Unsubscribe.
export async function GET(request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  return handle(token);
}

export async function POST(request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  await handle(token);
  return new Response(null, { status: 204 });
}
