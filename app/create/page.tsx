import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { SubdomainForm } from '../subdomain-form';

export const metadata: Metadata = {
  title: 'Crear tu ONG · OpenONG',
  description:
    'Crea el sitio de tu organización en OpenONG y empieza a montar tus canales de financiación con IA.'
};

export default async function CreatePage() {
  const host = (await headers()).get('host') || '';
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Volver
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Administración
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Crea tu ONG
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Elegí el nombre de tu organización. Vas a tener tu propio sitio en{' '}
            <span className="font-medium">tu-org.{host}</span>
          </p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <SubdomainForm host={host} />
        </div>
      </div>
    </div>
  );
}
