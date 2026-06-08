'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { PH, capture, identifyAdmin, isPublicHost } from '@/lib/posthog/events';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userId, orgSlug } = useAuth();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  // Admin pageviews (public pages capture their own with tenant context).
  useEffect(() => {
    if (isPublicHost()) return;
    capture(PH.pageview);
  }, [pathname]);

  useEffect(() => {
    if (isPublicHost() || !userId) return;
    identifyAdmin(userId, {
      email,
      org: orgSlug ?? undefined
    });
  }, [userId, orgSlug, email]);

  return <>{children}</>;
}
