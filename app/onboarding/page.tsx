import type { Metadata } from 'next';
import { OnboardingExperience } from '@/components/onboarding/onboarding-experience';

export const metadata: Metadata = {
  title: 'Conocé tu ONG · Onboarding',
  description:
    'Onboarding conversacional asistido por IA para organizaciones sociales.'
};

export default function OnboardingPage() {
  const voiceEnabled =
    process.env.NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED === 'true';
  const voiceAgentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 dark:from-zinc-950 dark:to-zinc-900">
      <OnboardingExperience
        voiceEnabled={voiceEnabled}
        voiceAgentId={voiceAgentId}
      />
    </main>
  );
}
