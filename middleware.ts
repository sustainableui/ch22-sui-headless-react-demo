import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl: url, geo } = request;
  const country = geo.country || 'US';
  const latitude = geo.latitude || '37.3719';
  const longitude = geo.longitude || '-79.8164';

  url.searchParams.set('country', country);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|static|favicon.ico).*)',
  ],
};
