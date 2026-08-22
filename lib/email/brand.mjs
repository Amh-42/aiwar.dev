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
              <p style="margin:0 0 14px;font-family:${MONO};font-size:14px;line-height:1.65;color:${GRAPHITE};">One email a week. Every issue is the same three things, so you always know what you're getting:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;">
                <tr><td style="padding:12px 14px;background-color:#ffffff;border:1px solid rgba(27,26,23,0.1);border-left:3px solid ${THREAD};">
                  <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;line-height:1.55;color:${INK};"><strong>Five things I actually used</strong> &mdash; with a verdict: kept, dropped, or watching.</p>
                  <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;line-height:1.55;color:${INK};"><strong>One deep cut</strong> &mdash; a single tool tested properly, with the config that made it work.</p>
                  <p style="margin:0;font-family:${MONO};font-size:13px;line-height:1.55;color:${INK};"><strong>Skip this week</strong> &mdash; the hyped thing that wasn't.</p>
                </td></tr>
              </table>
              <p style="margin:0 0 14px;font-family:${MONO};font-size:14px;line-height:1.65;color:${GRAPHITE};">No news round-ups, no "10 AI tools that will change everything". If I didn't run it myself, it doesn't go in.</p>
              <p style="margin:0 0 22px;font-family:${MONO};font-size:14px;line-height:1.65;color:${GRAPHITE};">{{{EXTRA}}}</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 8px;">
                <tr><td style="background-color:${INK};">
                  <a href="{{{BROWSE_URL}}}" style="display:inline-block;padding:11px 20px;font-family:${MONO};font-size:13px;font-weight:700;letter-spacing:0.06em;color:#ffffff;text-decoration:none;text-transform:uppercase;">Read past issues</a>
                </td></tr>
              </table>
  `;
  return shell({ inner, preheader: "One email a week: five things I actually used, one deep cut, one skip." });
}

/** Weekly issue — the body is rendered per-issue and injected as raw HTML. */
export function weeklyTemplateHtml() {
  const inner = `
              <p style="margin:0 0 4px;font-family:${MONO};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${PENCIL};">Issue {{{ISSUE_NO}}} &nbsp;·&nbsp; {{{ISSUE_DATE}}}</p>
              <p style="margin:0 0 20px;font-family:${MONO};font-size:19px;line-height:1.35;color:${INK};font-weight:700;">{{{HEADLINE}}}</p>
{{{BODY}}}
              <p style="margin:26px 0 6px;font-family:${MONO};font-size:12px;line-height:1.55;color:${PENCIL};"><a href="{{{BROWSER_URL}}}" style="color:${PENCIL};text-decoration:underline;">Read this issue in a browser</a></p>
  `;
  return shell({ inner, preheader: "{{{PREHEADER}}}" });
}

// ---------------------------------------------------------------------------
// Issue body renderer — shared by the email send and the read-online page.
// ---------------------------------------------------------------------------

const VERDICT = {
  kept: { mark: "KEPT", color: "#1f7a3d" },
  dropped: { mark: "DROPPED", color: THREAD },
  watching: { mark: "WATCHING", color: "#8a6d1f" },
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paras(text, style) {
  return String(text ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="${style}">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function sectionHeading(label) {
  return `<p style="margin:28px 0 12px;font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${THREAD};font-weight:700;">${esc(label)}</p>`;
}

function link(url, text) {
  if (!url) return esc(text);
  return `<a href="${esc(url)}" style="color:${INK};text-decoration:none;border-bottom:1px solid rgba(27,26,23,0.32);">${esc(text)}</a>`;
}

/**
 * Turns an issue document into the HTML block that goes in {{{BODY}}}.
 * Pure string work — no React, no build step, identical output on the site.
 */
export function renderIssueBody(issue) {
  const body = [];
  const bodyStyle = `margin:0 0 13px;font-family:${MONO};font-size:14px;line-height:1.68;color:${GRAPHITE};`;

  if (issue.intro) body.push(paras(issue.intro, bodyStyle));

  const tools = issue.tools || [];
  if (tools.length) {
    body.push(sectionHeading("Five things I actually used"));
    for (const t of tools) {
      const v = VERDICT[t.verdict] || VERDICT.watching;
      body.push(`
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px;">
                <tr><td style="padding:12px 14px;background-color:#ffffff;border:1px solid rgba(27,26,23,0.1);">
                  <p style="margin:0 0 5px;font-family:${MONO};font-size:14px;line-height:1.45;color:${INK};font-weight:700;">${link(t.url, t.name || "Untitled")} <span style="font-size:10px;letter-spacing:0.14em;color:${v.color};font-weight:700;">&nbsp;${v.mark}</span></p>
                  <p style="margin:0 0 ${t.note ? "6px" : "0"};font-family:${MONO};font-size:13px;line-height:1.55;color:${GRAPHITE};">${esc(t.whatFor || "")}</p>
                  ${t.note ? `<p style="margin:0;font-family:${MONO};font-size:13px;line-height:1.55;color:${PENCIL};">${esc(t.note)}</p>` : ""}
                </td></tr>
              </table>`);
    }
  }

  const dc = issue.deepCut;
  if (dc?.name) {
    body.push(sectionHeading("One deep cut"));
    body.push(
      `<p style="margin:0 0 10px;font-family:${MONO};font-size:15px;line-height:1.4;color:${INK};font-weight:700;">${link(dc.url, dc.name)}</p>`
    );
    if (dc.body) body.push(paras(dc.body, bodyStyle));
    if (dc.code) {
      body.push(`
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 14px;">
                <tr><td style="padding:14px 16px;background-color:${INK};">
                  <pre style="margin:0;font-family:${MONO};font-size:12.5px;line-height:1.6;color:#e8e5df;white-space:pre-wrap;word-break:break-word;">${esc(dc.code)}</pre>
                </td></tr>
              </table>`);
    }
  }

  const skip = issue.skip;
  if (skip?.name) {
    body.push(sectionHeading("Skip this week"));
    body.push(`
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 6px;">
                <tr><td style="padding:12px 14px;background-color:#ffffff;border:1px solid rgba(27,26,23,0.1);border-left:3px solid ${THREAD};">
                  <p style="margin:0 0 5px;font-family:${MONO};font-size:14px;line-height:1.45;color:${INK};font-weight:700;">${link(skip.url, skip.name)}</p>
                  <p style="margin:0;font-family:${MONO};font-size:13px;line-height:1.6;color:${GRAPHITE};">${esc(skip.why || "")}</p>
                </td></tr>
              </table>`);
  }

  return body.join("\n");
}

/** Plain-text fallback. Deliverability likes a real text/plain part. */
export function renderIssueText(issue, { unsubUrl = "", browserUrl = "" } = {}) {
  const lines = [`AIWAR.DEV — AI, Actually Useful`, `Issue ${issue.number ?? ""}`, ""];
  if (issue.intro) lines.push(issue.intro, "");
  for (const t of issue.tools || []) {
    lines.push(`* ${t.name} [${(t.verdict || "watching").toUpperCase()}] — ${t.whatFor}`);
    if (t.note) lines.push(`  ${t.note}`);
    if (t.url) lines.push(`  ${t.url}`);
  }
  if (issue.deepCut?.name) {
    lines.push("", `ONE DEEP CUT: ${issue.deepCut.name}`, issue.deepCut.body || "");
    if (issue.deepCut.code) lines.push("", issue.deepCut.code);
  }
  if (issue.skip?.name) {
    lines.push("", `SKIP THIS WEEK: ${issue.skip.name}`, issue.skip.why || "");
  }
  lines.push("", browserUrl ? `Read online: ${browserUrl}` : "", unsubUrl ? `Unsubscribe: ${unsubUrl}` : "");
  return lines.filter((l) => l !== undefined).join("\n");
}
