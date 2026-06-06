import { NextResponse } from 'next/server';
import { verifyServiceToken } from '@/lib/onboarding/auth';
import { saveOnboardingAnswer } from '@/lib/onboarding/voice-tools';

/**
 * POST /api/onboarding/voice/save-answer   (Bearer ONBOARDING_AGENT_SERVICE_TOKEN)
 * ElevenLabs tool: save_onboarding_answer
 * Body: { sessionId, questionKey, answer, confidence? }
 */
export async function POST(request: Request) {
  const auth = verifyServiceToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: {
    sessionId?: string;
    questionKey?: string;
    answer?: string;
    confidence?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const result = await saveOnboardingAnswer({
    sessionId: body.sessionId,
    questionKey: body.questionKey ?? '',
    answer: body.answer ?? '',
    confidence: body.confidence
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
