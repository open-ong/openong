import { NextResponse } from 'next/server';
import { getSession } from '@/lib/onboarding/store';

/**
 * GET /api/onboarding/session/:sessionId
 * Returns the full session (transcript + live profile + derived state).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ session });
}
