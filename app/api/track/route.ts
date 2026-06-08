import { NextRequest, NextResponse } from 'next/server';
import { recordView } from '@/lib/traffic';
import { getOrgBySlug } from '@/lib/orgs';

const VISITOR_COOKIE = 'oo_vid';
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const subdomain =
    body && typeof (body as { subdomain?: unknown }).subdomain === 'string'
      ? (body as { subdomain: string }).subdomain
      : '';
  const slug =
    body && typeof (body as { slug?: unknown }).slug === 'string'
      ? (body as { slug: string }).slug
      : '';

  if (!subdomain || !slug) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const org = await getOrgBySlug(subdomain);
  if (!org) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const response = NextResponse.json({ ok: true });

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      maxAge: ONE_YEAR,
      path: '/',
      sameSite: 'lax'
    });
  }

  try {
    await recordView({ orgId: org.id, slug, visitorId });
  } catch {
    // Analytics must never break the page; swallow write errors.
  }

  return response;
}
