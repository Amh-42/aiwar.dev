// The Ideal Day — the fixed shape of one day, Maghrib to Maghrib.
// Mirrors the printed A5 sheet ($P/Personal/Docs/ideal-day-a5.pdf) exactly.
// Pure data + pure time maths; no React, no DOM, so it can be unit-tested.

export const DAY_START = '18:30'; // Maghrib. The day turns here.

export const BUDGET = [
  { icon: 'heartPulse', label: 'Synheart', hours: '5h' },
  { icon: 'creditCard', label: 'Chapa', hours: '2h 50m' },
  { icon: 'videoCamera', label: 'Anipreneur', hours: '1h' },
  { icon: 'newspaper', label: 'Fact.et', hours: '30m' },
  { icon: 'notebook', label: 'Others', hours: '50m' },
  { icon: 'bookOpen', label: 'Deen', hours: '1h 45m' },
];

// kind: pray | deep | work | rest. `mins` is the block length in minutes.
const EVENING = [
  { t: '18:30', mins: 20, kind: 'pray', icon: 'mosque', title: 'MAGHRIB', note: 'the day begins here' },
  { t: '18:50', mins: 55, kind: 'rest', icon: 'forkKnife', title: 'Dinner · family', note: 'Off-screen. All of it.' },
  { t: '19:45', mins: 20, kind: 'pray', icon: 'mosque', title: 'ISHA' },
  { t: '20:05', mins: 60, kind: 'work', icon: 'bookOpen', title: 'DEEN · STUDY', note: 'Sirah, tafsir, the Muslim Brain' },
  { t: '21:05', mins: 30, kind: 'deep', icon: 'sealCheck', title: 'CLOSE & SET', note: "Log the day that ended · tick quests · name tomorrow's one thing" },
  { t: '21:35', mins: 40, kind: 'rest', icon: 'moonStars', title: 'Wind-down', note: 'No screens. Dhikr.' },
  { t: '22:15', mins: 390, kind: 'rest', icon: 'bed', title: 'Sleep', note: '6h 30m in bed — wake 04:45, feet on the floor, no phone.' },
];

const MORNING = [
  { t: '05:00', mins: 45, kind: 'pray', icon: 'mosque', title: 'FAJR', note: "then Qur'an" },
  { t: '05:45', mins: 45, kind: 'rest', icon: 'barbell', title: 'Move · shower', note: 'The one thing was named last night.' },
  { t: '06:30', mins: 180, kind: 'deep', icon: 'heartPulse', title: 'SYNHEART', note: 'Deep block 1 — no messages, no tabs' },
  { t: '09:30', mins: 30, kind: 'rest', icon: 'forkKnife', title: 'Breakfast', note: 'Away from the desk.' },
  { t: '10:00', mins: 150, kind: 'work', icon: 'creditCard', title: 'CHAPA', note: 'Reviews, PRs, the go-live queue' },
  { t: '12:30', mins: 60, kind: 'pray', icon: 'mosque', title: 'DHUHR', note: 'then lunch' },
  { t: '13:30', mins: 120, kind: 'deep', icon: 'heartPulse', title: 'SYNHEART', note: 'Deep block 2 — analysis, writing' },
  { t: '15:30', mins: 20, kind: 'work', icon: 'creditCard', title: 'CHAPA', note: 'Ship · unblock · reply' },
  { t: '15:50', mins: 20, kind: 'pray', icon: 'mosque', title: 'ASR', note: 'then walk outside' },
  { t: '16:10', mins: 60, kind: 'deep', icon: 'videoCamera', title: 'ANIPRENEUR', note: 'THE PUBLISH HOUR — render, upload, post' },
  { t: '17:10', mins: 30, kind: 'work', icon: 'newspaper', title: 'FACT.ET', note: 'The daily brief. One pass, then stop.' },
  { t: '17:40', mins: 50, kind: 'work', icon: 'notebook', title: 'OTHERS', note: 'Forbes.et · newsletter · inbox · Linear' },
];

