// The Ideal Day — the fixed shape of one day, Maghrib to Maghrib.
// Mirrors the printed A5 sheet ($P/Personal/Docs/ideal-day-a5.pdf), with the
// prayer anchors computed for Addis Ababa each day and the blocks moved with
// them, exactly as the sheet's footnote says to. Pure data + pure time maths.

import { ADDIS, METHOD, prayerMinutes } from './prayerTimes.js';

export const PLACE = ADDIS;
export const PRAYER_METHOD = METHOD;

export const RULES = [
  { b: 'The hour after Asr is the publish hour.', t: 'It is never traded, never moved, and never filled with tooling. August failed on this one line.' },
  { b: 'Messages happen once, in the OTHERS block.', t: 'Not in a deep block. Not before Dhuhr. Once.' },
  { b: 'No CLOSE & SET, no day.', t: 'Unlogged work is invisible to every audit after it.' },
];

export const FOOT = [
  { b: 'The day turns at Maghrib', t: '— the day you log at CLOSE & SET is the one that ended at sunset.' },
  { b: 'Friday:', t: "Jumu'ah replaces Dhuhr; deep 2 runs from after it to Asr, the pre-Asr Chapa slot drops." },
  { b: 'Prayer times', t: `are computed from the sun for ${ADDIS.name} (${METHOD.label}) — the blocks move with them.` },
];

export const pad = (n) => String(n).padStart(2, '0');
export const hhmm = (m) => `${pad(Math.floor(((m % 1440) + 1440) % 1440 / 60))}:${pad(((m % 1440) + 1440) % 1440 % 60)}`;

