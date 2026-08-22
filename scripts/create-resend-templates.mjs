/**
 * Creates + publishes the aiwar.dev templates in Resend, then prints the lines
 * to paste into .env.local.
 *
 * Usage: npm run resend:templates
 */
import { Resend } from "resend";
import "./env.mjs";
import { requireKey } from "./env.mjs";
import { welcomeTemplateHtml, weeklyTemplateHtml } from "../lib/email/brand.mjs";

const resend = new Resend(requireKey("RESEND_API_KEY"));

async function createAndPublish(payload) {
  const created = await resend.templates.create(payload);
  if (created.error) throw new Error(created.error.message || String(created.error));
  const id = created.data.id;
  const published = await resend.templates.publish(id);
  if (published.error) throw new Error(published.error.message || String(published.error));
  return { id };
}

async function main() {
  console.log("Creating aiwar.dev templates in Resend…\n");

  const welcome = await createAndPublish({
    name: "aiwar-welcome",
    subject: "You're on the list — AI, Actually Useful",
    html: welcomeTemplateHtml(),
    variables: [
      {
        key: "EXTRA",
        type: "string",
        fallbackValue: "First issue lands this Sunday.",
      },
      { key: "BROWSE_URL", type: "string", fallbackValue: "https://aiwar.dev/newsletter" },
      { key: "UNSUB_URL", type: "string", fallbackValue: "https://aiwar.dev/newsletter" },
    ],
  });

  // Registered for brand parity and one-off sends. The weekly send path renders
  // locally instead — an issue body blows past Resend's ~2000-char variable cap.
  const weekly = await createAndPublish({
    name: "aiwar-weekly",
    subject: "AI, Actually Useful",
    html: weeklyTemplateHtml(),
    variables: [
      { key: "ISSUE_NO", type: "string", fallbackValue: "1" },
      { key: "ISSUE_DATE", type: "string", fallbackValue: "" },
      { key: "HEADLINE", type: "string", fallbackValue: "AI, Actually Useful" },
      { key: "PREHEADER", type: "string", fallbackValue: "Five things I actually used." },
      { key: "BODY", type: "string", fallbackValue: "" },
      { key: "BROWSER_URL", type: "string", fallbackValue: "https://aiwar.dev/newsletter" },
      { key: "UNSUB_URL", type: "string", fallbackValue: "https://aiwar.dev/newsletter" },
    ],
  });

  console.log("Done. Add these to .env.local:\n");
  console.log(`RESEND_TEMPLATE_WELCOME=${welcome.id}`);
  console.log(`RESEND_TEMPLATE_WEEKLY=${weekly.id}\n`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
