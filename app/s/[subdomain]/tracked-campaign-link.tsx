'use client';

import Link from 'next/link';
import { PH, capture } from '@/lib/posthog/events';

export function TrackedCampaignLink({
  slug,
  className,
  children
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/${slug}`}
      className={className}
      onClick={() => capture(PH.campaignClick, { campaign: slug })}
    >
      {children}
    </Link>
  );
}
