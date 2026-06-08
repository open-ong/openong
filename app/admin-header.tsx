'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { protocol, rootDomain } from '@/lib/utils';

export function AdminHeader({ superadmin }: { superadmin?: boolean }) {
  const createUrl = `${protocol}://${rootDomain}/create`;
  const superadminUrl = `${protocol}://${rootDomain}/superadmin`;

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-3">
        <OrganizationSwitcher
          hidePersonal
          afterSelectOrganizationUrl="/switch"
          afterCreateOrganizationUrl="/switch"
          createOrganizationUrl={createUrl}
        />
        {superadmin && (
          <a
            href={superadminUrl}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Panel OpenONG
          </a>
        )}
      </div>
      <UserButton />
    </div>
  );
}
