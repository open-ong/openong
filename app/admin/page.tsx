import { getAllSubdomains } from '@/lib/subdomains';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AdminDashboard } from './dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage subdomains'
};

export default async function AdminPage() {
  const host = (await headers()).get('host') || '';
  const tenants = await getAllSubdomains();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AdminDashboard tenants={tenants} host={host} />
    </div>
  );
}