// Friday: Jumu'ah replaces 12:30, deep 2 starts 14:30, the 15:30 slot drops.
const MORNING_FRIDAY = MORNING.flatMap((b) => {
  if (b.t === '12:30') return [{ ...b, mins: 120, title: "JUMU'AH", note: 'then lunch' }];
  if (b.t === '13:30') return [{ ...b, t: '14:30', mins: 80 }];
  if (b.t === '15:30') return [];
  return [b];
});

// The closing Maghrib row. Zero length: it is the same event as the first row.
const CLOSE = { t: '18:30', mins: 0, kind: 'pray', icon: 'mosque', title: 'MAGHRIB', note: '→ and the next day begins', marker: true };

export const RULES = [
  { b: 'The 16:10 hour is the publish hour.', t: 'It is never traded, never moved, and never filled with tooling. August failed on this one line.' },
  { b: 'Messages happen once, at 17:40.', t: 'Not in a deep block. Not before Dhuhr. Once.' },
  { b: 'No 21:05 close, no day.', t: 'Unlogged work is invisible to every audit after it.' },
];

export const FOOT = [
  { b: 'The day turns at Maghrib', t: '— the day you log at 21:05 is the one that ended at sunset.' },
  { b: 'Friday:', t: "Jumu'ah replaces 12:30; deep 2 starts 14:30, the 15:30 slot drops." },
  { b: 'Prayer times', t: 'are Addis approximations — set them from your app, move the blocks with them.' },
];

export function toMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// Minutes since Maghrib, 0..1439. This is the clock the sheet actually runs on.
export function sinceMaghrib(hhmmMin) {
  return (hhmmMin - toMin(DAY_START) + 1440) % 1440;
}

export function fmtDur(mins) {
  if (mins <= 0) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function fmtEnd(startHHMM, mins) {
  const total = (toMin(startHHMM) + mins) % 1440;
  const h = String(Math.floor(total / 60)).padStart(2, '0');
  const m = String(total % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Build the sheet for a given moment.
 * `date` is a JS Date in the viewer's local time. Returns the two sections, the
 * active block (or null in a gap), progress through it, what comes next, and
 * the Maghrib-reckoned calendar day the moment belongs to.
 */
export function shape(date) {
  const nowMin = date.getHours() * 60 + date.getMinutes();
  const sec = date.getSeconds();
  const rel = sinceMaghrib(nowMin) + sec / 60;
  const afterMaghrib = nowMin >= toMin(DAY_START);

  // The Maghrib day: after sunset we are already in tomorrow's day.
  const day = new Date(date);
  if (afterMaghrib) day.setDate(day.getDate() + 1);
  const friday = day.getDay() === 5;

  const morning = friday ? MORNING_FRIDAY : MORNING;
  const all = [...EVENING, ...morning];
  const withRel = all.map((b) => ({ ...b, from: sinceMaghrib(toMin(b.t)), to: sinceMaghrib(toMin(b.t)) + b.mins }));

  let active = null;
  let next = null;
  for (let i = 0; i < withRel.length; i++) {
    const b = withRel[i];
    if (rel >= b.from && rel < b.to) {
      active = b;
      next = withRel[i + 1] || withRel[0];
      break;
    }
    if (rel < b.from && !next) next = b;
  }
  if (!active && !next) next = withRel[0];

  const progress = active ? Math.min(1, Math.max(0, (rel - active.from) / active.mins)) : 0;
  const left = active ? Math.max(0, Math.ceil(active.to - rel)) : Math.max(0, Math.ceil(((next.from - rel) + 1440) % 1440));

  return {
    evening: EVENING,
    morning: [...morning, CLOSE],
    active,
    next,
    progress,
    left,
    day,
    friday,
    isPast: (b) => !b.marker && sinceMaghrib(toMin(b.t)) + b.mins <= rel,
  };
}
