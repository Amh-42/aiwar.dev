/**
 * Writes the latest draft issue to .preview/issue.html so you can open it in a
 * browser before anyone gets it.
 *
 * Usage: npm run newsletter:preview
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { getLatestDraftIssue } from "../lib/newsletter";
import { previewIssueHtml, previewWelcomeHtml } from "../lib/resend";

async function main() {
  mkdirSync(".preview", { recursive: true });

  writeFileSync(".preview/welcome.html", previewWelcomeHtml());
  console.log("✓ .preview/welcome.html");

  const issue = await getLatestDraftIssue();
  if (!issue) {
    console.log("No draft issue in Sanity yet — welcome mail only.");
    return;
  }
  writeFileSync(".preview/issue.html", previewIssueHtml(issue));
  console.log(`✓ .preview/issue.html — issue #${issue.number}: ${issue.subject}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
