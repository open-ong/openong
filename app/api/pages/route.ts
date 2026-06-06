import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { savePageData } from '@/lib/pages';

export async function POST(request: Request) {
  const { subdomain, slug, data } = await request.json();

  if (!subdomain || !slug) {
    return NextResponse.json(
      { status: 'error', error: 'Missing subdomain or slug' },
      { status: 400 }
    );
  }

  await savePageData(subdomain, slug, data);

  revalidatePath(`/s/${subdomain}/${slug}`);

  return NextResponse.json({ status: 'ok' });
}
