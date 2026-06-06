import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getSubdomainData } from '@/lib/subdomains';
import { getOrders } from '@/lib/orders';
import { rootDomain } from '@/lib/utils';
import { OrdersPanel } from '../orders-panel';
import { ExportOrdersButton } from '../export-orders-button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);
  return { title: data ? `${data.name} · Pedidos` : rootDomain };
}

export default async function OrdersPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);

  if (!data) {
    notFound();
  }

  const orders = await getOrders(subdomain);

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pedidos</h1>
            <p className="mt-1 text-sm text-gray-500">{data.name}</p>
          </div>
          <ExportOrdersButton subdomain={subdomain} orders={orders} />
        </div>

        <OrdersPanel subdomain={subdomain} orders={orders} />
      </div>
    </div>
  );
}
