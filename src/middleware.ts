import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { PATH } from './enums/path';

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

export function middleware(request: NextRequest) {
  // Nếu đây là request tới google-response endpoint
  if (request.nextUrl.pathname === '/api/user/google-response') {
    // Kiểm tra nếu request không có header Accept: application/json
    const acceptHeader = request.headers.get('accept');
    if (!acceptHeader?.includes('application/json')) {
      // Redirect tới trang callback để xử lý
      return NextResponse.redirect(new URL('/auth/callback', request.url));
    }
  }

  return NextResponse.next();
}

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
    '/api/user/google-response',
  ],
};
