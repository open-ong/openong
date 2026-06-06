/**
 * Bearer-token auth for the ElevenLabs voice-agent endpoints.
 *
 * Every `/api/onboarding/voice/*` route must be called with:
 *   Authorization: Bearer <ONBOARDING_AGENT_SERVICE_TOKEN>
 *
 * The token is configured server-side and shared with the ElevenLabs agent
 * tool configuration. If the env var is not set, the voice endpoints are
 * disabled (return 503) rather than open — fail closed.
 */

export type AuthResult =
  | { ok: true }
  | { ok: false; status: 401 | 503; error: string };

export function verifyServiceToken(request: Request): AuthResult {
  const expected = process.env.ONBOARDING_AGENT_SERVICE_TOKEN;

  if (!expected) {
    return {
      ok: false,
      status: 503,
      error:
        'Voice agent endpoints are disabled: ONBOARDING_AGENT_SERVICE_TOKEN is not configured.'
    };
  }

  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token || !timingSafeEqual(token, expected)) {
    return { ok: false, status: 401, error: 'Invalid or missing bearer token.' };
  }

  return { ok: true };
}

/** Constant-time string comparison to avoid trivial timing leaks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
