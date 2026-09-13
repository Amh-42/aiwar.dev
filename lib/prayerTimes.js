// Prayer times from the sun, no network. The standard PrayTimes.org method,
// reduced to what the sheet needs: Fajr, Dhuhr, Asr, Maghrib, Isha for one
// civil date at one place.
//
// Addis Ababa, Muslim World League angles (Fajr 18°, Isha 17°), Shafi'i Asr.
// These reproduce the sheet's printed approximations (05:00 · 12:30 · 15:50 ·
// 18:30 · 19:45) to within a few minutes across the year.

export const ADDIS = { lat: 9.0108, lng: 38.7613, tz: 3, name: 'Addis Ababa' };
export const METHOD = { fajr: 18, isha: 17, asrFactor: 1, label: 'MWL 18°/17° · Shafi‘i Asr' };

const d2r = (d) => (d * Math.PI) / 180;
const r2d = (r) => (r * 180) / Math.PI;
const sin = (d) => Math.sin(d2r(d));
const cos = (d) => Math.cos(d2r(d));
const tan = (d) => Math.tan(d2r(d));
const asin = (x) => r2d(Math.asin(x));
const acos = (x) => r2d(Math.acos(Math.min(1, Math.max(-1, x))));
const atan2 = (y, x) => r2d(Math.atan2(y, x));
const acot = (x) => r2d(Math.atan(1 / x));
const fix = (a, m) => { a -= m * Math.floor(a / m); return a < 0 ? a + m : a; };
const fixAngle = (a) => fix(a, 360);
const fixHour = (a) => fix(a, 24);

function julian(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = atan2(cos(e) * sin(L), cos(L)) / 15;
  return { declination: asin(sin(e) * sin(L)), equation: q / 15 - fixHour(RA) };
}

/**
 * Five times in decimal hours of local (tz) wall-clock for the civil date.
 * `place` = { lat, lng, tz }.
 */
export function prayerTimes(year, month, day, place = ADDIS, method = METHOD) {
  const { lat, lng, tz } = place;
  const jd = julian(year, month, day) - lng / (15 * 24);

  const midDay = (t) => fixHour(12 - sunPosition(jd + t).equation);
  const sunAngleTime = (angle, t, dir) => {
    const decl = sunPosition(jd + t).declination;
    const noon = midDay(t);
    const x = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
    return noon + (dir < 0 ? -1 : 1) * (acos(x) / 15);
  };
  const asrTime = (factor, t) => {
    const decl = sunPosition(jd + t).declination;
    const angle = -acot(factor + tan(Math.abs(lat - decl)));
    return sunAngleTime(angle, t, 1);
  };

  // Two passes: first with default portions of the day, then refined.
  let t = { fajr: 5 / 24, dhuhr: 12 / 24, asr: 13 / 24, maghrib: 18 / 24, isha: 18 / 24 };
  for (let i = 0; i < 2; i++) {
    t = {
      fajr: sunAngleTime(method.fajr, t.fajr, -1),
      dhuhr: midDay(t.dhuhr),
      asr: asrTime(method.asrFactor, t.asr),
      maghrib: sunAngleTime(0.833, t.maghrib, 1),
      isha: sunAngleTime(method.isha, t.isha, 1),
    };
    t = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v / 24]));
  }

  const out = {};
  for (const [k, v] of Object.entries(t)) out[k] = fixHour(v * 24 + tz - lng / 15);
  return out;
}

/** Same, rounded to whole minutes-of-day (0..1439). */
export function prayerMinutes(year, month, day, place = ADDIS, method = METHOD) {
  const t = prayerTimes(year, month, day, place, method);
  const m = {};
  for (const k of Object.keys(t)) m[k] = Math.round(t[k] * 60) % 1440;
  return m;
}
