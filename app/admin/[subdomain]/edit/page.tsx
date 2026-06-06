import '@puckeditor/core/puck.css';
import '@puckeditor/plugin-ai/styles.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubdomainData } from '@/lib/subdomains';
import { getPageData } from '@/lib/pages';
import { Editor } from './client';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  return { title: `Edit ${subdomain}` };
}

export default async function EditPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const subdomainData = await getSubdomainData(subdomain);
  if (!subdomainData) {
    notFound();
  }

  const data = await getPageData(subdomain);

  return <Editor subdomain={subdomain} data={data || {}} />;
}

export const dynamic = 'force-dynamic';
