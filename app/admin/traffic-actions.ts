'use server';

import { requireActiveOrg } from '@/lib/org-context';
import { getTrafficStats } from '@/lib/posthog/traffic';
import { normalizeRange, type TrafficStats } from '@/lib/posthog/traffic-types';

export async function fetchTrafficStats(
  days: number,
  campaign?: string
): Promise<TrafficStats> {
  const access = await requireActiveOrg();
  return getTrafficStats(access.slug, {
    days: normalizeRange(days),
    campaign: campaign || undefined
  });
}
