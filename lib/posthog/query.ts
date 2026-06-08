import 'server-only';

const API_HOST = process.env.POSTHOG_API_HOST || 'https://us.posthog.com';
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const PERSONAL_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

export function posthogConfigured(): boolean {
  return Boolean(PROJECT_ID && PERSONAL_KEY);
}

/**
 * Runs a HogQL query against the PostHog query API and maps the columnar
 * result into row objects keyed by the returned column names. Returns an empty
 * array if PostHog isn't configured or the request fails — analytics must never
 * break the dashboard.
 */
export async function hogql<T = Record<string, unknown>>(
  query: string,
  values?: Record<string, unknown>
): Promise<T[]> {
  if (!PROJECT_ID || !PERSONAL_KEY) return [];
  try {
    const res = await fetch(`${API_HOST}/api/projects/${PROJECT_ID}/query/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PERSONAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          kind: 'HogQLQuery',
          query,
          values: values ?? {},
          modifiers: { convertToProjectTimezone: false }
        },
        refresh: 'force_blocking'
      }),
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: unknown[][];
      columns?: string[];
    };
    const columns = data.columns ?? [];
    return (data.results ?? []).map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((c, i) => {
        obj[c] = row[i];
      });
      return obj as T;
    });
  } catch {
    return [];
  }
}
