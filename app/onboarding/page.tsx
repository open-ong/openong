import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { requireActiveOrg } from '@/lib/org-context';
import { getOrgBySlug } from '@/lib/orgs';
import { rootDomain } from '@/lib/utils';
import { OnboardingExperience } from '@/components/onboarding/onboarding-experience';
import { AdminHeader } from '@/app/admin-header';

export async function generateMetadata(): Promise<Metadata> {
  const { orgSlug } = await auth();
  const org = orgSlug ? await getOrgBySlug(orgSlug) : null;
  return { title: org ? `${org.name} · Onboarding` : rootDomain };
}

export const dynamic = 'force-dynamic';

export default async function OngOnboardingPage() {
  const access = await requireActiveOrg();

  if (access.onboardingCompletedAt) {
    redirect('/admin');
  }

  const voiceEnabled =
    process.env.NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED === 'true';
  const voiceAgentId =
    process.env.ELEVENLABS_AGENT_ID ?? process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto mb-4 w-full max-w-6xl">
        <AdminHeader superadmin={access.superadmin} />
      </div>
      <OnboardingExperience
        voiceEnabled={voiceEnabled}
        voiceAgentId={voiceAgentId}
        subdomain={access.slug}
      />
    </main>
  );
}
