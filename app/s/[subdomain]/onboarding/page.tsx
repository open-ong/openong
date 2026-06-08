import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getSubdomainData } from '@/lib/subdomains';
import { rootDomain } from '@/lib/utils';
import { OnboardingExperience } from '@/components/onboarding/onboarding-experience';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);
  return { title: data ? `${data.name} · Onboarding` : rootDomain };
}

export const dynamic = 'force-dynamic';

export default async function OngOnboardingPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);

  if (!data) {
    notFound();
  }

  if (data.onboardingCompletedAt) {
    redirect('/admin');
  }

  const voiceEnabled =
    process.env.NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED === 'true';
  const voiceAgentId =
    process.env.ELEVENLABS_AGENT_ID ?? process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 dark:from-zinc-950 dark:to-zinc-900">
      <OnboardingExperience
        voiceEnabled={voiceEnabled}
        voiceAgentId={voiceAgentId}
        subdomain={subdomain}
      />
    </main>
  );
}
