/**
 * Sends an issue to the list and stamps it `sent` in Sanity.
 *
 *   npm run newsletter:send -- --dry            # count recipients, send nothing
 *   npm run newsletter:send -- --to me@x.com    # one test recipient
 *   npm run newsletter:send -- --slug <slug>    # a specific issue
 *   npm run newsletter:send -- --id <sanity-id> # ...or by document id
 *   npm run newsletter:send                     # the latest draft, for real
 */
import { randomUUID } from "node:crypto";
import { getIssueById, getIssueBySlug, listIssues } from "../lib/newsletter";
import { sendIssue } from "../lib/resend";
import { countSubscribed } from "../lib/subscribers";
import { mutateClient as writeClient } from "../lib/sanity/mutate";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

async function main() {
  const dryRun = process.argv.includes("--dry");
  const testTo = arg("--to");
  const id = arg("--id");

  const slug = arg("--slug");
  const issue = id
    ? await getIssueById(id)
    : slug
      ? await getIssueBySlug(slug)
      : (await listIssues()).find((i) => i.status !== "sent") ?? null;

  if (!issue) {
    console.error("No unsent issue found. Publish one in the Studio first.");
    process.exit(1);
  }

  console.log(`${issue.subject} (${issue.slug})`);

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
  console.log(`✓ marked "${issue.subject}" as sent`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
