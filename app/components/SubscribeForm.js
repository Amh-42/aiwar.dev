'use client';

import { useActionState } from 'react';
import { subscribeAction } from './newsletterActions';

const INITIAL = { status: 'idle', message: '' };

/**
 * The signup form. Rendered three times (hero card, mid-page, footer) with a
 * different `source` so it's possible to tell later which placement — or which
 * LinkedIn giveaway — actually brought people in.
 */
export default function SubscribeForm({ source = 'site', cta = 'Send it to me', compact = false }) {
  const [state, formAction, pending] = useActionState(subscribeAction, INITIAL);

  if (state.status === 'success') {
    return (
      <p className={`sub-done${compact ? ' sub-done--compact' : ''}`} role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className={`sub${compact ? ' sub--compact' : ''}`} noValidate>
      <input type="hidden" name="source" value={source} />
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sub-hp"
      />
      <label className="sub-label" htmlFor={`email-${source}`}>
        Email
      </label>
      <div className="sub-row">
        <input
          id={`email-${source}`}
          className="sub-input"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@wherever.com"
          aria-describedby={`sub-help-${source}`}
        />
        <button className="sub-btn" type="submit" disabled={pending}>
          {pending ? 'One sec…' : cta}
        </button>
      </div>
      <p id={`sub-help-${source}`} className="sub-help">
        {state.status === 'error' ? (
          <span className="sub-err">{state.message}</span>
        ) : (
          'One email a week. Unsubscribe in one click.'
        )}
      </p>
    </form>
  );
}
