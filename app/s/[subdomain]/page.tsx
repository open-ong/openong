import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubdomainData } from '@/lib/subdomains';
import { getCampaigns } from '@/lib/campaigns';
import { protocol, rootDomain } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { CreateCampaignDialog } from './create-campaign-dialog';
import { HeartHandshake, ShoppingBag, Megaphone, ArrowUpRight } from 'lucide-react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);
  return { title: data ? `${data.name} · Campaigns` : rootDomain };
}

const TYPE_META = {
  crowdfunding: { label: 'Crowdfunding', icon: HeartHandshake },
  tienda: { label: 'Store', icon: ShoppingBag },
  calle: { label: 'On the street', icon: Megaphone }
} as const;

export default async function OngHomePage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const data = await getSubdomainData(subdomain);

  if (!data) {
    notFound();
  }

  const campaigns = await getCampaigns(subdomain);

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
          <div className="flex items-center gap-4">
            <Link
              href={`${protocol}://${rootDomain}/admin`}
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              All organizations
            </Link>
            <CreateCampaignDialog subdomain={subdomain} />
          </div>
        </div>

        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No campaigns yet. Create your first one to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const meta = TYPE_META[campaign.type];
              const Icon = meta.icon;
              return (
                <Link
                  key={campaign.slug}
                  href={`/${campaign.slug}`}
                  className="group block"
                >
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-4 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        {campaign.status === 'pending' && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Not built yet
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {campaign.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {meta.label} · /{campaign.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline">
                        Open editor
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
