import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

// The gate on /day is one shared secret: IDEAL_DAY_KEY in the Vercel
// environment. The cookie stores a hash of it, never the key itself, so a
// leaked cookie cannot be read back into the key. Nothing in here is a server
// action on purpose — exporting the digest as an action would hand the cookie
// value to anyone who called it.

export const DAY_COOKIE = 'ideal_day';

export function digest(s) {
  return createHash('sha256').update(String(s)).digest();
}

export function keyDigest() {
  const key = process.env.IDEAL_DAY_KEY;
  return key ? digest(key) : null;
}

export function matchesKey(attempt) {
  const expected = keyDigest();
  if (!expected || !attempt) return false;
  return timingSafeEqual(digest(attempt), expected);
}

export async function isUnlocked() {
  const expected = keyDigest();
  if (!expected) return false;
  const hex = expected.toString('hex');
  const jar = await cookies();
  const got = jar.get(DAY_COOKIE)?.value || '';
  if (got.length !== hex.length) return false;
  return timingSafeEqual(Buffer.from(got, 'utf8'), Buffer.from(hex, 'utf8'));
}
