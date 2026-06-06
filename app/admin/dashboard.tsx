'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Loader2, ArrowUpRight, Building2 } from 'lucide-react';
import { deleteSubdomainAction } from '@/app/actions';
import { rootDomain, protocol } from '@/lib/utils';

type Tenant = {
  subdomain: string;
  name: string;
  createdAt: number;
};

type DeleteState = {
  error?: string;
  success?: string;
};

function DashboardHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage every organization on {rootDomain}
        </p>
      </div>
    </div>
  );
}

function TenantGrid({
  tenants,
  action,
  isPending
}: {
  tenants: Tenant[];
  action: (formData: FormData) => void;
  isPending: boolean;
}) {
  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          No organizations have been created yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tenants.map((tenant) => {
        const url = `${protocol}://${tenant.subdomain}.${rootDomain}`;
        return (
          <a key={tenant.subdomain} href={url} className="group block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <form action={action} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="hidden"
                      name="subdomain"
                      value={tenant.subdomain}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      type="submit"
                      disabled={isPending}
                      className="text-gray-400 hover:text-red-600"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tenant.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {tenant.subdomain}.{rootDomain}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:underline">
                  Open organization
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </a>
        );
      })}
    </div>
  );
}

export function AdminDashboard({ tenants }: { tenants: Tenant[] }) {
  const [state, action, isPending] = useActionState<DeleteState, FormData>(
    deleteSubdomainAction,
    {}
  );

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <DashboardHeader />
      <TenantGrid tenants={tenants} action={action} isPending={isPending} />

      {state.error && (
        <div className="fixed bottom-4 right-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 shadow-md">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="fixed bottom-4 right-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700 shadow-md">
          {state.success}
        </div>
      )}
    </div>
  );
}
