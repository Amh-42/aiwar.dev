import { Inter } from 'next/font/google';
import SiteNav from '../components/SiteNav';
import Reveal from '../Reveal';
import IdealDay from './IdealDay';
import { lock, unlock } from './actions';
import { isUnlocked } from '../../lib/dayAuth';
import './day.css';

// The sheet's own face — the printed A5 is set in Inter, so is this.
const inter = Inter({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--f-sheet', display: 'swap' });

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'The Ideal Day — aiwar.dev',
  description: 'One day, repeated. Private.',
  robots: { index: false, follow: false, nocache: true },
};

function Gate({ bad, configured }) {
  return (
    <section className="page-head">
      <div className="wrap wrap--read">
        <p className="eyebrow rise">pinned above the desk</p>
        <h1 className="h-hand rise">The Ideal Day</h1>
        <p className="lede rise">
          One sheet, one day, repeated. This one is mine, so it is behind a key.
        </p>

        <form action={unlock} className="day-gate rise">
          <span className="pin" aria-hidden="true" />
          <label className="sub-label" htmlFor="day-key">
            Key
          </label>
          <div className="sub-row">
            <input
              id="day-key"
              className="sub-input"
              type="password"
              name="key"
              placeholder="the key"
              autoComplete="current-password"
              autoFocus
              required
            />
            <button className="sub-btn" type="submit" disabled={!configured}>
              Open
            </button>
          </div>
          {!configured ? (
            <p className="sub-help sub-err">IDEAL_DAY_KEY is not set on this deployment.</p>
          ) : bad ? (
            <p className="sub-help sub-err">Not it. Try again.</p>
          ) : (
            <p className="sub-help">Sets one cookie, for a year, on this browser only.</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default async function DayPage({ searchParams }) {
  const sp = await searchParams;
  const configured = Boolean(process.env.IDEAL_DAY_KEY);
  const open = configured && (await isUnlocked());

  return (
    <main>
      <Reveal />
      <SiteNav current="/day" />
      {open ? (
        <>
          <section className="page-head day-head">
            <div className="wrap">
              <p className="eyebrow">pinned above the desk · live</p>
              <h1 className="h-hand">The Ideal Day</h1>
              <p className="note-text day-note">
                Same sheet as the one in the closet. The blue line is now.
              </p>
            </div>
          </section>
          <div className={`wrap ${inter.variable}`}>
            <IdealDay />
            <form action={lock} className="day-lock">
              <button type="submit">take it down</button>
            </form>
          </div>
        </>
      ) : (
        <Gate bad={Boolean(sp?.bad)} configured={configured} />
      )}
    </main>
  );
}
