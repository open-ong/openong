'use client';

import { useEffect } from 'react';

/**
 * Fires a single page-view beacon when a public campaign site loads.
 *
 * The module-level Set dedupes within a tab session (React StrictMode double
 * mount, client-side remounts) while a real full reload still counts as a new
 * view — which is the correct analytics behaviour.
 */
const sent = new Set<string>();

export function TrackView({
  subdomain,
  slug
}: {
  subdomain: string;
  slug: string;
}) {
  useEffect(() => {
    const key = `${subdomain}/${slug}`;
    if (sent.has(key)) return;
    sent.add(key);

    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subdomain, slug }),
      keepalive: true
    }).catch(() => {
      // best-effort; ignore network errors
    });
  }, [subdomain, slug]);

  return null;
}
