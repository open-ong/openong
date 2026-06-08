'use client';

import { useState } from 'react';
import { useOrganizationList } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Loader2, ArrowRight } from 'lucide-react';
import { sanitizeSubdomain } from '@/lib/subdomains';
import { rootDomain } from '@/lib/utils';

export function OrgChooser() {
  const { isLoaded, userMemberships, createOrganization, setActive } =
    useOrganizationList({ userMemberships: true });
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = sanitizeSubdomain(name);
  const memberships = userMemberships?.data ?? [];

  async function enterOrg(orgId: string) {
    if (!setActive) return;
    await setActive({ organization: orgId });
    window.location.href = '/admin';
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Poné un nombre para tu organización.');
      return;
    }
    if (!slug) {
      setError('El nombre debe tener al menos una letra o número.');
      return;
    }
    if (!createOrganization || !setActive) return;
    setCreating(true);
    try {
      const org = await createOrganization({ name: trimmed, slug });
      await setActive({ organization: org.id });
      window.location.href = '/onboarding';
    } catch (err) {
      const message =
        (err as { errors?: { message?: string }[] })?.errors?.[0]?.message ??
        'No se pudo crear la organización. Probá con otro nombre.';
      setError(message);
      setCreating(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Tu organización
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Entrá a una organización o creá una nueva.
        </p>
      </div>

      {!isLoaded ? (
        <div className="flex justify-center py-8 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          {memberships.length > 0 && (
            <div className="space-y-2">
              {memberships.map((m) => (
                <button
                  key={m.organization.id}
                  type="button"
                  onClick={() => enterOrg(m.organization.id)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-gray-900">
                      {m.organization.name}
                    </div>
                    <div className="truncate text-sm text-gray-500">
                      {m.organization.slug}.{rootDomain}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleCreate}
            className="space-y-4 rounded-lg bg-white p-6 shadow-md"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Crear nueva ONG</Label>
              <Input
                id="name"
                value={name}
                placeholder="Techo Argentina"
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Vivirá en{' '}
                <span className="font-medium">
                  {slug || 'tu-org'}.{rootDomain}
                </span>
              </p>
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear organización
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
