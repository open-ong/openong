/**
 * Profile helpers: empty profile factory, deep-merge of partial patches,
 * deterministic mapping from an answered question into a profile patch,
 * and derivation of completed blocks / missing required fields.
 */

import {
  MIN_BLOCKS_FOR_COMPLETION,
  ONBOARDING_QUESTIONS,
  QUESTION_BY_KEY,
  REQUIRED_QUESTION_KEYS,
  type OnboardingBlockKey
} from './questions';
import type {
  Confidence,
  DeepPartial,
  DigitalMaturity,
  NgoOnboardingProfile,
  OnboardingSession,
  OnboardingSource
} from './types';

export function createEmptyProfile(): NgoOnboardingProfile {
  return {
    organization: {
      name: '',
      oneLiner: '',
      cause: '',
      beneficiaries: ''
    },
    impact: { programs: [], metrics: [], stories: [] },
    fundraising: {
      currentMethods: [],
      donorTypes: [],
      paymentMethods: [],
      mainChallenge: ''
    },
    channels: {},
    campaignSeed: { suggestedDonationImpacts: [] },
    storeSeed: { hasProducts: false, products: [] },
    streetFundraisingGuideSeed: {
      commonObjections: [],
      forbiddenClaims: [],
      preferredTone: '',
      faq: []
    },
    operations: { digitalMaturity: 'unknown' },
    metadata: {
      onboardingStatus: 'in_progress',
      source: 'text_chat',
      confidence: 'low',
      missingFields: REQUIRED_QUESTION_KEYS.slice()
    }
  };
}

export function createSession(params: {
  id: string;
  subdomain?: string;
  source?: OnboardingSource;
}): OnboardingSession {
  const now = new Date().toISOString();
  const profile = createEmptyProfile();
  profile.metadata.source = params.source ?? 'text_chat';
  return {
    id: params.id,
    subdomain: params.subdomain,
    createdAt: now,
    updatedAt: now,
    source: params.source ?? 'text_chat',
    status: 'in_progress',
    messages: [],
    profile,
    currentQuestionKey: null,
    answers: {},
    completedBlocks: []
  };
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Deep-merges a partial patch into the target profile.
 * Arrays are replaced (not concatenated) — the agent is expected to send the
 * full intended array for a field when it wants to change it.
 */
export function mergeProfile(
  target: NgoOnboardingProfile,
  patch: DeepPartial<NgoOnboardingProfile>
): NgoOnboardingProfile {
  // Only ever called with plain objects (the isPlainObject guard below skips
  // arrays — arrays are replaced wholesale, never deep-merged).
  const result: Record<string, unknown> = {
    ...(target as unknown as Record<string, unknown>)
  };

  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    if (value === undefined) continue;
    const current = result[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      result[key] = mergeProfile(
        current as unknown as NgoOnboardingProfile,
        value as DeepPartial<NgoOnboardingProfile>
      );
    } else {
      result[key] = value;
    }
  }

  return result as unknown as NgoOnboardingProfile;
}

const truthy = (s: string) =>
  /\b(si|sí|claro|tenemos|usamos|tengo|obvio|por supuesto|dale|afirmativo)\b/i.test(
    s
  );
const falsy = (s: string) =>
  /\b(no|todav[ií]a no|ninguno|nada|nunca)\b/i.test(s);

function detectDigitalMaturity(answer: string): DigitalMaturity {
  const a = answer.toLowerCase();
  if (/\b(alto|alta|muy c[oó]modo|experto|avanzad)/.test(a)) return 'high';
  if (/\b(bajo|baja|poco|nada c[oó]modo|cuesta|b[aá]sico)/.test(a)) return 'low';
  if (/\b(medio|media|m[aá]s o menos|intermedio|razonable)/.test(a))
    return 'medium';
  return 'unknown';
}

/**
 * Deterministic mapping from a single answered question to a profile patch.
 * Used by the no-LLM fallback engine and as a safety net under the LLM mode.
 *
 * This is intentionally conservative: it captures free text into the most
 * relevant field without trying to over-parse. The LLM mode produces richer
 * structured patches; this guarantees the summary is never empty.
 */
