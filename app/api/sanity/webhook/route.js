import { revalidatePath } from 'next/cache';
import { freshClient } from '../../../../lib/sanity/client';
import { writeClient } from '../../../../lib/sanity/writeClient';
import { unsentIssueByIdQuery } from '../../../../lib/queries';
import { sendIssue } from '../../../../lib/resend';
import { countSubscribed } from '../../../../lib/subscribers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Sanity publish webhook. Publishing an issue in the Studio is what sends it —
 * there's no second button to remember.
 *
 * Configure in Sanity Manage → API → Webhooks:
 *   URL      https://aiwar.dev/api/sanity/webhook
 *   Trigger  create + update on `issue` and `post`
 *   Secret   SANITY_WEBHOOK_SECRET
 *   Filter   _type == "issue" || _type == "post"
 *
 * Sending is guarded by the issue's own `status` field, so a re-publish (a typo
 * fix, say) republishes the page without mailing the list twice.
 */
export async function POST(request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const provided =
    request.headers.get('x-webhook-secret') ||
    new URL(request.url).searchParams.get('secret');

  if (secret && provided !== secret) {
    return Response.json({ ok: false, error: 'bad secret' }, { status: 401 });
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'bad payload' }, { status: 400 });
  }

  const { _id, _type } = payload;

  if (_type === 'post') {
    revalidatePath('/blog');
    revalidatePath('/');
    if (payload.slug?.current) revalidatePath(`/blog/${payload.slug.current}`);
    return Response.json({ ok: true, revalidated: 'post' });
  }

  if (_type !== 'issue') {
    return Response.json({ ok: true, skipped: _type || 'unknown' });
  }

  // The archive should update whether or not the mail-out succeeds.
  revalidatePath('/newsletter');
  revalidatePath('/');
  if (payload.slug?.current) revalidatePath(`/newsletter/${payload.slug.current}`);

  // Drafts carry a `drafts.` id prefix; only the published doc should send.
  if (!_id || _id.startsWith('drafts.')) {
    return Response.json({ ok: true, sent: false, reason: 'draft' });
  }

  const issue = await freshClient.fetch(unsentIssueByIdQuery, { id: _id });
  if (!issue) {
    return Response.json({ ok: true, sent: false, reason: 'already sent' });
  }

  const recipients = await countSubscribed();
  if (recipients === 0) {
    return Response.json({ ok: true, sent: false, reason: 'no subscribers' });
  }

  const res = await sendIssue(issue);

  if (res.ok && res.sent > 0) {
    await writeClient
      .patch(_id)
      .set({ status: 'sent', sentAt: new Date().toISOString(), recipientCount: res.sent })
      .commit();
  }

  return Response.json({ ok: res.ok, ...res });
}

// A GET is handy for confirming the route is reachable after a deploy.
export function GET() {
  return Response.json({ ok: true, hint: 'POST a Sanity webhook payload here.' });
}
