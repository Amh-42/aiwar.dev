/**
 * Seeds starter content: topics (published, they're just taxonomy) plus blog
 * posts and newsletter issues as DRAFTS, so nothing goes live or gets mailed
 * until Anwar hits Publish in the Studio.
 *
 * Usage: npm run seed
 */
import { mutateClient as writeClient } from "../lib/sanity/mutate";

let k = 0;
const key = () => `k${++k}`;

// Small helpers so the content below reads like prose, not like Portable Text.
const p = (text: string) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const h = (text: string, style: "h2" | "h3" = "h2") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const quote = (text: string) => ({
  _type: "block",
  _key: key(),
  style: "blockquote",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const li = (text: string) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });

const TOPICS = [
  {
    _id: "topic-ai-tools",
    title: "AI tools",
    slug: "ai-tools",
    description: "Things I actually ran, and whether they stayed.",
  },
  {
    _id: "topic-engineering",
    title: "Engineering",
    slug: "engineering",
    description: "Backends, pipelines, and the unglamorous parts.",
  },
  {
    _id: "topic-working-in-public",
    title: "Working in public",
    slug: "working-in-public",
    description: "Running several things at once, and what it costs.",
  },
];

const POSTS = [
  {
    _id: "post-your-own-benchmark",
    title: "The only AI benchmark that matters is your own work",
    slug: "your-own-benchmark",
    excerpt:
      "Public leaderboards measure something real. It is rarely the thing you are about to use the tool for. A cheaper test: hand it three problems you have already solved.",
    featured: true,
    topics: ["topic-ai-tools"],
    body: [
      p(
        "Every model release arrives with a chart. The numbers are real and the evaluations are honest, and they still tell you very little about whether the thing will help you on Monday morning."
      ),
      p(
        "Benchmarks measure average performance on problems chosen because they can be measured. Your work is neither average nor chosen for measurability. That is the whole gap."
      ),
      h("A test that costs twenty minutes"),
      p(
        "Keep three tasks you have already solved. Not toy problems — real ones, out of real work, where you know exactly what good looks like because you produced it yourself."
      ),
      p(
        "When something new comes out, give it those three. You are not looking for a score. You are looking for the shape of the failure:"
      ),
      li("Does it get the structure right and the details wrong, or the other way round?"),
      li("Does it hedge where it should commit?"),
      li("Does it invent an API that does not exist, and how confidently?"),
      li("When it is wrong, is it wrong in a way you would catch in review?"),
      p(
        "That last one decides everything. A tool that fails loudly is usable. A tool that fails plausibly costs more than doing the work yourself, because now you are proofreading instead of building."
      ),
      h("Why this beats reading reviews"),
      p(
        "Most write-ups tell you how a tool performed on someone else's problem, in someone else's codebase, under someone else's standard for finished. Any of those three can flip the verdict."
      ),
      quote(
        "The question is never whether a tool is good. It is whether it is good at the specific thing you were about to do anyway."
      ),
      p(
        "Twenty minutes and three saved problems will out-predict every leaderboard you read this year."
      ),
    ],
  },
  {
    _id: "post-boring-stack",
    title: "Pick the stack you can debug at 2am",
    slug: "the-stack-you-can-debug-at-2am",
    excerpt:
      "Running several projects alone changes what a good technical decision looks like. Novelty stops being interesting and starts being a tax you pay at the worst possible moment.",
    featured: false,
    topics: ["topic-engineering", "topic-working-in-public"],
    body: [
      p(
        "When you work on one thing, you can afford curiosity. A new framework costs a week of learning and pays back over a year. The arithmetic works."
      ),
      p(
        "When you are running several things at once, the arithmetic inverts. You are not choosing what to learn. You are choosing what you will have to remember, months from now, at the exact moment something is broken and you have no context loaded."
      ),
      h("The real cost is recall, not learning"),
      p(
        "Every distinct stack is a separate mental cache you have to warm up before you can be useful. Four projects on four stacks means four cold starts, and cold starts happen precisely when you can least afford them."
      ),
      p(
        "So the same choices keep repeating across everything I run — not because they are the best available, but because a stack you have already debugged is worth more than a better one you have not."
      ),
      h("Where novelty still earns its place"),
      p(
        "This is not an argument for never learning anything. It is an argument for spending novelty where it changes the outcome rather than the experience."
      ),
      li("Something is genuinely impossible on the current stack — spend it."),
      li("The new thing removes an entire category of work, not fifteen percent of it — spend it."),
      li("You are bored — do not spend it. Boredom is a bad reason to add a cold start."),
      p(
        "The projects that survive are rarely the ones built on the most interesting foundations. They are the ones still standing because someone could fix them quickly, repeatedly, without ceremony."
      ),
    ],
  },
];

