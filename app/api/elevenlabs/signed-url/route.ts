import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  const enabled = process.env.NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED === 'true';
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const branchId = process.env.ELEVENLABS_BRANCH_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!enabled || !agentId || !apiKey) {
    return NextResponse.json(
      {
        enabled: false,
        reason: 'missing_configuration'
      },
      { status: 200 }
    );
  }

  const url = new URL(
    'https://api.elevenlabs.io/v1/convai/conversation/get-signed-url'
  );
  url.searchParams.set('agent_id', agentId);
  if (branchId) {
    url.searchParams.set('branch_id', branchId);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'xi-api-key': apiKey
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        enabled: false,
        reason: 'upstream_error',
        status: response.status
      },
      { status: 502 }
    );
  }

  const payload = (await response.json()) as { signed_url: string };

  return NextResponse.json({
    enabled: true,
    mode: 'signed_url',
    signedUrl: payload.signed_url,
    agentId,
    branchId
  });
}
