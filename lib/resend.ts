// Sending. Mirrors the inlinkai landing's approach — Resend hosted templates
// where they fit, with a raw-HTML fallback on the same brand shell.
//
// Why the weekly issue does NOT use a hosted template: Resend caps a template
// variable at ~2000 characters, and a rendered issue body is far bigger than
// that. So the welcome mail (small variables) can go through the hosted
// template, and the weekly is rendered locally from the identical shell. Same
// markup either way — see lib/email/brand.mjs.

import { Resend } from "resend";
import {
  NEWSLETTER_FROM,
  NEWSLETTER_REPLY_TO,
  SITE_URL,
  issueTemplateVariables,
  issueTextBody,
  unsubscribeUrl,
  type IssueDoc,
} from "./newsletter";
import { listSubscribed, type Subscriber } from "./subscribers";
import { weeklyTemplateHtml, welcomeTemplateHtml } from "./email/brand.mjs";

export const hasResend = Boolean(process.env.RESEND_API_KEY);

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

// Fill {{{VAR}}} placeholders in a brand template. The same substitution Resend
// performs server-side, done locally when the payload is too big for a template.
export function fillTemplate(html: string, vars: Record<string, string>): string {
  return html.replace(/\{\{\{(\w+)\}\}\}/g, (_m, key: string) => vars[key] ?? "");
}

function unsubHeaders(token: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(token)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

// Best-effort welcome email. Never throws into the subscribe flow — a failed
// send must not stop someone from joining the list.
export async function sendWelcomeEmail(
  email: string,
  token: string,
  opts: { extra?: string } = {}
): Promise<boolean> {
  if (!hasResend) return false;

  const vars = {
    EXTRA:
      opts.extra ??
      "First issue lands soon. If it stops being useful, the unsubscribe link at the bottom always works.",
    BROWSE_URL: `${SITE_URL}/newsletter`,
    UNSUB_URL: unsubscribeUrl(token),
  };
  const subject = "You're on the list — AI, Actually Useful";
  const templateId = process.env.RESEND_TEMPLATE_WELCOME?.trim();

  try {
    const payload = templateId
      ? { template: { id: templateId, variables: vars } }
      : { html: fillTemplate(welcomeTemplateHtml(), vars) };

    const { error } = await getResend().emails.send({
      from: NEWSLETTER_FROM,
      to: email,
      subject,
      replyTo: NEWSLETTER_REPLY_TO,
      headers: unsubHeaders(token),
      ...payload,
    } as Parameters<Resend["emails"]["send"]>[0]);
    return !error;
  } catch {
    return false;
  }
}

const SENTINEL = "UNSUBTOKENSENTINEL";
const CHUNK = 100; // Resend batch limit

export type SendResult = {
  ok: boolean;
  recipients: number;
  sent: number;
  failed: number;
  dryRun: boolean;
  error?: string;
};

// Render once with a sentinel token, then personalise the unsubscribe link per
// recipient with a string replace — fast even as the list grows.
export async function sendIssue(
  issue: IssueDoc,
  opts: { recipients?: Subscriber[]; dryRun?: boolean } = {}
): Promise<SendResult> {
  const recipients = opts.recipients ?? (await listSubscribed());
  const dryRun = opts.dryRun ?? false;

  if (recipients.length === 0) {
    return { ok: true, recipients: 0, sent: 0, failed: 0, dryRun };
  }

  let html: string;
  let text: string;
  try {
    html = fillTemplate(weeklyTemplateHtml(), issueTemplateVariables(issue, { token: SENTINEL }));
    text = issueTextBody(issue, { token: SENTINEL });
  } catch (e) {
    return {
      ok: false,
      recipients: recipients.length,
      sent: 0,
      failed: recipients.length,
      dryRun,
      error: e instanceof Error ? e.message : "render failed",
    };
  }

  if (dryRun) {
    return { ok: true, recipients: recipients.length, sent: 0, failed: 0, dryRun };
  }

  if (!hasResend) {
    return {
      ok: false,
      recipients: recipients.length,
      sent: 0,
      failed: recipients.length,
      dryRun,
      error: "RESEND_API_KEY is not set",
    };
  }

  const resend = getResend();
  const subject = issue.subject || "AI, Actually Useful";
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i += CHUNK) {
    const chunk = recipients.slice(i, i + CHUNK);
    const messages = chunk.map((r) => ({
      from: NEWSLETTER_FROM,
      to: r.email,
      subject,
      html: html.split(SENTINEL).join(encodeURIComponent(r.token)),
      text: text.split(SENTINEL).join(encodeURIComponent(r.token)),
      replyTo: NEWSLETTER_REPLY_TO,
      headers: unsubHeaders(r.token),
    }));

    try {
      const { error } = await resend.batch.send(messages);
      if (error) failed += chunk.length;
      else sent += chunk.length;
    } catch {
      failed += chunk.length;
    }
  }

  return { ok: failed === 0, recipients: recipients.length, sent, failed, dryRun };
}

// Preview HTML for the CLI/preview route — sentinel token, never sent.
export function previewIssueHtml(issue: IssueDoc): string {
  return fillTemplate(weeklyTemplateHtml(), issueTemplateVariables(issue, { token: "preview" }));
}

export function previewWelcomeHtml(): string {
  return fillTemplate(welcomeTemplateHtml(), {
    EXTRA: "First issue lands this Sunday.",
    BROWSE_URL: `${SITE_URL}/newsletter`,
    UNSUB_URL: "#",
  });
}
