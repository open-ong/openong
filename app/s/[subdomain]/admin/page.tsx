import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubdomainData } from '@/lib/subdomains';
import { getCampaigns } from '@/lib/campaigns';
import { getOrders } from '@/lib/orders';
import { getTrafficSeries } from '@/lib/traffic';
import { rootDomain } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateCampaignDialog } from '../create-campaign-dialog';
import { TrafficDashboard } from '../traffic-dashboard';
import {
  HeartHandshake,
  ShoppingBag,
  ArrowUpRight,
  ExternalLink,
  Package
} from 'lucide-react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);
  return { title: data ? `${data.name} · Administración` : rootDomain };
}

export const dynamic = 'force-dynamic';

const TYPE_META = {
  crowdfunding: { label: 'Crowdfunding', icon: HeartHandshake },
  tienda: { label: 'Tienda', icon: ShoppingBag }
} as const;

export default async function OngAdminPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);

  if (!data) {
    notFound();
  }

  const [campaigns, orders, traffic] = await Promise.all([
    getCampaigns(subdomain),
    getOrders(subdomain),
    getTrafficSeries(subdomain)
  ]);

  const pendingOrders = orders.filter((o) => o.status === 'por_validar').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {subdomain}.{rootDomain}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              Ver página pública
              <ExternalLink className="h-4 w-4" />
            </a>
            <Button asChild variant="outline">
              <Link href="/pedidos">
                <Package className="mr-2 h-4 w-4" />
                Pedidos
                {pendingOrders > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-semibold text-amber-950">
                    {pendingOrders}
                  </span>
                )}
              </Link>
            </Button>
            <CreateCampaignDialog subdomain={subdomain} />
          </div>
        </div>

        <TrafficDashboard
          subdomain={subdomain}
          campaigns={campaigns.map((c) => ({ slug: c.slug, title: c.title }))}
          traffic={traffic}
          orders={orders.map((o) => ({
            id: o.id,
            createdAt: o.createdAt,
            buyerName: o.buyer.name,
            campaignSlug: o.campaignSlug,
            total: o.total,
            status: o.status
          }))}
        />

        <h2 className="text-xl font-semibold text-gray-900">Campañas</h2>

        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Todavía no hay campañas. Creá la primera para empezar.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const meta = TYPE_META[campaign.type];
              const Icon = meta.icon;
              return (
                <Card
                  key={campaign.slug}
                  className="h-full transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex h-full flex-col gap-4 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      {campaign.status === 'pending' && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Sin construir
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {campaign.title || 'Sin título'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {meta.label} · /{campaign.slug}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                      <Link
                        href={`/${campaign.slug}/edit`}
                        className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        Abrir editor
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <a
                        href={`/${campaign.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        Ver sitio web
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
