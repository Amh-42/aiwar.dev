import Link from 'next/link';
import Footer from '../components/Footer';
import SiteNav from '../components/SiteNav';
import SubscribeForm from '../components/SubscribeForm';
import { formatDate } from '../../lib/browse';
import { allTopicsQuery, sentIssuesQuery } from '../../lib/queries';
import { sanityFetch } from '../../lib/sanity/fetch';

export const revalidate = 60;

export const metadata = {
  title: 'AI, Actually Useful — the aiwar.dev newsletter',
  description:
    'One email a week: five AI tools I actually used with a verdict, one deep cut with the config that made it work, and the hyped thing you can skip.',
};

export default async function NewsletterPage() {
  const [issues, topics] = await Promise.all([
    sanityFetch({ query: sentIssuesQuery, tags: ['content'] }),
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
            One email a week. Only tools I ran myself, on real work — payments code at Chapa,
            research at Synheart, a YouTube pipeline that has to render without me. If I didn&apos;t
            use it, it isn&apos;t in there.
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
          <p className="eyebrow rise">the same three things, every week</p>
          <h2 className="h-hand rise">What you get</h2>
          <div className="board board--three">
            <article className="note rise">
              <span className="pin" aria-hidden="true" />
              <h3>Five things I actually used</h3>
              <p>
                Each one gets a verdict — <b>kept</b>, <b>dropped</b>, or <b>watching</b> — and one
                line on why. A verdict is a commitment, which is what makes it worth reading.
              </p>
              <span className="meta">the bulk of it</span>
            </article>
            <article className="note note--blue rise">
              <span className="pin pin--blue" aria-hidden="true" />
              <h3>One deep cut</h3>
              <p>
                A single tool tested properly, with the config that made it work — copy-pasteable,
                not paraphrased from a README.
              </p>
              <span className="meta">the part you save</span>
            </article>
            <article className="note note--white rise">
              <span className="pin" aria-hidden="true" />
              <h3>Skip this week</h3>
              <p>
                The hyped thing that wasn&apos;t, and the specific reason. Cheaper to read my wasted
                afternoon than to spend your own.
              </p>
              <span className="meta">the trust-builder</span>
            </article>
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      <section id="why">
        <div className="wrap wrap--read">
          <p className="eyebrow rise">the honest bit</p>
          <h2 className="h-hand rise">Why weekly, and why it won&apos;t go quiet</h2>
          <p className="note-text rise">
            I already read AI news every day — there&apos;s a bot on my Telegram channel doing it for
            me, and I&apos;m already testing tools because four projects need them. The newsletter is
            a byproduct of work that happens anyway, which is the only kind of newsletter that
            survives month six.
          </p>
          <p className="note-text rise">
            Weekly, one fixed day. Not daily — daily forces filler, and filler is how these things
            die. If a week is genuinely thin, you get four things instead of five, not five things
            padded to look like a week.
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
              No issues sent yet — issue #1 goes out this Sunday.
              <em>Join above and it lands in your inbox first.</em>
            </div>
          ) : (
            <ul className="issue-list">
              {issues.map((i) => (
                <li key={i.slug}>
                  <Link href={`/newsletter/${i.slug}`}>
                    <span className="issue-no">#{i.number}</span>
                    <span className="issue-subject">{i.subject}</span>
                  </Link>
                  <span className="issue-meta">
                    {formatDate(i.issueDate)}
                    {i.toolCount ? ` · ${i.toolCount} tools` : ''}
                  </span>
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
