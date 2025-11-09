// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 🧭 Log incoming requests
  console.log(`[MIDDLEWARE] ${request.method} ${request.nextUrl.pathname}`);

  // ⚡ Cache API responses for 5 seconds
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=5, stale-while-revalidate=30');
  }

  // ✅ Edge optimized
  return response;
}
