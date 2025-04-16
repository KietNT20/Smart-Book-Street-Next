import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE } from './constant/storage';

interface RoleRouteMap {
  [key: string]: RoleEnums[];
}

interface DecodedToken {
  sub: string;
  email: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': RoleEnums;
  exp: number;
}

const publicPaths = [PATH.LOGIN, PATH.REGISTER];

const roleBasedRoutes: RoleRouteMap = {
  [PATH.DASHBOARD]: [RoleEnums.ADMIN],
  '/publishers/*': [RoleEnums.ADMIN],
  '/stores/*': [RoleEnums.ADMIN],
  [PATH.STORE_MANAGER_DASHBOARD]: [RoleEnums.STORE_MANAGER, RoleEnums.ADMIN],
  [PATH.STORE_OWNER_DASHBOARD]: [RoleEnums.STORE_OWNER, RoleEnums.ADMIN],
  '/books/*': [RoleEnums.PUBLISHER, RoleEnums.STORE_MANAGER],
  '/categories/*': [RoleEnums.PUBLISHER, RoleEnums.STORE_MANAGER],
  '/authors/*': [RoleEnums.PUBLISHER, RoleEnums.STORE_MANAGER],
};

const schemasRoleToken =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication status
  const tokenCookie = request.cookies.get(STORAGE.token);
  const isAuthenticated = !!tokenCookie?.value;

  // Handle root path redirection
  if (pathname === PATH.HOME) {
    if (isAuthenticated) {
      // Decode token to get user role
      try {
        const decodedToken = jwtDecode<DecodedToken>(tokenCookie.value);
        const userRole = decodedToken[schemasRoleToken];

        // Redirect to appropriate dashboard based on role
        switch (userRole) {
          case RoleEnums.ADMIN:
            return NextResponse.redirect(new URL(PATH.DASHBOARD, request.url));
          case RoleEnums.STORE_MANAGER:
            return NextResponse.redirect(
              new URL(PATH.STORE_MANAGER_DASHBOARD, request.url)
            );
          case RoleEnums.STORE_OWNER:
            return NextResponse.redirect(
              new URL(PATH.STORE_OWNER_DASHBOARD, request.url)
            );
          default:
            return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
        }
      } catch (error: unknown) {
        console.log('Error Handle root path:', error);
        // If token is invalid, redirect to login
        return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
      }
    } else {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
    }
  }

  // Check if the requested path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If authenticated and trying to access auth pages, redirect to appropriate dashboard
  if (isAuthenticated && isPublicPath) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(tokenCookie.value);
      const userRole = decodedToken[schemasRoleToken];

      switch (userRole) {
        case RoleEnums.ADMIN:
          return NextResponse.redirect(new URL(PATH.DASHBOARD, request.url));
        case RoleEnums.STORE_MANAGER:
          return NextResponse.redirect(
            new URL(PATH.STORE_MANAGER_DASHBOARD, request.url)
          );
        case RoleEnums.STORE_OWNER:
          return NextResponse.redirect(
            new URL(PATH.STORE_OWNER_DASHBOARD, request.url)
          );
        default:
          return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
      }
    } catch (error: unknown) {
      console.log('Error authenticated:', error);
      // If token decoding fails, redirect to login
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
    }
  }

  // If not authenticated and trying to access protected pages, redirect to login
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL(PATH.LOGIN, request.url);
    // Add "from" parameter to redirect back after login
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control for authenticated users
  if (isAuthenticated && !isPublicPath) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(tokenCookie.value);
      const userRole = decodedToken[schemasRoleToken];

      // First, check for exact path matches
      let requiredRoles = roleBasedRoutes[pathname];

      // If no exact match, check for pattern matches (e.g., "/books/*")
      if (!requiredRoles) {
        const patternMatch = Object.keys(roleBasedRoutes).find((pattern) => {
          if (pattern.endsWith('/*')) {
            const basePattern = pattern.slice(0, -2); // Remove the "/*"
            return pathname.startsWith(basePattern);
          }
          return false;
        });

        if (patternMatch) {
          requiredRoles = roleBasedRoutes[patternMatch];
        }
      }

      // If we found required roles for this path and user doesn't have permission
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        // Redirect to unauthorized page
        return NextResponse.redirect(new URL(PATH.UNAUTHORIZED, request.url));
      }
    } catch (error: unknown) {
      console.log('Error Role-based access controln:', error);
      // If token decoding fails, redirect to login
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
    }
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
