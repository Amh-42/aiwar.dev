'use client';

import { useEffect } from 'react';

/**
 * Adds .in to every .rise element as it enters the viewport.
 * One observer, no library, no re-renders.
 */
export default function Reveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.rise');

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
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
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
