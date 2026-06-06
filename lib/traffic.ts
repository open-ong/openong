import { redis } from '@/lib/redis';
import { sanitizeSubdomain } from '@/lib/subdomains';

/**
 * Lightweight first-party traffic analytics, MVP.
 *
 * Storage (Redis):
 *   traffic:views:{sub}            HASH   field "{slug}|{YYYY-MM-DD}" -> page views
 *   traffic:uniq:{sub}:{YYYY-MM-DD} HLL    unique visitor ids for that day (PFADD)
 *
 * Views use HINCRBY (atomic counter). Unique visitors use a HyperLogLog so we
 * never store individual visitor ids — ~12KB per day regardless of volume.
 * Dates are bucketed in UTC so server and client never disagree.
 */

const FIELD_SEP = '|';

function dayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Date keys for the last `n` days, oldest first, including today (UTC). */
function lastNDays(n: number): string[] {
  const DAY = 86_400_000;
  const now = Date.now();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(dayKey(now - i * DAY));
  return out;
}

export type TrafficDay = {
  /** YYYY-MM-DD (UTC) */
  date: string;
  /** views per campaign slug for this day */
  views: Record<string, number>;
  /** org-level unique visitors for this day (HLL estimate) */
  uniques: number;
};

export async function recordView(input: {
  subdomain: string;
  slug: string;
  visitorId?: string;
}): Promise<void> {
  const sub = sanitizeSubdomain(input.subdomain);
  if (!sub || !input.slug) return;
  // Strip the field separator so a slug can't corrupt the hash field layout.
  const slug = input.slug.split(FIELD_SEP).join('');
  const today = dayKey(Date.now());

  const tasks: Promise<unknown>[] = [
    redis.hincrby(`traffic:views:${sub}`, `${slug}${FIELD_SEP}${today}`, 1)
  ];
  if (input.visitorId) {
    tasks.push(redis.pfadd(`traffic:uniq:${sub}:${today}`, input.visitorId));
  }
  await Promise.all(tasks);
}

export async function getTrafficSeries(
  subdomain: string,
  days = 14
): Promise<TrafficDay[]> {
  const sub = sanitizeSubdomain(subdomain);
  const dates = lastNDays(days);

  const [viewsHash, uniqCounts] = await Promise.all([
    redis.hgetall<Record<string, number | string>>(`traffic:views:${sub}`),
    Promise.all(
      dates.map((d) => redis.pfcount(`traffic:uniq:${sub}:${d}`))
    )
  ]);

  const hash = viewsHash ?? {};

  return dates.map((date, i) => {
    const views: Record<string, number> = {};
    for (const [field, count] of Object.entries(hash)) {
      const sepIndex = field.lastIndexOf(FIELD_SEP);
      if (sepIndex === -1) continue;
      const slug = field.slice(0, sepIndex);
      const fieldDate = field.slice(sepIndex + 1);
      if (fieldDate === date) {
        views[slug] = (views[slug] ?? 0) + Number(count);
      }
    }
    return { date, views, uniques: Number(uniqCounts[i] ?? 0) };
  });
}
