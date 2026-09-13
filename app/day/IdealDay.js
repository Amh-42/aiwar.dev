'use client';

import { useEffect, useState } from 'react';
import { ICONS } from '../../lib/idealDayIcons';
import { BUDGET, FOOT, RULES, fmtDur, fmtEnd, shape } from '../../lib/idealDay';

function Icon({ name, className }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function fmtClock(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Row({ b, active, past, progress, left, now }) {
  const cls = ['r', b.kind, active ? 'is-now' : '', past ? 'is-past' : '', b.marker ? 'is-marker' : ''].join(' ');
  return (
    <div className={cls} aria-current={active ? 'time' : undefined}>
      {active ? (
        <span className="track" aria-hidden="true">
          <span className="bar" style={{ width: `${progress * 100}%` }} />
          <span className={`cursor ${progress > 0.7 ? 'flip' : ''}`} style={{ left: `${progress * 100}%` }}>
            <i>{now}</i>
          </span>
        </span>
      ) : null}
      <div className="t">{b.t}</div>
      <div className="i">
        <Icon name={b.icon} />
      </div>
      <div className="b">
        <b>{b.title}</b>
        {b.note ? <em>{b.note}</em> : null}
      </div>
      <div className="d">{active ? `${fmtDur(left)} left` : b.marker ? '' : fmtDur(b.mins)}</div>
    </div>
  );
}

/**
 * The sheet. Server-rendered as the printed A5 (static, no time), then the
 * client takes over and lays the "now" indicator on it, ticking every 15s.
 * Local device time — the day follows the person, not a fixed city.
 */
export default function IdealDay() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 15000);
    const onVis = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const s = shape(now || new Date(2000, 0, 1, 12, 0)); // placeholder shape until mounted
  const live = Boolean(now);
  const clock = live ? fmtClock(now) : '––:––';
  const a = live ? s.active : null;
  const isActive = (b) => live && a && a.t === b.t && a.title === b.title && !b.marker;
  const isPast = (b) => live && s.isPast(b);

  const dayLabel = live
    ? `${DAYS[s.day.getDay()]} · ${s.day.getDate()} ${MONTHS[s.day.getMonth()]}`
    : '';

  return (
    <div className="day-stage">
      <article className="a5" aria-label="The Ideal Day">
        <span className="pin" aria-hidden="true" />

        <p className="kicker">
          <span className="kdot" />
          The System · Operating Standard
        </p>
        <h2 className="ttl">The Ideal Day</h2>
        <p className="sub">Maghrib to Maghrib · anchored on the five prayers · 6h 30m in bed · identical every day</p>

        {/* NOW — the one thing the paper cannot do */}
        <div className={`now ${a ? a.kind : 'gap'} ${live ? '' : 'is-wait'}`} role="status" aria-live="polite">
          <div className="now-top">
            <span className="now-k">
              <span className="kdot live" />
              Now · {clock}
              {s.friday && live ? <span className="now-fri">Friday</span> : null}
            </span>
            <span className="now-day">{dayLabel}</span>
          </div>
          <div className="now-body">
            <div className="now-l">
              {live ? (
                a ? (
                  <>
                    <span className="now-t">
                      <Icon name={a.icon} className="now-i" />
                      {a.title}
                    </span>
                    {a.note ? <span className="now-n">{a.note}</span> : null}
                  </>
                ) : (
                  <>
                    <span className="now-t">Between blocks</span>
                    <span className="now-n">Feet on the floor. No phone.</span>
                  </>
                )
              ) : (
                <span className="now-t">reading the clock…</span>
              )}
            </div>
            <div className="now-r">
              {live && a ? (
                <>
                  <b>{fmtDur(s.left)}</b>
                  <span>
                    left · {a.t}–{fmtEnd(a.t, a.mins)}
                  </span>
                </>
              ) : live ? (
                <>
                  <b>{fmtDur(s.left)}</b>
                  <span>until {s.next.title}</span>
                </>
              ) : null}
              {live ? (
                <span className="now-next">
                  next · {s.next.t} {s.next.title}
                </span>
              ) : null}
            </div>
          </div>
          {live && a ? (
            <span className="now-bar" style={{ width: `${s.progress * 100}%` }} aria-hidden="true" />
          ) : null}
        </div>

        <div className="budget">
          {BUDGET.map((x) => (
            <div className="bg" key={x.label}>
              <Icon name={x.icon} />
              <span>{x.label}</span>
              <b>{x.hours}</b>
            </div>
          ))}
        </div>

        <div className="sheet">
          <div className="hd">
            <span>MAGHRIB → FAJR</span>
            <i>the day opens</i>
          </div>
          {s.evening.map((b) => (
            <Row key={b.t + b.title} b={b} active={isActive(b)} past={isPast(b)} progress={s.progress} left={s.left} now={clock} />
          ))}
          <div className="hd">
            <span>FAJR → MAGHRIB</span>
            <i>the work{s.friday && live ? " · Friday: Jumu'ah, deep 2 at 14:30" : ''}</i>
          </div>
          {s.morning.map((b) => (
            <Row key={b.t + b.title + (b.marker ? 'x' : '')} b={b} active={isActive(b)} past={isPast(b)} progress={s.progress} left={s.left} now={clock} />
          ))}
        </div>

        <div className="rules">
          {RULES.map((r) => (
            <div className="rule" key={r.b}>
              <b>{r.b}</b> {r.t}
            </div>
          ))}
        </div>

        <p className="foot">
          {FOOT.map((f, i) => (
            <span key={f.b}>
              {i ? <>&nbsp;·&nbsp;</> : null}
              <b>{f.b}</b> {f.t}
            </span>
          ))}
        </p>
      </article>
    </div>
  );
}