export function patchFromAnswer(
  questionKey: string,
  answer: string
): DeepPartial<NgoOnboardingProfile> {
  const text = answer.trim();
  const list = text
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  switch (questionKey) {
    case 'org_name':
      return { organization: { name: text } };
    case 'org_one_liner':
      return { organization: { oneLiner: text } };
    case 'org_cause':
      return { organization: { cause: text } };
    case 'org_beneficiaries':
      return { organization: { beneficiaries: text } };
    case 'org_location':
      return { organization: { location: text } };

    case 'programs':
      return { impact: { programs: list } };
    case 'impact_metrics':
      return {
        impact: { metrics: list.map((label) => ({ label, value: '' })) }
      };
    case 'impact_stories':
      return { impact: { stories: list } };

    case 'fundraising_methods':
      return { fundraising: { currentMethods: list } };
    case 'donor_types':
      return {
        fundraising: {
          donorTypes: list,
          recurringDonors: /recurrent|mensual|fijo/i.test(text) ? true : undefined
        }
      };
    case 'payment_methods':
      return { fundraising: { paymentMethods: list } };
    case 'fundraising_challenge':
      return { fundraising: { mainChallenge: text } };

    case 'channels': {
      const a = text.toLowerCase();
      return {
        channels: {
          whatsapp: /whatsapp|wsp|wpp/.test(a) || undefined,
          instagram: /instagram|insta|ig/.test(a) || undefined,
          email: /e?mail|correo/.test(a) || undefined,
          website: /web|sitio|p[aá]gina/.test(a) || undefined,
          events: /evento/.test(a) || undefined,
          notes: text
        }
      };
    }
    case 'best_channel':
      return { channels: { notes: `Mejor canal: ${text}` } };
    case 'audience_not_donating':
      return { channels: { notes: `Audiencia que no dona: ${text}` } };

    case 'campaign_need':
      return falsy(text) && !truthy(text)
        ? {}
        : { campaignSeed: { title: text } };
    case 'campaign_goal': {
      const amount = parseAmount(text);
      return {
        campaignSeed: {
          goalAmount: amount,
          timeframe: text
        }
      };
    }
    case 'campaign_use_of_funds':
      return { campaignSeed: { useOfFunds: text } };

    case 'store_products': {
      const has = truthy(text) && !falsy(text);
      return {
        storeSeed: {
          hasProducts: has,
          products: has
            ? list.map((name) => ({ name, type: 'physical' as const }))
            : []
        }
      };
    }
    case 'store_symbolic':
      return {
        storeSeed: {
          products: list.map((name) => ({ name, type: 'symbolic' as const }))
        }
      };

    case 'street_team':
      return { channels: { streetFundraising: truthy(text) && !falsy(text) } };
    case 'street_pitch':
      return { streetFundraisingGuideSeed: { currentPitch: text } };
    case 'street_objections':
      return { streetFundraisingGuideSeed: { commonObjections: list } };
    case 'street_forbidden':
      return { streetFundraisingGuideSeed: { forbiddenClaims: list } };
    case 'preferred_tone':
      return { streetFundraisingGuideSeed: { preferredTone: text } };

    case 'ops_owner':
      return { operations: { ownerRole: text } };
    case 'ops_time':
      return { operations: { weeklyTimeAvailable: text } };
    case 'ops_digital_maturity':
      return { operations: { digitalMaturity: detectDigitalMaturity(text) } };
    case 'ops_sensitive':
      return { operations: { sensitiveDataNotes: text } };

    default:
      return {};
  }
}

function parseAmount(text: string): number | undefined {
  // Grab the first number-looking token, tolerating $, dots and commas.
  const match = text.match(/\$?\s*([\d.]+(?:[.,]\d+)?)/);
  if (!match) return undefined;
  const normalized = match[1].replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/** Whether a required field already has content in the profile. */
function isRequiredFieldFilled(
  profile: NgoOnboardingProfile,
  questionKey: string
): boolean {
  switch (questionKey) {
    case 'org_name':
      return Boolean(profile.organization.name);
    case 'org_one_liner':
      return Boolean(profile.organization.oneLiner);
    case 'org_cause':
      return Boolean(profile.organization.cause);
    case 'org_beneficiaries':
      return Boolean(profile.organization.beneficiaries);
    case 'programs':
      return profile.impact.programs.length > 0;
    case 'fundraising_methods':
      return profile.fundraising.currentMethods.length > 0;
    case 'fundraising_challenge':
      return Boolean(profile.fundraising.mainChallenge);
    case 'channels':
      return Boolean(
        profile.channels.notes ||
          profile.channels.whatsapp ||
          profile.channels.instagram ||
          profile.channels.email ||
          profile.channels.website ||
          profile.channels.events
      );
    case 'preferred_tone':
      return Boolean(profile.streetFundraisingGuideSeed.preferredTone);
    default:
      return true;
  }
}

export function computeMissingFields(profile: NgoOnboardingProfile): string[] {
  return REQUIRED_QUESTION_KEYS.filter(
    (key) => !isRequiredFieldFilled(profile, key)
  );
}

/** Blocks for which at least one question has been answered. */
export function computeCompletedBlocks(
  answeredKeys: Set<string>
): OnboardingBlockKey[] {
  const blocks = new Set<OnboardingBlockKey>();
  for (const q of ONBOARDING_QUESTIONS) {
    if (answeredKeys.has(q.key)) blocks.add(q.block);
  }
  return Array.from(blocks);
}

export function canComplete(answeredKeys: Set<string>): boolean {
  const blocks = new Set(computeCompletedBlocks(answeredKeys));
  return MIN_BLOCKS_FOR_COMPLETION.every((b) => blocks.has(b));
}

export function deriveConfidence(answeredCount: number): Confidence {
  if (answeredCount >= 18) return 'high';
  if (answeredCount >= 9) return 'medium';
  return 'low';
}

/**
 * Records an answer on the session: stores raw answer, applies the
 * deterministic patch, and recomputes derived metadata. The LLM-produced
 * patch (if any) should be merged BEFORE calling this so derived metadata
 * reflects the richest state.
 */
export function recordAnswer(
  session: OnboardingSession,
  questionKey: string,
  answer: string,
  confidence: Confidence = 'medium'
): void {
  session.answers[questionKey] = {
    answer,
    confidence,
    at: new Date().toISOString()
  };
  session.profile = mergeProfile(
    session.profile,
    patchFromAnswer(questionKey, answer)
  );
  refreshDerivedMetadata(session);
}

export function refreshDerivedMetadata(session: OnboardingSession): void {
  const answeredKeys = new Set(Object.keys(session.answers));
  session.completedBlocks = computeCompletedBlocks(answeredKeys);
  session.profile.metadata.missingFields = computeMissingFields(
    session.profile
  );
  session.profile.metadata.confidence = deriveConfidence(answeredKeys.size);
}

export { QUESTION_BY_KEY };