export function fmtDur(mins) {
  mins = Math.round(mins);
  if (mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/**
 * Wall clock in Addis Ababa (UTC+3, no DST) for any instant. Returns a Date
 * whose local getters read Addis time — so the sheet runs on Addis wherever
 * it is opened.
 */
export function toAddis(date) {
  return new Date(date.getTime() + (ADDIS.tz * 60 + date.getTimezoneOffset()) * 60000);
}

const B = (s, mins, kind, icon, title, note, extra = {}) => ({ s: ((s % 1440) + 1440) % 1440, mins: Math.max(0, Math.round(mins)), kind, icon, title, note, t: hhmm(s), ...extra });

/**
 * Build the day's blocks from the five anchors (minutes of day) — the
 * printed sheet's shape, with every prayer-anchored block moved to the real
 * prayer time and the neighbouring blocks stretched or trimmed to meet it.
 */
export function buildDay(p, friday) {
  const { fajr: F, dhuhr: D, asr: A, maghrib: M, isha: I } = p;
  const span = (from, to) => ((to - from) % 1440 + 1440) % 1440;

  const evening = [
    B(M, 20, 'pray', 'mosque', 'MAGHRIB', 'the day begins here'),
    B(M + 20, span(M + 20, I), 'rest', 'forkKnife', 'Dinner · family', 'Off-screen. All of it.'),
    B(I, 20, 'pray', 'mosque', 'ISHA'),
    B(I + 20, 60, 'work', 'bookOpen', 'DEEN · STUDY', 'Sirah, tafsir, the Muslim Brain'),
    B(I + 80, 30, 'deep', 'sealCheck', 'CLOSE & SET', "Log the day that ended · tick quests · name tomorrow's one thing"),
    B(I + 110, 40, 'rest', 'moonStars', 'Wind-down', 'No screens. Dhikr.'),
    B(I + 150, span(I + 150, F - 15), 'rest', 'bed', 'Sleep', `${fmtDur(span(I + 150, F - 15))} in bed — wake ${hhmm(F - 15)}, feet on the floor, no phone.`),
  ];

  const nine30 = 9 * 60 + 30;
  const ten = 10 * 60;
  const morning = [
    B(F, 45, 'pray', 'mosque', 'FAJR', "then Qur'an"),
    B(F + 45, 45, 'rest', 'barbell', 'Move · shower', 'The one thing was named last night.'),
    B(F + 90, span(F + 90, nine30), 'deep', 'heartPulse', 'SYNHEART', 'Deep block 1 — no messages, no tabs'),
    B(nine30, 30, 'rest', 'forkKnife', 'Breakfast', 'Away from the desk.'),
    B(ten, span(ten, D), 'work', 'creditCard', 'CHAPA', 'Reviews, PRs, the go-live queue'),
  ];

  if (friday) {
    morning.push(
      B(D, 120, 'pray', 'mosque', "JUMU'AH", 'then lunch'),
      B(D + 120, span(D + 120, A), 'deep', 'heartPulse', 'SYNHEART', 'Deep block 2 — analysis, writing')
    );
  } else {
    morning.push(
      B(D, 60, 'pray', 'mosque', 'DHUHR', 'then lunch'),
      B(D + 60, span(D + 60, A - 20), 'deep', 'heartPulse', 'SYNHEART', 'Deep block 2 — analysis, writing'),
      B(A - 20, 20, 'work', 'creditCard', 'CHAPA', 'Ship · unblock · reply')
    );
  }

  morning.push(
    B(A, 20, 'pray', 'mosque', 'ASR', 'then walk outside'),
    B(A + 20, 60, 'deep', 'videoCamera', 'ANIPRENEUR', 'THE PUBLISH HOUR — render, upload, post'),
    B(A + 80, 30, 'work', 'newspaper', 'FACT.ET', 'The daily brief. One pass, then stop.'),
    B(A + 110, span(A + 110, M), 'work', 'notebook', 'OTHERS', 'Forbes.et · newsletter · inbox · Linear'),
    B(M, 0, 'pray', 'mosque', 'MAGHRIB', '→ and the next day begins', { marker: true })
  );

  const all = [...evening, ...morning.filter((b) => !b.marker)];
  const sum = (pred) => all.filter(pred).reduce((n, b) => n + b.mins, 0);
  const budget = [
    { icon: 'heartPulse', label: 'Synheart', mins: sum((b) => b.icon === 'heartPulse') },
    { icon: 'creditCard', label: 'Chapa', mins: sum((b) => b.icon === 'creditCard') },
    { icon: 'videoCamera', label: 'Anipreneur', mins: sum((b) => b.icon === 'videoCamera') },
    { icon: 'newspaper', label: 'Fact.et', mins: sum((b) => b.icon === 'newspaper') },
    { icon: 'notebook', label: 'Others', mins: sum((b) => b.icon === 'notebook') },
    { icon: 'bookOpen', label: 'Deen', mins: sum((b) => b.icon === 'bookOpen' || b.title === 'FAJR') },
  ];

  return { evening, morning, budget, maghrib: M };
}

/**
 * The sheet for a given moment. `addis` is a Date whose local getters read
 * Addis wall-clock time (see toAddis). Anchors are computed for that civil
 * date. Returns sections, the active block (null in a gap), progress, what is
 * next, and the Maghrib-reckoned day the moment belongs to.
 */
export function shape(addis) {
  const prayers = prayerMinutes(addis.getFullYear(), addis.getMonth() + 1, addis.getDate());
  const nowMin = addis.getHours() * 60 + addis.getMinutes() + addis.getSeconds() / 60;
  const afterMaghrib = nowMin >= prayers.maghrib;

  const day = new Date(addis);
  if (afterMaghrib) day.setDate(day.getDate() + 1);
  const friday = day.getDay() === 5;

  const built = buildDay(prayers, friday);
  const M = built.maghrib;
  const rel = ((nowMin - M) % 1440 + 1440) % 1440; // minutes since Maghrib
  const relOf = (b) => ((b.s - M) % 1440 + 1440) % 1440;

  const seq = [...built.evening, ...built.morning.filter((b) => !b.marker)].map((b) => ({ ...b, from: relOf(b), to: relOf(b) + b.mins }));

  let active = null;
  let next = null;
  for (let i = 0; i < seq.length; i++) {
    const b = seq[i];
    if (rel >= b.from && rel < b.to) {
      active = b;
      next = seq[i + 1] || seq[0];
      break;
    }
    if (rel < b.from && !next) next = b;
  }
  if (!active && !next) next = seq[0];

  const progress = active && active.mins ? Math.min(1, Math.max(0, (rel - active.from) / active.mins)) : 0;
  const left = active ? Math.max(0, Math.ceil(active.to - rel)) : Math.max(0, Math.ceil(((next.from - rel) % 1440 + 1440) % 1440));

  return {
    prayers,
    evening: built.evening,
    morning: built.morning,
    budget: built.budget,
    active,
    next,
    progress,
    left,
    day,
    friday,
    isPast: (b) => !b.marker && relOf(b) + b.mins <= rel,
  };
}
