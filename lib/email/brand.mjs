/**
 * Inline HTML for the Resend hosted templates — same approach as the inlinkai
 * landing (`scripts/lib/email-brand-templates.mjs`): a table-layout shell with
 * a dark brand bar, `{{{VAR}}}` placeholders, created and published once via
 * the CLI scripts, then referenced by id at send time.
 *
 * Palette is lifted from app/globals.css so the email reads as the same object
 * as the site: paper #c9c6c0, note #f2efe6, ink #1b1a17, thread red #bf2419.
 *
 * Lives in lib/ rather than scripts/ because the runtime send path needs
 * `renderIssueBody` too, and one copy of the brand beats two.
 */

import { toHTML } from "@portabletext/to-html";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aiwar.dev";

const MONO =
  "'Courier New', Courier, ui-monospace, SFMono-Regular, Menlo, monospace";

const PAPER = "#c9c6c0";
const NOTE = "#f2efe6";
const INK = "#1b1a17";
const PENCIL = "#6d6a64";
const GRAPHITE = "#4c4a45";
const THREAD = "#bf2419";

function shell({ inner, preheader = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>aiwar.dev</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${PAPER};">
    <tr>
      <td align="center" style="padding:32px 14px 44px;">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background-color:${NOTE};border:1px solid rgba(27,26,23,0.14);box-shadow:0 1px 2px rgba(0,0,0,0.22), 0 8px 18px rgba(0,0,0,0.14);">
          <tr>
            <td style="padding:18px 24px 16px;background-color:${INK};">
              <span style="font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:0.22em;color:#ffffff;text-transform:uppercase;">AIWAR.DEV</span>
              <p style="margin:7px 0 0;font-family:${MONO};font-size:12px;line-height:1.5;color:rgba(255,255,255,0.62);">AI, Actually Useful &mdash; one email a week</p>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 24px 6px;font-family:${MONO};">
${inner}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px 26px;border-top:1px solid rgba(27,26,23,0.12);">
              <p style="margin:0 0 9px;font-family:${MONO};font-size:12px;line-height:1.55;color:${PENCIL};">Written by Anwar Misbah in Addis Ababa. Reply to this email &mdash; it comes straight to me.</p>
              <p style="margin:0 0 9px;font-family:${MONO};font-size:12px;line-height:1.55;color:${PENCIL};"><a href="https://t.me/aiwar_dev" style="color:${INK};text-decoration:none;border-bottom:1px solid rgba(27,26,23,0.28);">Telegram</a> &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:${INK};text-decoration:none;border-bottom:1px solid rgba(27,26,23,0.28);">aiwar.dev</a></p>
              <p style="margin:0;font-family:${MONO};font-size:11px;line-height:1.5;color:#9a978f;"><a href="{{{UNSUB_URL}}}" style="color:#9a978f;text-decoration:underline;">Unsubscribe</a> &mdash; one click, no questions.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Welcome mail — sent the moment someone joins. Sets the expectation. */
export function welcomeTemplateHtml() {
  const inner = `
              <p style="margin:0 0 16px;font-family:${MONO};font-size:17px;line-height:1.4;color:${INK};font-weight:700;">You're on the list.</p>
              <p style="margin:0 0 14px;font-family:${MONO};font-size:14px;line-height:1.65;color:${GRAPHITE};">One email a week about AI &mdash; what I&apos;m using, what I&apos;ve worked out, and what&apos;s actually worth your time.</p>
              <p style="margin:0 0 14px;font-family:${MONO};font-size:14px;line-height:1.65;color:${GRAPHITE};">Written by someone building with this stuff daily, not summarising press releases. Short, plain, and never more than once a week.</p>
              <p style="margin:0 0 22px;font-family:${MONO};font-size:14px;line-height:1.65;color:${GRAPHITE};">{{{EXTRA}}}</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px;">
                <tr><td style="background-color:${INK};">
                  <a href="{{{BROWSE_URL}}}" style="display:inline-block;padding:11px 20px;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.06em;color:#ffffff;text-decoration:none;text-transform:uppercase;">Read past issues</a>
                </td></tr>
              </table>
  `;
  return shell({ inner, preheader: "One email a week about AI, from someone building with it." });
}

/** Weekly issue — the body is rendered per-issue and injected as raw HTML. */
export function weeklyTemplateHtml() {
  const inner = `
              <p style="margin:0 0 4px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${PENCIL};">{{{ISSUE_LABEL}}}</p>
              <p style="margin:0 0 20px;font-family:${MONO};font-size:19px;line-height:1.35;color:${INK};font-weight:700;">{{{HEADLINE}}}</p>
{{{BODY}}}
              <p style="margin:26px 0 6px;font-family:${MONO};font-size:12px;line-height:1.55;color:${PENCIL};"><a href="{{{BROWSER_URL}}}" style="color:${PENCIL};text-decoration:underline;">Read this issue in a browser</a></p>
  `;
  return shell({ inner, preheader: "{{{PREHEADER}}}" });
}

// ---------------------------------------------------------------------------
// Issue body — Portable Text rendered to inline-styled email HTML. The same
// function feeds the read-online page, so the two can never drift.
// ---------------------------------------------------------------------------

const P = `margin:0 0 14px;font-family:${MONO};font-size:14px;line-height:1.7;color:${GRAPHITE};`;
const LINK = `color:${INK};text-decoration:none;border-bottom:1px solid rgba(27,26,23,0.32);`;

const ptComponents = {
  block: {
    normal: ({ children }) => `<p style="${P}">${children}</p>`,
    h1: ({ children }) =>
      `<p style="margin:26px 0 10px;font-family:${MONO};font-size:19px;line-height:1.3;color:${INK};font-weight:700;">${children}</p>`,
    h2: ({ children }) =>
      `<p style="margin:24px 0 10px;font-family:${MONO};font-size:17px;line-height:1.3;color:${INK};font-weight:700;">${children}</p>`,
    h3: ({ children }) =>
      `<p style="margin:22px 0 8px;font-family:${MONO};font-size:15px;line-height:1.35;color:${INK};font-weight:700;">${children}</p>`,
    blockquote: ({ children }) =>
      `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;"><tr><td style="padding:10px 0 10px 14px;border-left:3px solid ${THREAD};"><p style="${P}margin:0;">${children}</p></td></tr></table>`,
  },
  list: {
    bullet: ({ children }) =>
      `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 14px;"><tr><td style="padding-left:4px;">${children}</td></tr></table>`,
    number: ({ children }) =>
      `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 14px;"><tr><td style="padding-left:4px;">${children}</td></tr></table>`,
  },
  listItem: {
    bullet: ({ children }) =>
      `<p style="${P}margin:0 0 7px;padding-left:16px;text-indent:-16px;">&bull;&nbsp; ${children}</p>`,
    number: ({ children }) =>
      `<p style="${P}margin:0 0 7px;padding-left:16px;text-indent:-16px;">&ndash;&nbsp; ${children}</p>`,
  },
  marks: {
    strong: ({ children }) => `<strong style="color:${INK};">${children}</strong>`,
    em: ({ children }) => `<em>${children}</em>`,
    code: ({ children }) =>
      `<code style="font-family:${MONO};background:#e8e5df;padding:1px 4px;">${children}</code>`,
    link: ({ children, value }) =>
      `<a href="${value?.href || "#"}" style="${LINK}">${children}</a>`,
  },
  types: {
    image: ({ value }) => {
      const url = value?.url;
      if (!url) return "";
      return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;"><tr><td><img src="${url}" alt="${value.alt || ""}" width="512" style="display:block;width:100%;max-width:512px;height:auto;border:1px solid rgba(27,26,23,0.18);"></td></tr></table>`;
    },
    codeBlock: ({ value }) =>
      `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;"><tr><td style="padding:14px 16px;background-color:${INK};"><pre style="margin:0;font-family:${MONO};font-size:12.5px;line-height:1.6;color:#e8e5df;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value?.code || "")}</pre></td></tr></table>`,
  },
};

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Portable Text -> email-safe HTML. */
export function renderIssueBody(issue) {
  const body = issue?.body;
  if (!Array.isArray(body) || body.length === 0) return "";
  return toHTML(body, { components: ptComponents });
}

/** Plain-text fallback. Deliverability likes a real text/plain part. */
export function renderIssueText(issue, { unsubUrl = "", browserUrl = "" } = {}) {
  const lines = ["AIWAR.DEV", issue?.subject || "", ""];
  for (const block of issue?.body || []) {
    if (block._type !== "block") continue;
    const text = (block.children || []).map((c) => c.text || "").join("");
    if (text.trim()) lines.push(text, "");
  }
  if (browserUrl) lines.push(`Read online: ${browserUrl}`);
  if (unsubUrl) lines.push(`Unsubscribe: ${unsubUrl}`);
  return lines.join("\n");
}
