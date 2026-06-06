import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { savePageData } from '@/lib/pages';

export async function POST(request: Request) {
  const { subdomain, data } = await request.json();

  if (!subdomain) {
    return NextResponse.json(
      { status: 'error', error: 'Missing subdomain' },
      { status: 400 }
    );
  }

  await savePageData(subdomain, data);

  revalidatePath(`/s/${subdomain}`);

  return NextResponse.json({ status: 'ok' });
}
