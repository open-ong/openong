import '@puckeditor/core/puck.css';
import type { Data } from '@puckeditor/core';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrgBySlug } from '@/lib/orgs';
import { getCampaign } from '@/lib/campaigns';
import { getPageData } from '@/lib/pages';
import { PageRender } from '../render';
import { TrackView } from './track-view';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const org = await getOrgBySlug(subdomain);
  const campaign = org ? await getCampaign(org.id, slug) : null;
  return { title: campaign ? campaign.title : subdomain };
}

export default async function CampaignPublicPage({
  params
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}) {
  const { subdomain, slug } = await params;

  const org = await getOrgBySlug(subdomain);
  if (!org) {
    notFound();
  }

  const campaign = await getCampaign(org.id, slug);
  if (!campaign) {
    notFound();
  }

  // A campaign created without page content is still valid — render it blank
  // instead of a "doesn't exist" page.
  const data =
    (await getPageData(org.id, slug)) ?? ({ content: [], root: {} } as Data);

  return (
    <>
      <TrackView subdomain={subdomain} slug={slug} />
      <PageRender
        data={data}
        subdomain={subdomain}
        slug={slug}
        payment={campaign.payment}
      />
    </>
  );
}

export const dynamic = 'force-dynamic';