const ISSUES = [
  {
    _id: "issue-001",
    number: 1,
    subject: "Everyone is shipping agents. Almost nobody is shipping guardrails.",
    slug: "issue-01-agents-and-guardrails",
    preheader: "What I've been running this week, and the one pattern that keeps working.",
    body: [
      p(
        "Welcome to the first one. The plan is simple: one email a week about AI — what I'm using, what I've worked out, and what's genuinely worth your time. If a week is thin, you get a short email rather than a padded one."
      ),
      h("The thing I keep noticing"),
      p(
        "Every tool this month wants to be an agent. Very few of them have an answer for what happens when the agent is confidently wrong at step four of nine."
      ),
      p(
        "The setups that have actually held up for me share one property: the agent proposes, and something deterministic disposes. A test suite, a schema, a type checker, a diff you look at. Not another model grading the first model."
      ),
      quote(
        "If the only thing checking the output is the same kind of thing that produced it, you have not added a check. You have added a second opinion."
      ),
      h("What I'd actually try this week"),
      p(
        "Take one task you have already automated with a model and add a single non-negotiable gate to it — something that can only pass or fail, with no judgement involved. Watch how much your trust in the whole pipeline changes from that one addition."
      ),
      h("One thing to skip"),
      p(
        "Any tool whose demo is another tool being demoed. If the pitch never reaches a real artifact — a file, a deploy, a passing test — there is usually a reason."
      ),
      p("That's it for this week. Reply if you disagree; it comes straight to me."),
    ],
  },
  {
    _id: "issue-002",
    number: 2,
    subject: "The cheapest AI upgrade is writing down what you actually want",
    slug: "issue-02-write-down-what-you-want",
    preheader: "Most bad output is a specification problem wearing a model costume.",
    body: [
      p(
        "Short one this week. A pattern that has saved me more time than any model upgrade."
      ),
      h("The observation"),
      p(
        "When output is bad, the instinct is to reach for a better model. Most of the time the model was fine and the request was vague — it guessed at what finished meant, and guessed differently from you."
      ),
      p(
        "The fix is boring: write down the standard before asking. Not a longer prompt, a clearer one. What does done look like, what must not change, and what should it do when it is unsure."
      ),
      h("Why it works"),
      p(
        "A model cannot read the constraints living in your head, and neither can a colleague. The difference is that a colleague asks. A model fills the gap silently and moves on, which is exactly why the failure is so easy to miss."
      ),
      li("State what finished looks like, concretely."),
      li("Name the things that must not change."),
      li("Say what to do when it is unsure — ask, or stop, or flag it."),
      p(
        "Three lines, most of the time. It is the highest-leverage thing I do, and it costs nothing."
      ),
      p("See you next week."),
    ],
  },
];

async function main() {
  // NOTE: createIfNotExists inside a transaction normalises a `drafts.` id to
  // its published form, which published the seed content instead of drafting
  // it. client.create* outside a transaction keeps the prefix.
  const tx = writeClient.transaction();

  for (const t of TOPICS) {
    tx.createOrReplace({
      _id: t._id,
      _type: "topic",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
      description: t.description,
    });
  }

  await tx.commit();

  for (const post of POSTS) {
    await writeClient.createIfNotExists({
      _id: `drafts.${post._id}`,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      featured: post.featured,
      publishedAt: new Date().toISOString(),
      topics: post.topics.map(ref),
      body: post.body,
    });
  }

  for (const issue of ISSUES) {
    await writeClient.createIfNotExists({
      _id: `drafts.${issue._id}`,
      _type: "issue",
      number: issue.number,
      subject: issue.subject,
      slug: { _type: "slug", current: issue.slug },
      preheader: issue.preheader,
      issueDate: new Date().toISOString(),
      status: "draft",
      body: issue.body,
    });
  }

  console.log(`✓ ${TOPICS.length} topics published`);
  console.log(`✓ ${POSTS.length} blog posts created as drafts`);
  console.log(`✓ ${ISSUES.length} newsletter issues created as drafts`);
  console.log("\nOpen https://aiwar-dev.sanity.studio and hit Publish on whichever you want live.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
