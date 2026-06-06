import '@puckeditor/core/puck.css';
import '@puckeditor/plugin-ai/styles.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubdomainData } from '@/lib/subdomains';
import { getCampaign } from '@/lib/campaigns';
import { getPageData } from '@/lib/pages';
import { CampaignEditor } from './editor';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const campaign = await getCampaign(subdomain, slug);
  return { title: campaign ? `Edit · ${campaign.title}` : subdomain };
}

export default async function CampaignEditorPage({
  params
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}) {
  const { subdomain, slug } = await params;

  const org = await getSubdomainData(subdomain);
  if (!org) {
    notFound();
  }

  const campaign = await getCampaign(subdomain, slug);
  if (!campaign) {
    notFound();
  }

  const data = await getPageData(subdomain, slug);

  return (
    <CampaignEditor
      subdomain={subdomain}
      slug={slug}
      data={data || {}}
      prompt={campaign.prompt}
      autoSend={campaign.status === 'pending'}
    />
  );
}

export const dynamic = 'force-dynamic';
