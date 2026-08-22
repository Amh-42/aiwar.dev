import Link from 'next/link';
import SubscribeForm from './SubscribeForm';
import {
  NEWSLETTER_LINKS,
  SHIPPED,
  SOCIALS,
  VENTURES,
  WRITING_LINKS,
} from '../../lib/site';

function Column({ title, links, children }) {
  return (
    <div className="fcol">
      <h3 className="fcol-h">{title}</h3>
      {links ? (
        <ul className="fcol-list">
          {links.map((l) => (
            <li key={l.href + l.label}>
              <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {l.label}
              </a>
              {l.note ? <span className="fcol-note">{l.note}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {children}
    </div>
  );
}

/**
 * The wall's bottom edge — everything pinned there at once. Topics are passed
 * in from the page so the footer always lists the topics that actually have
 * posts behind them.
 */
export default function Footer({ topics = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="tear" aria-hidden="true" />

      <div className="wrap">
        <div className="foot-lead">
          <div>
            <p className="eyebrow">before you go</p>
            <h2 className="h-hand">One email a week, and it&apos;s the useful one</h2>
            <p className="note-text" style={{ maxWidth: '46ch' }}>
              What I&apos;m using, what I&apos;ve worked out, what&apos;s worth your time. Nothing I
              haven&apos;t run myself.
            </p>
          </div>
          <div className="foot-sub">
            <SubscribeForm source="footer" cta="Join" />
          </div>
        </div>

        <div className="fgrid">
          <Column title="The newsletter" links={NEWSLETTER_LINKS} />
          <Column
            title="Writing"
            links={[
              ...WRITING_LINKS,
              ...topics.slice(0, 8).map((t) => ({
                label: t.title,
                href: `/blog?topic=${t.slug}`,
                note: `${t.count} post${t.count === 1 ? '' : 's'}`,
              })),
            ]}
          />
          <Column title="Building now" links={VENTURES} />
          <Column title="Also shipped" links={SHIPPED} />
          <Column title="Elsewhere" links={SOCIALS} />
          <Column title="This site">
            <ul className="fcol-list">
              <li>
                <Link href="/">Home</Link>
                <span className="fcol-note">the whole board</span>
              </li>
              <li>
                <Link href="/#ventures">Four things at once</Link>
                <span className="fcol-note">two jobs, two of my own</span>
              </li>
              <li>
                <Link href="/#side">And the rest of it</Link>
                <span className="fcol-note">smaller, shipped</span>
              </li>
              <li>
                <a href="/sitemap.xml">Sitemap</a>
                <span className="fcol-note">every page</span>
              </li>
            </ul>
            <p className="fcol-colophon">
              Next.js and Sanity, mail through Resend, deployed on Vercel. Same stack as fact.et and
              forbes.et, because a stack you already debug at 2am is the right stack.
            </p>
          </Column>
        </div>

        <div className="foot-base">
          <p className="sig">— Anwar</p>
          <p className="colophon">
            aiwar.dev · built on a wall of sticky notes · Addis Ababa · © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
