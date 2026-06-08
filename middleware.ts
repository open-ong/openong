import { type NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';
import { protocol, rootDomain } from '@/lib/utils';

const ROOT_DOMAIN_PATHS = [
  '/admin',
  '/onboarding',
  '/pedidos',
  '/campaigns',
  '/superadmin',
  '/create',
  '/sign-in',
  '/sign-up'
];

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export default clerkMiddleware(async (_auth, request) => {
  const { pathname, search } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (
    subdomain &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next')
  ) {
    if (
      ROOT_DOMAIN_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      )
    ) {
      return NextResponse.redirect(
        `${protocol}://${rootDomain}${pathname}${search}`
      );
    }

    const rewritePath = pathname === '/' ? '' : pathname;
    const url = new URL(`/s/${subdomain}${rewritePath}`, request.url);
    url.search = search;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|otf|map|txt|xml|csv)).*)',
    '/(api|trpc)(.*)'
  ]
};
