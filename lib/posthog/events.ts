import posthog from 'posthog-js';
import { rootDomain } from '@/lib/utils';

export const PH = {
  pageview: '$pageview',
  addToCart: 'add_to_cart',
  purchase: 'purchase',
  campaignClick: 'campaign_click'
} as const;

const TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const isProd = process.env.NODE_ENV === 'production';

/** A public tenant tab runs on a subdomain of the root domain; admin runs on it. */
export function isPublicHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.host;
  return host !== rootDomain && host.endsWith(`.${rootDomain}`);
}

export function subdomainFromHost(): string | null {
  if (!isPublicHost()) return null;
  return window.location.host.slice(0, -(rootDomain.length + 1));
}

if (typeof window !== 'undefined' && TOKEN && isProd && !posthog.__loaded) {
  try {
    posthog.init(TOKEN, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: isPublicHost(),
      person_profiles: 'identified_only'
    });
    const sub = subdomainFromHost();
    if (sub) posthog.register({ org: sub });
  } catch {
    void 0;
  }
}

function ready(): boolean {
  return typeof window !== 'undefined' && Boolean(TOKEN) && posthog.__loaded;
}

export function capture(event: string, props?: Record<string, unknown>): void {
  if (!ready()) return;
  posthog.capture(event, props);
}

export function register(props: Record<string, unknown>): void {
  if (!ready()) return;
  posthog.register(props);
}

export function identifyAdmin(
  userId: string,
  props?: Record<string, unknown>
): void {
  if (!ready()) return;
  posthog.identify(userId, props);
}
