import { NextResponse } from 'next/server';
import { createSession } from '@/lib/onboarding/profile';
import { saveSession } from '@/lib/onboarding/store';
import { openingTurn } from '@/lib/onboarding/agent';
import type { OnboardingMessage, OnboardingSource } from '@/lib/onboarding/types';

/**
 * POST /api/onboarding/session
 * Creates a new onboarding session and returns it with the agent's opening
 * question already seeded as the first assistant message.
 *
 * Body (optional): { subdomain?: string; source?: OnboardingSource }
 */
export async function POST(request: Request) {
  let body: { subdomain?: string; source?: OnboardingSource } = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  const session = createSession({
    id: crypto.randomUUID(),
    subdomain: body.subdomain,
    source: body.source ?? 'text_chat'
  });

  const opening = openingTurn();
  const assistantMessage: OnboardingMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: opening.message,
    questionKey: opening.questionKey,
    createdAt: new Date().toISOString()
  };
  session.messages.push(assistantMessage);
  session.currentQuestionKey = opening.questionKey;

  await saveSession(session);

  return NextResponse.json({ session }, { status: 201 });
}
