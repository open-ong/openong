'use client';

import { Check, Circle } from 'lucide-react';
import { ONBOARDING_BLOCKS } from '@/lib/onboarding/questions';
import { cn } from '@/lib/utils';
import type {
  NgoOnboardingProfile,
  OnboardingSession
} from '@/lib/onboarding/types';

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className={cn('text-sm', !value && 'text-muted-foreground/50 italic')}>
        {value || 'pendiente'}
      </dd>
    </div>
  );
}

function joinList(items: string[]): string {
  return items.filter(Boolean).join(', ');
}

function channelsLabel(p: NgoOnboardingProfile): string {
  const c = p.channels;
  const active = [
    c.whatsapp && 'WhatsApp',
    c.instagram && 'Instagram',
    c.email && 'Email',
    c.website && 'Web',
    c.events && 'Eventos',
    c.streetFundraising && 'Calle'
  ].filter(Boolean) as string[];
  return active.length ? active.join(', ') : '';
}

export function ProfileSummary({ session }: { session: OnboardingSession }) {
  const p = session.profile;
  const completed = new Set(session.completedBlocks);

  return (
    <div className="space-y-5">
      {/* Block progress checklist */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Bloques
        </h3>
        <ul className="space-y-1.5">
          {ONBOARDING_BLOCKS.map((b) => {
            const done = completed.has(b.key);
            return (
              <li key={b.key} className="flex items-center gap-2 text-sm">
                {done ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Circle className="size-4 text-muted-foreground/40" />
                )}
                <span className={cn(!done && 'text-muted-foreground')}>
                  {b.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detected info */}
      <dl className="space-y-3 border-t pt-4">
        <Row label="Nombre de la ONG" value={p.organization.name} />
        <Row label="Causa" value={p.organization.cause} />
        <Row label="Público beneficiario" value={p.organization.beneficiaries} />
        <Row label="Programas principales" value={joinList(p.impact.programs)} />
        <Row
          label="Forma de recaudar"
          value={joinList(p.fundraising.currentMethods)}
        />
        <Row label="Canales" value={channelsLabel(p)} />
        <Row
          label="Productos / merchandising"
          value={
            p.storeSeed.products.length
              ? joinList(p.storeSeed.products.map((x) => x.name))
              : ''
          }
        />
        <Row label="Campaña activa" value={p.campaignSeed.title} />
        <Row label="Tono de comunicación" value={p.streetFundraisingGuideSeed.preferredTone} />
        <Row
          label="Necesidad / desafío"
          value={p.fundraising.mainChallenge}
        />
        <Row
          label="Objeciones frecuentes"
          value={joinList(p.streetFundraisingGuideSeed.commonObjections)}
        />
        <Row label="Responsable del equipo" value={p.operations.ownerRole} />
        <Row
          label="Madurez digital"
          value={
            p.operations.digitalMaturity === 'unknown'
              ? ''
              : p.operations.digitalMaturity
          }
        />
      </dl>
    </div>
  );
}
