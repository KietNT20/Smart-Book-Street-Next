import { NextResponse } from 'next/server';
import { auth } from './auth';
import { PATH } from './constant/path';

const publicRoutes = ['/', PATH.LOGIN, PATH.REGISTER];

export default auth((req) => {
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check user authentication
  if (!req.auth) {
    return Response.redirect(new URL(PATH.LOGIN, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
