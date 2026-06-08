import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { OrganizationProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { requireActiveOrg } from '@/lib/org-context';
import { getOrgBySlug } from '@/lib/orgs';
import { rootDomain } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { orgSlug } = await auth();
  const org = orgSlug ? await getOrgBySlug(orgSlug) : null;
  return { title: org ? `${org.name} · Miembros` : rootDomain };
}

export default async function MiembrosPage() {
  await requireActiveOrg();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Miembros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administrá los miembros de tu organización e invitá nuevos por email.
          </p>
        </div>

        <OrganizationProfile routing="hash" />
      </div>
    </div>
  );
}
