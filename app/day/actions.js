'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DAY_COOKIE, keyDigest, matchesKey } from '../../lib/dayAuth';

export async function unlock(formData) {
  const attempt = String(formData.get('key') || '');
  if (!matchesKey(attempt)) redirect('/day?bad=1');

  const jar = await cookies();
  jar.set(DAY_COOKIE, keyDigest().toString('hex'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/day',
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect('/day');
}

export async function lock() {
  const jar = await cookies();
  jar.delete({ name: DAY_COOKIE, path: '/day' });
  redirect('/day');
}
