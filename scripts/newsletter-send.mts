/**
 * Sends an issue to the list and stamps it `sent` in Sanity.
 *
 *   npm run newsletter:send -- --dry            # count recipients, send nothing
 *   npm run newsletter:send -- --to me@x.com    # one test recipient
 *   npm run newsletter:send -- --id <sanity-id> # a specific issue
 *   npm run newsletter:send                     # the latest draft, for real
 */
import { randomUUID } from "node:crypto";
import { getIssueById, getLatestDraftIssue } from "../lib/newsletter";
import { sendIssue } from "../lib/resend";
import { countSubscribed } from "../lib/subscribers";
import { writeClient } from "../lib/sanity/writeClient";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main() {
  const dryRun = process.argv.includes("--dry");
  const testTo = arg("--to");
  const id = arg("--id");

  const issue = id ? await getIssueById(id) : await getLatestDraftIssue();
  if (!issue) {
    console.error("No issue found. Create one in the Studio and leave it as a draft.");
    process.exit(1);
  }

  console.log(`Issue #${issue.number}: ${issue.subject}`);
  console.log(`  ${issue.tools?.length ?? 0} tools · deep cut: ${issue.deepCut?.name || "—"} · skip: ${issue.skip?.name || "—"}`);

  const recipients = testTo ? [{ email: testTo, token: randomUUID() }] : undefined;
  if (testTo) console.log(`  TEST SEND → ${testTo}`);
  else console.log(`  list size: ${await countSubscribed()}`);

  const res = await sendIssue(issue, { recipients, dryRun });
  console.log(res);

  if (!res.ok) process.exit(1);
  if (dryRun || testTo) return;

  await writeClient
    .patch(issue._id)
    .set({ status: "sent", sentAt: new Date().toISOString(), recipientCount: res.sent })
    .commit();
  console.log(`✓ marked issue #${issue.number} as sent`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
