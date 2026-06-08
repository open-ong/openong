'use client';

import { useEffect } from 'react';
import { PH, capture, register } from '@/lib/posthog/events';

const sent = new Set<string>();

/**
 * Registers tenant context (org + campaign) as super properties so every
 * downstream event carries it, and fires one deduped pageview per tab.
 */
export function TrackLanding({
  org,
  campaign
}: {
  org: string;
  campaign?: string;
}) {
  useEffect(() => {
    register({ org, campaign: campaign ?? null });
    const key = `${org}/${campaign ?? ''}`;
    if (sent.has(key)) return;
    sent.add(key);
    capture(PH.pageview, { org, campaign: campaign ?? null });
  }, [org, campaign]);

  return null;
}
