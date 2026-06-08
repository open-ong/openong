import 'server-only';
import { hogql, posthogConfigured } from './query';
import { normalizeRange, type TrafficStats } from './traffic-types';

const DAY = 86_400_000;

function lastNDates(days: number): string[] {
  const now = Date.now();
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(now - i * DAY).toISOString().slice(0, 10));
  }
  return out;
}

/**
 * Traffic stats for an org over the last `days`, read from PostHog via HogQL.
 * `org` is matched against the `org` event property set on public pages.
 */
export async function getTrafficStats(
  org: string,
  opts: { days: number; campaign?: string }
): Promise<TrafficStats> {
  const days = normalizeRange(opts.days);
  const dates = lastNDates(days);
  const empty: TrafficStats = {
    days,
    series: dates.map((date) => ({ date, visits: 0 })),
    totalVisits: 0,
    uniques: 0,
    purchases: 0,
    conversion: 0
  };
  if (!posthogConfigured() || !org) return empty;

  const campaignFilter = opts.campaign
    ? 'AND properties.campaign = {campaign}'
    : '';
  const values = { org, campaign: opts.campaign ?? '' };
  const since = `now() - INTERVAL ${days} DAY`;

  const [seriesRows, uniqRows, purchaseRows] = await Promise.all([
    hogql<{ d: string; c: number }>(
      `SELECT toString(toDate(timestamp)) AS d, count() AS c
       FROM events
       WHERE event = '$pageview' AND properties.org = {org}
         AND timestamp >= ${since} ${campaignFilter}
       GROUP BY d ORDER BY d`,
      values
    ),
    hogql<{ c: number }>(
      `SELECT count(DISTINCT person_id) AS c
       FROM events
       WHERE event = '$pageview' AND properties.org = {org}
         AND timestamp >= ${since} ${campaignFilter}`,
      values
    ),
    hogql<{ c: number }>(
      `SELECT count() AS c
       FROM events
       WHERE event = 'purchase' AND properties.org = {org}
         AND timestamp >= ${since} ${campaignFilter}`,
      values
    )
  ]);

  const byDate = new Map(seriesRows.map((r) => [r.d, Number(r.c)]));
  const series = dates.map((date) => ({
    date,
    visits: byDate.get(date) ?? 0
  }));
  const totalVisits = series.reduce((a, p) => a + p.visits, 0);
  const uniques = Number(uniqRows[0]?.c ?? 0);
  const purchases = Number(purchaseRows[0]?.c ?? 0);
  const conversion = totalVisits > 0 ? (purchases / totalVisits) * 100 : 0;

  return { days, series, totalVisits, uniques, purchases, conversion };
}
