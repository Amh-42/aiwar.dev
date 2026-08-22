/**
 * Pushes brand-template edits back to the already-created Resend templates.
 * Usage: npm run resend:templates:update
 */
import { Resend } from "resend";
import "./env.mjs";
import { requireKey } from "./env.mjs";
import { welcomeTemplateHtml, weeklyTemplateHtml } from "../lib/email/brand.mjs";

const resend = new Resend(requireKey("RESEND_API_KEY"));

const welcomeId = process.env.RESEND_TEMPLATE_WELCOME?.trim();
const weeklyId = process.env.RESEND_TEMPLATE_WEEKLY?.trim();

if (!welcomeId && !weeklyId) {
  console.error(
    "Missing RESEND_TEMPLATE_WELCOME / RESEND_TEMPLATE_WEEKLY.\n" +
      "Run `npm run resend:templates` first, then paste the ids into .env.local."
  );
  process.exit(1);
}

async function updateAndPublish(id, html, label) {
  const updated = await resend.templates.update(id, { html });
  if (updated.error) throw new Error(`${label}: ${updated.error.message}`);
  const published = await resend.templates.publish(id);
  if (published.error) throw new Error(`${label}: ${published.error.message}`);
  console.log(`✓ ${label} updated + published`);
}

async function main() {
  if (welcomeId) await updateAndPublish(welcomeId, welcomeTemplateHtml(), "aiwar-welcome");
  if (weeklyId) await updateAndPublish(weeklyId, weeklyTemplateHtml(), "aiwar-weekly");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
