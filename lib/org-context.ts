import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { getOrgBySlug, readOnboardingCompletedAt } from '@/lib/orgs';
import { sanitizeSubdomain } from '@/lib/subdomains';

const getUserRole = cache(async (userId: string): Promise<string | undefined> => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return (user.publicMetadata as { role?: string } | null)?.role;
});

export type OrgAccess = {
  orgId: string;
  slug: string;
  name: string;
  superadmin: boolean;
  canCreateCampaign: boolean;
  onboardingCompletedAt?: number;
};

export type OrgAccessResult =
  | { ok: true; access: OrgAccess }
  | { ok: false; status: 401 | 403 | 404 };

export async function isSuperadmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  return (await getUserRole(userId)) === 'superadmin';
}

export async function resolveOrgAccess(
  subdomain: string
): Promise<OrgAccessResult> {
  const sub = sanitizeSubdomain(subdomain);
  const { userId, orgSlug } = await auth();
  if (!userId) return { ok: false, status: 401 };

  const org = await getOrgBySlug(sub);
  if (!org || !org.slug) return { ok: false, status: 404 };

  const superadmin = (await getUserRole(userId)) === 'superadmin';
  const access: OrgAccess = {
    orgId: org.id,
    slug: org.slug,
    name: org.name,
    superadmin,
    canCreateCampaign: orgSlug === org.slug,
    onboardingCompletedAt: readOnboardingCompletedAt(org.publicMetadata)
  };

  if (orgSlug === org.slug) return { ok: true, access };
  if (superadmin) return { ok: true, access };
  return { ok: false, status: 403 };
}

export async function requireActiveOrg(): Promise<OrgAccess> {
  const { userId, orgSlug } = await auth();

  if (!userId) redirect('/sign-in');
  if (!orgSlug) redirect('/create');

  const org = await getOrgBySlug(orgSlug);
  if (!org || !org.slug) redirect('/create');

  const superadmin = (await getUserRole(userId)) === 'superadmin';
  return {
    orgId: org.id,
    slug: org.slug,
    name: org.name,
    superadmin,
    canCreateCampaign: true,
    onboardingCompletedAt: readOnboardingCompletedAt(org.publicMetadata)
  };
}
