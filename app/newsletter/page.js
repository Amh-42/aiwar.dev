import Link from 'next/link';
import Footer from '../components/Footer';
import SiteNav from '../components/SiteNav';
import SubscribeForm from '../components/SubscribeForm';
import { formatDate } from '../../lib/browse';
import { allTopicsQuery, publishedIssuesQuery } from '../../lib/queries';
import { sanityFetch } from '../../lib/sanity/fetch';

export const revalidate = 60;

export const metadata = {
  title: 'The aiwar.dev newsletter — AI, Actually Useful',
  description:
    'One email a week about AI: what I am using, what I have worked out, and what is actually worth your time. Written by someone building with it daily.',
};

export default async function NewsletterPage() {
  const [issues, topics] = await Promise.all([
    sanityFetch({ query: publishedIssuesQuery, tags: ['content'] }),
    sanityFetch({ query: allTopicsQuery, tags: ['content'] }),
  ]);

  return (
    <main>
      <SiteNav current="/newsletter" />

      <section className="page-head">
        <div className="wrap wrap--read">
          <p className="eyebrow rise">the one thing I send on purpose</p>
          <h1 className="h-hand rise">AI, Actually Useful</h1>
          <p className="lede rise">
            One email a week about AI — what I&apos;m using, what I&apos;ve worked out, and what&apos;s
            actually worth your time. Written by someone building with this stuff every day, not
            summarising press releases.
          </p>

          <div className="join-card rise" id="join">
            <span className="pin" aria-hidden="true" />
            <SubscribeForm source="newsletter-page" cta="Send it to me" />
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      <section id="what">
        <div className="wrap">
          <p className="eyebrow rise">what you&apos;re signing up for</p>
          <h2 className="h-hand rise">Three promises, that&apos;s it</h2>
          <div className="board board--three">
            <article className="note rise">
              <span className="pin" aria-hidden="true" />
              <h3>Once a week</h3>
              <p>
                One email, one fixed day. Never a daily drip, never twice because something
                launched. Your inbox is not a feed.
              </p>
              <span className="meta">the cadence</span>
            </article>
            <article className="note note--blue rise">
              <span className="pin pin--blue" aria-hidden="true" />
              <h3>From actual use</h3>
              <p>
                If I haven&apos;t run it, built with it, or broken it, it doesn&apos;t go in. That&apos;s
                the whole editorial policy.
              </p>
              <span className="meta">the standard</span>
            </article>
            <article className="note note--white rise">
              <span className="pin" aria-hidden="true" />
              <h3>Plainly written</h3>
              <p>
                No hype, no thread-bait, no &quot;this changes everything&quot;. Short enough to read
                on the walk to work.
              </p>
              <span className="meta">the tone</span>
            </article>
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      <section id="why">
        <div className="wrap wrap--read">
          <p className="eyebrow rise">the honest bit</p>
          <h2 className="h-hand rise">Why it won&apos;t go quiet in a month</h2>
          <p className="note-text rise">
            I read about AI every day anyway — there&apos;s a bot on my Telegram channel doing half
            of it for me — and I&apos;m already testing tools because the work demands it. The
            newsletter is a byproduct of that, which is the only kind that survives.
          </p>
          <p className="note-text rise">
            Weekly, one fixed day. Not daily: daily forces filler, and filler is how these things
            die. Thin week, short email.
          </p>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      <section>
        <div className="wrap">
          <p className="eyebrow rise">read before you join</p>
          <h2 className="h-hand rise">Past issues</h2>
          {issues.length === 0 ? (
            <div className="ph">
              No issues yet — the first one is being written.
              <em>Join above and it lands in your inbox first.</em>
            </div>
          ) : (
            <ul className="issue-list">
              {issues.map((i) => (
                <li key={i.slug}>
                  <Link href={`/newsletter/${i.slug}`}>
                    {i.number ? <span className="issue-no">#{i.number}</span> : null}
                    <span className="issue-subject">{i.subject}</span>
                  </Link>
                  <span className="issue-meta">{formatDate(i.issueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer topics={topics} />
    </main>
  );
}
