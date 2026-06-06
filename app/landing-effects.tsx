'use client';

import { useEffect } from 'react';

/**
 * Client-side behaviour for the landing page, ported from the design bundle:
 * - position-based scroll reveal (robust across observers/idle tabs)
 * - animated campaign goal bar
 * - system clock in the top bar
 *
 * Renders nothing; it only wires up effects on mount.
 */
export function LandingEffects() {
  useEffect(() => {
    const items = Array.prototype.slice.call(
      document.querySelectorAll('.openong-landing .reveal')
    ) as HTMLElement[];

    function check() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = items[i];
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) {
          el.classList.add('in');
          items.splice(i, 1);
        }
      }
    }

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    document.addEventListener('visibilitychange', check);

    // Safety: never leave content hidden if transitions are paused.
    const safety = setTimeout(() => {
      items.forEach((el) => {
        el.classList.add('in');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 2600);

    // Animate the goal bar once the hero is visible.
    const gb = document.getElementById('goalbar');
    const goalTimer = gb
      ? setTimeout(() => {
          gb.style.width = '80%';
        }, 500)
      : undefined;

    // System clock.
    const clockEl = document.getElementById('clock');
    function tick() {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      if (clockEl) clockEl.textContent = `${h}:${m}`;
    }
    tick();
    const clockInterval = setInterval(tick, 10000);

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      document.removeEventListener('visibilitychange', check);
      clearTimeout(safety);
      if (goalTimer) clearTimeout(goalTimer);
      clearInterval(clockInterval);
    };
  }, []);

  return null;
}
