import { revalidatePath } from 'next/cache';
import { freshClient } from '../../../../lib/sanity/client';
import { writeClient } from '../../../../lib/sanity/writeClient';
import { unsentIssueByIdQuery } from '../../../../lib/queries';
import { sendIssue } from '../../../../lib/resend';
import { countSubscribed } from '../../../../lib/subscribers';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Sanity publish webhook. Publishing an issue in the Studio is what mails it —
 * there is no second button to remember.
 *
 * Accepts both payload shapes Sanity can send:
 *   - transaction hooks  { ids: { created: [], updated: [], deleted: [] } }
 *   - GROQ hooks         { _id, _type, slug }
 * The transaction shape carries ids only, so the document is looked up here.
 *
 * Sending is guarded by the issue's own `status`, so re-publishing a typo fix
 * republishes the page without mailing the list twice.
 */

async function classify(ids) {
  if (ids.length === 0) return [];
  return freshClient.fetch(
    `*[_id in $ids && _type in ["issue", "post"]]{ _id, _type, "slug": slug.current }`,
    { ids }
  );
}

async function handleIssue(id, slug) {
  revalidatePath('/newsletter');
  revalidatePath('/');
  if (slug) revalidatePath(`/newsletter/${slug}`);

  const issue = await freshClient.fetch(unsentIssueByIdQuery, { id });
  if (!issue) return { id, sent: false, reason: 'already sent' };

  const recipients = await countSubscribed();
  if (recipients === 0) return { id, sent: false, reason: 'no subscribers' };

  const res = await sendIssue(issue);

  if (res.ok && res.sent > 0) {
    await writeClient
      .patch(id)
      .set({ status: 'sent', sentAt: new Date().toISOString(), recipientCount: res.sent })
      .commit();
  }

  return { id, subject: issue.subject, ...res };
}

function handlePost(slug) {
  revalidatePath('/blog');
  revalidatePath('/');
  if (slug) revalidatePath(`/blog/${slug}`);
  return { slug, revalidated: true };
}

export async function POST(request) {
  const url = new URL(request.url);
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  const provided = request.headers.get('x-webhook-secret') || url.searchParams.get('secret');

  if (secret && provided !== secret) {
    return Response.json({ ok: false, error: 'bad secret' }, { status: 401 });
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'bad payload' }, { status: 400 });
  }

  // Transaction hooks send ids; GROQ hooks send the projected document.
  const touched = payload.ids
    ? [...(payload.ids.created || []), ...(payload.ids.updated || [])]
    : [payload._id].filter(Boolean);

  // Drafts carry a `drafts.` prefix — only published documents do anything.
  const publishedIds = touched.filter((id) => id && !id.startsWith('drafts.'));
  if (publishedIds.length === 0) {
    return Response.json({ ok: true, handled: [], reason: 'drafts only' });
  }

  const docs = payload._type
    ? [{ _id: payload._id, _type: payload._type, slug: payload.slug?.current ?? payload.slug }]
    : await classify(publishedIds);

  const handled = [];
  for (const doc of docs) {
    if (doc._type === 'issue') handled.push(await handleIssue(doc._id, doc.slug));
    else if (doc._type === 'post') handled.push(handlePost(doc.slug));
  }

  return Response.json({ ok: true, handled });
}

// Handy for confirming the route is reachable after a deploy.
export function GET() {
  return Response.json({ ok: true, hint: 'POST a Sanity webhook payload here.' });
}
