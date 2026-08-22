'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Adds .in to every .rise element as it enters the viewport.
 *
 * Two things this has to get right, both of which it previously got wrong:
 *
 * 1. A threshold above 0 is unreachable for elements taller than the viewport.
 *    intersectionRatio maxes out at (viewport height / element height), so a
 *    12,000px article in a 900px window peaks at 0.075 and never crosses a 0.08
 *    threshold — the element stays at opacity 0 forever. Long blog posts hit
 *    this every time. threshold: 0 fires on any intersection at all.
 *
 * 2. Client-side navigation renders new .rise nodes that the existing observer
 *    has never seen. Re-running on pathname change picks them up.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const items = document.querySelectorAll('.rise:not(.in)');
    if (items.length === 0) return;

    const revealAll = () => items.forEach((el) => el.classList.add('in'));

    // Respect a reduced-motion preference, and degrade safely without IO.
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );

    items.forEach((el) => io.observe(el));

    // Belt and braces: nothing on this site is important enough to stay hidden
    // because an observer misfired. Anything still dark after a beat gets shown.
    const failsafe = window.setTimeout(revealAll, 1200);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
