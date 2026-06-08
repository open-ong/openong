import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isSuperadmin } from '@/lib/org-context';
import { listOrgs } from '@/lib/orgs';
import { AdminDashboard } from './dashboard';
import { rootDomain } from '@/lib/utils';

export const metadata: Metadata = {
  title: `Admin Dashboard | ${rootDomain}`,
  description: `Manage organizations for ${rootDomain}`
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isSuperadmin())) {
    notFound();
  }

  const tenants = await listOrgs();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AdminDashboard tenants={tenants} />
    </div>
  );
}
