import Link from 'next/link';
import Reveal from './Reveal';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import SubscribeForm from './components/SubscribeForm';
import { allTopicsQuery, postsPageQuery, sentIssuesQuery } from '../lib/queries';
import { sanityFetch } from '../lib/sanity/fetch';
import { formatDate } from '../lib/browse';

export const revalidate = 60;

/* Hand-drawn arrow, reused at four angles around the hero. */
function Arrow({ d }) {
  return (
    <svg viewBox="0 0 74 46" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const VENTURES = [
  {
    tone: '',
    pin: '',
    title: 'Chapa',
    role: 'payments backend',
    body:
      'Go, mostly. Card-to-card, gift cards, and a webhook dispatcher that has to be right every single time. Money is unforgiving code. Nobody notices it working.',
    meta: 'day job · addis ababa',
  },
  {
    tone: 'note--blue',
    pin: 'pin--blue',
    title: 'Synheart',
    role: 'AI research + system design',
    body:
      'Teaching machines to read human state from a heartbeat. Half research, half wrestling sensors into telling the truth. The wrestling is most of it.',
    meta: 'the other day job',
  },
  {
    tone: 'note--white',
    pin: '',
    title: 'Anipreneur',
    role: 'faceless youtube',
    body:
      'Self-improvement ideas explained through anime characters. No face, no camera. The whole pipeline is code, which is the only reason I can run it alone.',
    meta: 'my own thing',
  },
  {
    tone: '',
    pin: 'pin--blue',
    title: 'Inlinkai',
    role: 'AI agency',
    body:
      'Support automation for B2B SaaS. Started as "I can build that", turned into an actual offer. Currently the most business-shaped of everything here.',
    meta: 'the agency',
  },
];

const SIDE = [
  { title: 'aiwar.dev', body: 'A bot that reads AI news so I do not have to, summarises it, and posts it. Named before I had a website.' },
  { title: 'fact.et / forbes.et', body: 'Two Ethiopian business publications. Editorial systems, not just a blog with a nice header.' },
  { title: 'a second brain', body: 'A wiki that documents itself. Every session writes what changed. Slightly cursed, extremely useful.' },
];

export default async function Page() {
  const [postsRes, issues, topics] = await Promise.all([
    sanityFetch({
      query: postsPageQuery,
      params: { q: null, topic: null, start: 0, end: 3 },
      tags: ['content'],
    }),
    sanityFetch({ query: sentIssuesQuery, tags: ['content'] }),
    sanityFetch({ query: allTopicsQuery, tags: ['content'] }),
  ]);

  const posts = postsRes?.posts ?? [];
  const latestIssue = issues?.[0] ?? null;

  return (
    <main>
      <Reveal />

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero-inner">
          <div className="annot annot--tl">
            <b>Payments</b>
            Go backends, webhooks, the boring reliable kind
            <Arrow d="M66 40 C 44 34, 22 26, 6 6 M6 6 L 20 10 M6 6 L 9 21" />
          </div>

          <div className="annot annot--tr">
            <b>Research</b>
            human state, heart signals, stubborn sensors
            <Arrow d="M8 40 C 30 34, 52 26, 68 6 M68 6 L 54 10 M68 6 L 65 21" />
          </div>

          <h1 className="lockup">
            <span className="lockup-l1">AI</span>
            <span className="lockup-l2">WAR</span>
            <span className="dot" aria-hidden="true" />
          </h1>

          <p className="hero-sub">
            Anwar Misbah — payments engineer, AI researcher, and the person testing whatever tool
            promises to make all of that faster.
          </p>

          <div className="annot annot--bl">
            <Arrow d="M8 6 C 26 14, 46 22, 66 40 M66 40 L 52 37 M66 40 L 62 26" />
            <b>Anime, sort of</b>
            a youtube channel with no face in it
          </div>

          <div className="annot annot--br">
            <Arrow d="M66 6 C 48 14, 28 22, 8 40 M8 40 L 22 37 M8 40 L 12 26" />
            <b>Agency</b>
            AI support that answers before I wake up
          </div>

          {/* The main event: an index card pinned dead centre under the lockup. */}
          <div className="hero-join rise in">
            <span className="pin" aria-hidden="true" />
            <span className="pin pin--r pin--blue" aria-hidden="true" />
            <p className="hero-join-kicker">The newsletter · one email a week</p>
            <h2 className="hero-join-h">AI, Actually Useful</h2>
            <p className="hero-join-p">
              Five tools I <em>actually used</em> this week, each with a verdict — kept, dropped, or
              watching. One deep cut with the config that made it work. One hyped thing to skip.
            </p>
            <SubscribeForm source="hero" cta="Send it to me" />
            <p className="hero-join-foot">
              <Link href="/newsletter">See what&apos;s in it</Link> ·{' '}
              <a href="https://t.me/aiwar_dev" target="_blank" rel="noopener noreferrer">
                or the Telegram channel
              </a>
            </p>
          </div>

          <a className="hero-scroll" href="#ventures">
            the whole board
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- VENTURES ---------------- */}
      <section id="ventures">
        <div className="wrap">
          <p className="eyebrow rise">pinned to the wall</p>
          <h2 className="h-hand rise">Four things at once</h2>
          <p className="note-text rise" style={{ maxWidth: '58ch', fontSize: '1.1rem' }}>
            Two jobs and two of my own. People keep asking how they connect. They connect more than
            they should, which is the red string.
          </p>

          <div className="board">
            {/* thread between the cards */}
            <svg className="thread-layer" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M125 42 C 300 130, 420 -10, 620 60" />
              <path d="M620 60 C 760 120, 830 20, 875 46" />
            </svg>

            {VENTURES.map((v) => (
              <article className={`note rise ${v.tone}`} key={v.title}>
                <span className={`pin ${v.pin}`} aria-hidden="true" />
                <h3>{v.title}</h3>
                <p>{v.body}</p>
                <span className="meta">{v.role} — {v.meta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- WRITING ---------------- */}
      <section id="writing">
        <div className="wrap">
          <p className="eyebrow rise">longer than a telegram post</p>
          <h2 className="h-hand rise">Writing</h2>
          <p className="note-text rise" style={{ maxWidth: '56ch', fontSize: '1.1rem' }}>
            Written after the work, not instead of it.{' '}
            <Link href="/blog">All posts →</Link>
          </p>

          {latestIssue ? (
            <p className="now-latest rise">
              Latest issue —{' '}
              <Link href={`/newsletter/${latestIssue.slug}`}>
                #{latestIssue.number}: {latestIssue.subject}
              </Link>{' '}
              <span>{formatDate(latestIssue.issueDate)}</span>
            </p>
          ) : null}

          {posts.length === 0 ? (
            <div className="ph rise">
              The first post is being written.
              <em>Posts are authored in the Studio and appear here on publish.</em>
            </div>
          ) : (
            <div className="cards">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- SIDE PROJECTS ---------------- */}
      <section id="side">
        <div className="wrap">
          <p className="eyebrow rise">taped up next to it</p>
          <h2 className="h-hand rise">And the rest of it</h2>
          <p className="note-text rise" style={{ maxWidth: '56ch', fontSize: '1.1rem' }}>
            Smaller things. Some earn money, some earned a lesson, all of them shipped.
          </p>

          <div className="cards">
            {SIDE.map((s) => (
              <article className="card rise" key={s.title}>
                <span className="tape" aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- CHANNEL ---------------- */}
      <section id="channel">
        <div className="wrap">
          <div className="channel rise">
            <span className="pin pin--l" aria-hidden="true" />
            <span className="pin pin--r pin--blue" aria-hidden="true" />
            <h2>Saved Messages, out loud</h2>
            <p>
              I spent years sending every half-thought to Saved Messages. Thousands of messages,
              zero replies, very healthy. Now they go on a Telegram channel instead, four or five
              times a day, mostly about whatever broke that morning. The newsletter is the weekly
              edit of it — the part that survived the week.
            </p>
            <a className="btn" href="https://t.me/aiwar_dev" target="_blank" rel="noopener noreferrer">
              Read @aiwar_dev
            </a>
          </div>
        </div>
      </section>

      <Footer topics={topics} />
    </main>
  );
}
