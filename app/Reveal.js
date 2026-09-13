'use client';

import { useEffect } from 'react';

/**
 * Adds .in to every .rise element as it enters the viewport.
 *
 * Things this has to get right, all of which a previous version got wrong:
 *
 * 1. A threshold above 0 is unreachable for elements taller than the viewport.
 *    intersectionRatio maxes out at (viewport height / element height), so a
 *    12,000px article in a 900px window never crosses a 0.08 threshold and stays
 *    at opacity 0 forever. threshold: 0 fires on any intersection at all.
 *
 * 2. This component lives in the layout, so its effect can commit before the
 *    page body exists. On Vercel the layout hydrates while the page segment is
 *    still streaming in; locally both land together, which hid the bug. A
 *    pathname-keyed effect does not help either — a server action that
 *    redirects back to the same path renders new .rise nodes with no pathname
 *    change. So: a MutationObserver watches the whole document for .rise nodes
 *    arriving at any time, for the life of the page.
 *
 * 3. Nothing on this site is important enough to stay hidden because an
 *    observer misfired. Any .rise still dark ~1.2s after it appeared is shown.
 */
export default function Reveal() {
  useEffect(() => {
    const reduce =
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const show = (el) => el.classList.add('in');

    const io = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              show(entry.target);
              io.unobserve(entry.target);
            });
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0 }
        );

    const timers = new Set();
    const watch = (el) => {
      if (el.classList.contains('in') || el.dataset.riseWatched) return;
      el.dataset.riseWatched = '1';
      if (!io) return show(el);
      io.observe(el);
      const t = window.setTimeout(() => {
        timers.delete(t);
        show(el);
        io.unobserve(el);
      }, 1200);
      timers.add(t);
    };

    const sweep = (root) => {
      if (!(root instanceof Element)) return;
      if (root.classList.contains('rise')) watch(root);
      root.querySelectorAll('.rise').forEach(watch);
    };

    sweep(document.body);

    const mo = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach(sweep));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
