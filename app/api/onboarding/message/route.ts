import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/onboarding/store';
import { runAgentTurn } from '@/lib/onboarding/agent';
import type {
  ChatAttachment,
  OnboardingMessage
} from '@/lib/onboarding/types';

/**
 * POST /api/onboarding/message
 * Processes one user turn in the text onboarding chat.
 *
 * Body: { sessionId: string; message: string; attachments?: ChatAttachment[] }
 * Returns: { session, assistantMessage }
 */
export async function POST(request: Request) {
  let body: {
    sessionId?: string;
    message?: string;
    attachments?: ChatAttachment[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { sessionId, message = '', attachments = [] } = body;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }
  if (!message.trim() && attachments.length === 0) {
    return NextResponse.json(
      { error: 'Message or attachments required' },
      { status: 400 }
    );
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  if (session.status === 'completed') {
    return NextResponse.json(
      { error: 'Onboarding already completed' },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();

  // Record the user message (with any attachments) in the transcript.
  const userMessage: OnboardingMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: message,
    attachments: attachments.length ? attachments : undefined,
    createdAt: now
  };
  session.messages.push(userMessage);

  // Run the agent turn (mutates session: records answer, merges profile).
  const result = await runAgentTurn(session, message, attachments);

  // Append the assistant reply and advance the current question.
  const assistantMessage: OnboardingMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: result.assistantMessage,
    questionKey: result.nextQuestionKey,
    createdAt: new Date().toISOString()
  };
  session.messages.push(assistantMessage);
  session.currentQuestionKey = result.nextQuestionKey;

  await saveSession(session);

  return NextResponse.json({
    session,
    assistantMessage,
    shouldComplete: result.shouldComplete
  });
}
