/**
 * Onboarding session store.
 *
 * Uses Upstash Redis when `KV_REST_API_URL` / `KV_REST_API_TOKEN` are set
 * (same convention as the rest of the app), and falls back to an in-memory
 * Map otherwise so the feature works in a zero-config local/demo environment.
 *
 * TODO(prod): the in-memory fallback is per-process and non-durable. For
 * production always configure Upstash Redis (or another shared store).
 */

import { Redis } from '@upstash/redis';
import type { OnboardingSession } from './types';

const KEY_PREFIX = 'onboarding:session:';

const hasRedis = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

const redis = hasRedis
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN
    })
  : null;

/**
 * Process-local fallback store. Not durable — demo/local only.
 *
 * Anchored on `globalThis` because Next.js isolates module instances per
 * route in dev, so a plain module-level Map would NOT be shared between the
 * create/get/message route handlers. globalThis is shared across them within
 * the same Node process.
 */
const globalForStore = globalThis as unknown as {
  __onboardingMemoryStore?: Map<string, OnboardingSession>;
};
const memoryStore =
  globalForStore.__onboardingMemoryStore ??
  (globalForStore.__onboardingMemoryStore = new Map<
    string,
    OnboardingSession
  >());

export function isUsingDurableStore(): boolean {
  return hasRedis;
}

export async function getSession(
  sessionId: string
): Promise<OnboardingSession | null> {
  if (redis) {
    try {
      return (
        (await redis.get<OnboardingSession>(KEY_PREFIX + sessionId)) ?? null
      );
    } catch {
      return memoryStore.get(sessionId) ?? null;
    }
  }
  return memoryStore.get(sessionId) ?? null;
}

export async function saveSession(session: OnboardingSession): Promise<void> {
  session.updatedAt = new Date().toISOString();
  if (redis) {
    try {
      // 30-day TTL so abandoned sessions self-clean.
      await redis.set(KEY_PREFIX + session.id, session, {
        ex: 60 * 60 * 24 * 30
      });
      return;
    } catch {
      memoryStore.set(session.id, session);
      return;
    }
  }
  memoryStore.set(session.id, session);
}

export async function deleteSession(sessionId: string): Promise<void> {
  if (redis) {
    try {
      await redis.del(KEY_PREFIX + sessionId);
      return;
    } catch {
      memoryStore.delete(sessionId);
      return;
    }
  }
  memoryStore.delete(sessionId);
}
