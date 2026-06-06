import { NextResponse } from 'next/server';
import { verifyServiceToken } from '@/lib/onboarding/auth';
import {
  getOnboardingState,
  markOnboardingComplete,
  saveOnboardingAnswer,
  updateOnboardingProfile
} from '@/lib/onboarding/voice-tools';

/**
 * POST /api/onboarding/voice/tool  (Bearer ONBOARDING_AGENT_SERVICE_TOKEN)
 *
 * Unified dispatcher for ElevenLabs when configured as a single webhook tool.
 * Body: { tool: string; args: { ... } }
 *
 * Supported tools:
 *   - get_onboarding_state     { sessionId }
 *   - save_onboarding_answer   { sessionId, questionKey, answer, confidence? }
 *   - update_onboarding_profile{ sessionId, patch }
 *   - mark_onboarding_complete { sessionId, force? }
 */
export async function POST(request: Request) {
  const auth = verifyServiceToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { tool?: string; args?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const tool = body.tool;
  const args = (body.args ?? {}) as Record<string, unknown>;
  const sessionId = String(args.sessionId ?? '');

  if (!tool) {
    return NextResponse.json({ error: 'Missing tool' }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing args.sessionId' }, { status: 400 });
  }

  let result;
  switch (tool) {
    case 'get_onboarding_state':
      result = await getOnboardingState(sessionId);
      break;
    case 'save_onboarding_answer':
      result = await saveOnboardingAnswer({
        sessionId,
        questionKey: String(args.questionKey ?? ''),
        answer: String(args.answer ?? ''),
        confidence: args.confidence as string | undefined
      });
      break;
    case 'update_onboarding_profile':
      result = await updateOnboardingProfile({
        sessionId,
        patch: (args.patch ?? {}) as never
      });
      break;
    case 'mark_onboarding_complete':
      result = await markOnboardingComplete({
        sessionId,
        force: Boolean(args.force)
      });
      break;
    default:
      return NextResponse.json(
        { error: `Unknown tool: ${tool}` },
        { status: 400 }
      );
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
