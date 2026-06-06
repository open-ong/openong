'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSubdomainAction } from '@/app/actions';

type CreateState = {
  error?: string;
  success?: boolean;
  name?: string;
};

export function SubdomainForm({ host }: { host: string }) {
  const [state, action, isPending] = useActionState<CreateState, FormData>(
    createSubdomainAction,
    {}
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la organización</Label>
        <Input
          id="name"
          name="name"
          placeholder="Techo Argentina"
          defaultValue={state?.name}
          required
        />
        <p className="text-xs text-gray-500">
          Tu organización va a vivir en{' '}
          <span className="font-medium">tu-org.{host}</span>
        </p>
      </div>

      {state?.error && (
        <div className="text-sm text-red-500">{state.error}</div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear organización'}
      </Button>
    </form>
  );
}
