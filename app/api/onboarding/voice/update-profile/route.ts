import { NextResponse } from 'next/server';
import { verifyServiceToken } from '@/lib/onboarding/auth';
import { updateOnboardingProfile } from '@/lib/onboarding/voice-tools';

/**
 * POST /api/onboarding/voice/update-profile  (Bearer ONBOARDING_AGENT_SERVICE_TOKEN)
 * ElevenLabs tool: update_onboarding_profile
 * Body: { sessionId, patch: Partial<NgoOnboardingProfile> }
 */
export async function POST(request: Request) {
  const auth = verifyServiceToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { sessionId?: string; patch?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const result = await updateOnboardingProfile({
    sessionId: body.sessionId,
    patch: (body.patch ?? {}) as never
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
