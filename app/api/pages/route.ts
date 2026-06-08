import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { savePageData } from '@/lib/pages';
import { resolveOrgAccess } from '@/lib/org-context';
import { sanitizeSubdomain } from '@/lib/subdomains';

export async function POST(request: Request) {
  const { subdomain, slug, data } = await request.json();

  if (!subdomain || !slug) {
    return NextResponse.json(
      { status: 'error', error: 'Missing subdomain or slug' },
      { status: 400 }
    );
  }

  const result = await resolveOrgAccess(subdomain);
  if (!result.ok) {
    return NextResponse.json(
      { status: 'error', error: 'Unauthorized' },
      { status: result.status }
    );
  }

  await savePageData(result.access.orgId, slug, data);

  revalidatePath(`/s/${sanitizeSubdomain(subdomain)}/${slug}`);

  return NextResponse.json({ status: 'ok' });
}
