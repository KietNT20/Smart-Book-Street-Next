import { PATH } from '@/enums/path';
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE } from './constant/storage';

// Define public paths that don't require authentication
const publicPaths = [PATH.LOGIN, PATH.REGISTER];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication status
  const tokenCookie = request.cookies.get(STORAGE.token);
  const isAuthenticated = !!tokenCookie?.value;

  // Handle root path redirection
  if (pathname === PATH.HOME) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(PATH.DASHBOARD, request.url));
    } else {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
    }
  }

  // Check if the requested path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL(PATH.DASHBOARD, request.url));
  }

  // If not authenticated and trying to access protected pages, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL(PATH.LOGIN, request.url);
    // Add "from" parameter to redirect back after login
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml, /robots.txt (public files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
