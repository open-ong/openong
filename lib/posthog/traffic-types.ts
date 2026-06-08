export const TRAFFIC_RANGES = [7, 14, 30, 90] as const;
export type TrafficRange = (typeof TRAFFIC_RANGES)[number];

export type TrafficPoint = { date: string; visits: number };

export type TrafficStats = {
  days: number;
  series: TrafficPoint[];
  totalVisits: number;
  uniques: number;
  purchases: number;
  conversion: number;
};

export function normalizeRange(value: unknown): TrafficRange {
  const n = Number(value);
  return (TRAFFIC_RANGES as readonly number[]).includes(n)
    ? (n as TrafficRange)
    : 14;
}
