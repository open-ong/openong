import { NextResponse } from 'next/server';
import { verifyServiceToken } from '@/lib/onboarding/auth';
import { markOnboardingComplete } from '@/lib/onboarding/voice-tools';

/**
 * POST /api/onboarding/voice/complete  (Bearer ONBOARDING_AGENT_SERVICE_TOKEN)
 * ElevenLabs tool: mark_onboarding_complete
 * Body: { sessionId, force? }
 */
export async function POST(request: Request) {
  const auth = verifyServiceToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { sessionId?: string; force?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const result = await markOnboardingComplete({
    sessionId: body.sessionId,
    force: body.force
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
