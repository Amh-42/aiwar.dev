// Server-side newsletter pipeline: read an issue from Sanity, render it with
// the shared brand templates, hand it to Resend.
//
// Uses relative imports so `tsx` can run it straight from a CLI script.

import { freshClient } from "./sanity/client";
import { issueByIdQuery, issueBySlugQuery, publishedIssuesQuery } from "./queries";
import { renderIssueBody, renderIssueText } from "./email/brand.mjs";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aiwar.dev";
export const NEWSLETTER_FROM =
  process.env.NEWSLETTER_FROM || "Anwar at aiwar.dev <hey@aiwar.dev>";
export const NEWSLETTER_REPLY_TO = process.env.NEWSLETTER_REPLY_TO || undefined;

export type IssueDoc = {
  _id: string;
  subject?: string;
  slug?: string;
  preheader?: string;
  issueDate?: string;
  number?: number;
  status?: string;
  sentAt?: string;
  recipientCount?: number;
  body?: unknown[];
};

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function issueUrl(slug: string | undefined): string {
  return slug ? `${SITE_URL}/newsletter/${slug}` : `${SITE_URL}/newsletter`;
}

export function formatIssueDate(iso: string | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function getIssueById(id: string): Promise<IssueDoc | null> {
  return freshClient.fetch<IssueDoc | null>(issueByIdQuery, { id });
}

export async function getIssueBySlug(slug: string): Promise<IssueDoc | null> {
  return freshClient.fetch<IssueDoc | null>(issueBySlugQuery, { slug });
}

export async function listIssues(): Promise<IssueDoc[]> {
  return freshClient.fetch<IssueDoc[]>(publishedIssuesQuery);
}

export function issueLabel(issue: IssueDoc): string {
  const date = formatIssueDate(issue.issueDate);
  return issue.number ? `Issue ${issue.number} · ${date}` : date;
}

// The variable payload for the `aiwar-weekly` Resend template. BODY is raw HTML
// injected with triple braces, exactly like the inlinkai transactional templates.
export function issueTemplateVariables(
  issue: IssueDoc,
  opts: { token: string }
): Record<string, string> {
  return {
    ISSUE_LABEL: issueLabel(issue),
    HEADLINE: issue.subject || "AI, Actually Useful",
    PREHEADER: issue.preheader || issue.subject || "This week, on AI.",
    BODY: renderIssueBody(issue),
    BROWSER_URL: issueUrl(issue.slug),
    UNSUB_URL: unsubscribeUrl(opts.token),
  };
}

export function issueTextBody(issue: IssueDoc, opts: { token: string }): string {
  return renderIssueText(issue, {
    unsubUrl: unsubscribeUrl(opts.token),
    browserUrl: issueUrl(issue.slug),
  });
}

// Same body HTML the email uses, for the read-online page.
export function issueBodyHtml(issue: IssueDoc): string {
  return renderIssueBody(issue);
}
