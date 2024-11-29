import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userRole = request.headers.get('x-user-role');

  // Admin routes protection
  if (path.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Developer routes protection
  if (path.startsWith('/developer') && userRole !== 'developer') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Client routes protection
  if (path.startsWith('/client') && userRole !== 'client') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/developer/:path*', '/client/:path*'],
};