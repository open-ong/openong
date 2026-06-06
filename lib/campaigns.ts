import { redis } from '@/lib/redis';
import { sanitizeSubdomain } from '@/lib/subdomains';

export type CampaignType = 'crowdfunding' | 'tienda' | 'calle';

export type CampaignStatus = 'pending' | 'sent';

export type Campaign = {
  slug: string;
  title: string;
  type: CampaignType;
  prompt: string;
  status: CampaignStatus;
  createdAt: number;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function campaignsKey(subdomain: string) {
  return `campaigns:${sanitizeSubdomain(subdomain)}`;
}

export async function getCampaigns(subdomain: string): Promise<Campaign[]> {
  const data = await redis.get<Campaign[]>(campaignsKey(subdomain));
  return data || [];
}

export async function getCampaign(
  subdomain: string,
  slug: string
): Promise<Campaign | null> {
  const campaigns = await getCampaigns(subdomain);
  return campaigns.find((c) => c.slug === slug) || null;
}

export async function addCampaign(
  subdomain: string,
  campaign: Campaign
): Promise<void> {
  const campaigns = await getCampaigns(subdomain);
  campaigns.push(campaign);
  await redis.set(campaignsKey(subdomain), campaigns);
}

export async function updateCampaign(
  subdomain: string,
  slug: string,
  patch: Partial<Campaign>
): Promise<void> {
  const campaigns = await getCampaigns(subdomain);
  const next = campaigns.map((c) =>
    c.slug === slug ? { ...c, ...patch } : c
  );
  await redis.set(campaignsKey(subdomain), next);
}
