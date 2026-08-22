import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '../../components/Footer';
import SiteNav from '../../components/SiteNav';
import SubscribeForm from '../../components/SubscribeForm';
import { allTopicsQuery } from '../../../lib/queries';
import { sanityFetch } from '../../../lib/sanity/fetch';
import { getIssueBySlug, issueBodyHtml, issueLabel } from '../../../lib/newsletter';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const issue = await getIssueBySlug(slug);
  if (!issue) return {};
  return {
    title: `${issue.subject} — aiwar.dev`,
    description: issue.preheader || issue.subject,
  };
}

// Rendered from the exact HTML the email used, so "read in a browser" is a true
// copy rather than a second implementation that drifts.
export default async function IssuePage({ params }) {
  const { slug } = await params;
  const [issue, topics] = await Promise.all([
    getIssueBySlug(slug),
    sanityFetch({ query: allTopicsQuery, tags: ['content'] }),
  ]);

  if (!issue) notFound();

  return (
    <main>
      <SiteNav current="/newsletter" />

      <article className="page-head">
        <div className="wrap wrap--read">
          <p className="eyebrow rise">
            <Link href="/newsletter">← all issues</Link>
          </p>
          <h1 className="h-hand rise">{issue.subject}</h1>
          <p className="post-meta rise">{issueLabel(issue)}</p>

          <div
            className="issue-body rise"
            dangerouslySetInnerHTML={{ __html: issueBodyHtml(issue) }}
          />
        </div>
      </article>

      <div className="tear" aria-hidden="true" />

      <section>
        <div className="wrap wrap--read">
          <div className="inline-sub">
            <span className="pin" aria-hidden="true" />
            <h2>Get the next one</h2>
            <p>One email a week. Unsubscribe in one click, no hard feelings.</p>
            <SubscribeForm source="issue-archive" cta="Join" compact />
          </div>
        </div>
      </section>

      <Footer topics={topics} />
    </main>
  );
}
