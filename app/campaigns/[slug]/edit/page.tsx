import '@puckeditor/core/puck.css';
import '@puckeditor/plugin-ai/styles.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireActiveOrg } from '@/lib/org-context';
import { getOrgBySlug } from '@/lib/orgs';
import { getCampaign } from '@/lib/campaigns';
import { getPageData } from '@/lib/pages';
import { auth } from '@clerk/nextjs/server';
import { CampaignEditor } from './editor';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { orgSlug } = await auth();
  const org = orgSlug ? await getOrgBySlug(orgSlug) : null;
  const campaign = org ? await getCampaign(org.id, slug) : null;
  return { title: campaign ? `Editar · ${campaign.title}` : slug };
}

export default async function CampaignEditorPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const access = await requireActiveOrg();

  const campaign = await getCampaign(access.orgId, slug);
  if (!campaign) {
    notFound();
  }

  const data = await getPageData(access.orgId, slug);

  // When the campaign was created with images, hand their hosted URLs to the
  // builder so it can place them as Image blocks instead of placeholders.
  const images = campaign.images ?? [];
  const prompt =
    images.length > 0
      ? `${campaign.prompt}\n\nUsá estas imágenes subidas por la organización en la página (como bloques Image, con su URL exacta en "src"):\n${images.join('\n')}`
      : campaign.prompt;

  return (
    <CampaignEditor
      subdomain={access.slug}
      slug={slug}
      data={data || {}}
      prompt={prompt}
      autoSend={campaign.status === 'pending'}
    />
  );
}

export const dynamic = 'force-dynamic';
