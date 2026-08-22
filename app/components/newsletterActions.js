'use server';

import { subscribe } from '../../lib/subscribers';
import { sendWelcomeEmail } from '../../lib/resend';

export async function subscribeAction(_prev, formData) {
  const email = String(formData.get('email') || '');
  const source = String(formData.get('source') || 'site');

  // Honeypot: bots fill hidden fields, humans never see them.
  if (formData.get('company')) {
    return { status: 'success', message: "You're in. Check your inbox." };
  }

  const res = await subscribe(email, source);
  if (!res.ok) return { status: 'error', message: res.error };

  if (res.status === 'already') {
    return { status: 'success', message: "You're already on the list — thanks." };
  }

  // Fire the welcome mail, but never let a send failure block the signup.
  await sendWelcomeEmail(email.trim().toLowerCase(), res.token);

  return {
    status: 'success',
    message:
      res.status === 'resubscribed'
        ? "Welcome back — you're subscribed again."
        : "You're in. Check your inbox for the welcome note.",
  };
}
