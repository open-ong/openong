import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/onboarding/store';
import { canComplete, refreshDerivedMetadata } from '@/lib/onboarding/profile';
import { markSubdomainOnboarded } from '@/lib/subdomains';

/**
 * POST /api/onboarding/complete
 * Marks the onboarding session as completed and finalizes the profile.
 *
 * Body: { sessionId: string; force?: boolean }
 * Returns 422 if the minimum blocks are not covered (unless force=true).
 */
export async function POST(request: Request) {
  let body: { sessionId?: string; force?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { sessionId, force = false } = body;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const answeredKeys = new Set(Object.keys(session.answers));
  if (!force && !canComplete(answeredKeys)) {
    return NextResponse.json(
      {
        error: 'Minimum blocks not covered',
        missingBlocks: ['identity', 'impact', 'fundraising', 'channels'].filter(
          (b) => !session.completedBlocks.includes(b as never)
        )
      },
      { status: 422 }
    );
  }

  refreshDerivedMetadata(session);
  session.status = 'completed';
  session.profile.metadata.onboardingStatus = 'completed';
  session.profile.metadata.completedAt = new Date().toISOString();
  session.currentQuestionKey = null;

  await saveSession(session);

  if (session.subdomain) {
    await markSubdomainOnboarded(session.subdomain);
  }

  return NextResponse.json({ session });
}
