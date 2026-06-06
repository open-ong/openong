'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { protocol } from '@/lib/utils';

export default function NotFound() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [rootHost, setRootHost] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (pathname?.startsWith('/subdomain/')) {
      const extractedSubdomain = pathname.split('/')[2];
      if (extractedSubdomain) setSubdomain(extractedSubdomain);
    } else if (parts.length > 2 && parts[0] !== 'www') {
      setSubdomain(parts[0]);
      setRootHost(parts.slice(1).join('.'));
    } else {
      setRootHost(window.location.host);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {subdomain ? (
            <>
              <span className="text-blue-600">{subdomain}</span>.{rootHost}{' '}
              doesn't exist
            </>
          ) : (
            'Subdomain Not Found'
          )}
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          This subdomain hasn't been created yet.
        </p>
        <div className="mt-6">
          <Link
            href={`${protocol}://${rootHost}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {subdomain ? `Create ${subdomain}` : `Go to ${rootHost}`}
          </Link>
        </div>
      </div>
    </div>
  );
}
