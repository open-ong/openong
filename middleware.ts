import { type NextRequest, NextResponse } from 'next/server';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch?.[1]) return fullUrlMatch[1];
    if (hostname.includes('.localhost')) return hostname.split('.')[0];
    return null;
  }

  // Vercel preview URLs: tenant---branch-name.vercel.app
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Production: subdomain.root.tld → 3+ parts; root.tld → 2 parts
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Rewrite every subdomain path to the tenant tree:
    //   {sub}.domain/                 -> /s/{sub}                 (public org home)
    //   {sub}.domain/admin            -> /s/{sub}/admin           (org dashboard)
    //   {sub}.domain/pedidos          -> /s/{sub}/pedidos         (orders)
    //   {sub}.domain/{campaign}       -> /s/{sub}/{campaign}      (public site)
    //   {sub}.domain/{campaign}/edit  -> /s/{sub}/{campaign}/edit (editor)
    const rewritePath = pathname === '/' ? '' : pathname;
    return NextResponse.rewrite(
      new URL(`/s/${subdomain}${rewritePath}`, request.url)
    );
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};
