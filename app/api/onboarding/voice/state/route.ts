import { NextResponse } from 'next/server';
import { verifyServiceToken } from '@/lib/onboarding/auth';
import { getOnboardingState } from '@/lib/onboarding/voice-tools';

/**
 * POST /api/onboarding/voice/state  (Bearer ONBOARDING_AGENT_SERVICE_TOKEN)
 * ElevenLabs tool: get_onboarding_state
 * Body: { sessionId }
 */
export async function POST(request: Request) {
  const auth = verifyServiceToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const result = await getOnboardingState(body.sessionId);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
