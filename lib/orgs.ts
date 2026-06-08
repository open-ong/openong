import 'server-only';
import { cache } from 'react';
import { clerkClient } from '@clerk/nextjs/server';
import { sanitizeSubdomain } from '@/lib/subdomains';

export type OrgSummary = {
  id: string;
  subdomain: string;
  name: string;
  createdAt: number;
  onboardingCompletedAt?: number;
};

export function readOnboardingCompletedAt(
  publicMetadata: unknown
): number | undefined {
  const value = (publicMetadata as { onboardingCompletedAt?: unknown } | null)
    ?.onboardingCompletedAt;
  return typeof value === 'number' ? value : undefined;
}

export const getOrgBySlug = cache(async (slug: string) => {
  const sanitized = sanitizeSubdomain(slug);
  if (!sanitized) return null;
  try {
    const client = await clerkClient();
    return await client.organizations.getOrganization({ slug: sanitized });
  } catch {
    return null;
  }
});

export async function listOrgs(): Promise<OrgSummary[]> {
  const client = await clerkClient();
  const { data } = await client.organizations.getOrganizationList({
    limit: 100
  });
  return data.map((org) => ({
    id: org.id,
    subdomain: org.slug ?? org.id,
    name: org.name,
    createdAt: org.createdAt,
    onboardingCompletedAt: readOnboardingCompletedAt(org.publicMetadata)
  }));
}

export async function markOrgOnboarded(slug: string): Promise<void> {
  const org = await getOrgBySlug(slug);
  if (!org) return;
  const client = await clerkClient();
  await client.organizations.updateOrganization(org.id, {
    publicMetadata: {
      ...org.publicMetadata,
      onboardingCompletedAt: Date.now()
    }
  });
}

export async function deleteOrg(orgId: string): Promise<void> {
  const client = await clerkClient();
  await client.organizations.deleteOrganization(orgId);
}
