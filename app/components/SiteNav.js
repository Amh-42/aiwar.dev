import Link from 'next/link';
import { NAV } from '../../lib/site';

// A strip of masking tape across the top. Present on every page but the home
// hero, which has the lockup instead.
export default function SiteNav({ current }) {
  return (
    <nav className="topnav" aria-label="Main">
      <Link className="topnav-mark" href="/">
        aiwar<span>.dev</span>
      </Link>
      <ul>
        {NAV.map((n) => (
          <li key={n.href}>
            <a
              href={n.href}
              aria-current={current === n.href ? 'page' : undefined}
              {...(n.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {n.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
