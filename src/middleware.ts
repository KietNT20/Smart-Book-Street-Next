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
  '/users/*': [RoleEnums.ADMIN],
  '/events/*': [RoleEnums.ADMIN],
  '/userstores/*': [RoleEnums.ADMIN],
  '/zones/*': [RoleEnums.ADMIN],
  [PATH.STORE_MANAGER_DASHBOARD]: [RoleEnums.STORE_MANAGER, RoleEnums.ADMIN],
  [PATH.STORE_OWNER_DASHBOARD]: [RoleEnums.STORE_OWNER, RoleEnums.ADMIN],
  '/books/*': [
    RoleEnums.PUBLISHER,
    RoleEnums.STORE_MANAGER,
    RoleEnums.STORE_OWNER,
  ],
  '/categories/*': [
    RoleEnums.PUBLISHER,
    RoleEnums.STORE_MANAGER,
    RoleEnums.STORE_OWNER,
  ],
  '/authors/*': [
    RoleEnums.PUBLISHER,
    RoleEnums.STORE_MANAGER,
    RoleEnums.STORE_OWNER,
  ],
  '/orders/*': [
    RoleEnums.STORE_MANAGER,
    RoleEnums.STORE_OWNER,
    RoleEnums.STAFF,
  ],
  '/inventory/*': [
    RoleEnums.STORE_MANAGER,
    RoleEnums.STORE_OWNER,
    RoleEnums.PUBLISHER,
    RoleEnums.STAFF,
  ],
  '/store-schedules/*': [
    RoleEnums.STORE_MANAGER,
    RoleEnums.STORE_OWNER,
    RoleEnums.STAFF,
  ],
};

const schemasRoleToken =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/**
 * Validates if a token has a valid role
 * @param token JWT token
 * @returns Object with validation result and role if valid
 */
function validateTokenRole(token: string): {
  isValid: boolean;
  userRole?: RoleEnums;
} {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);

    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      return { isValid: false };
    }

    // Check if role claim exists and is valid
    if (
      !decodedToken[schemasRoleToken] ||
      !Object.values(RoleEnums).includes(decodedToken[schemasRoleToken])
    ) {
      return { isValid: false };
    }

    return {
      isValid: true,
      userRole: decodedToken[schemasRoleToken],
    };
  } catch (error) {
    console.log('Token validation error:', error);
    return { isValid: false };
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication status
  const tokenCookie = request.cookies.get(STORAGE.token);
  const isAuthenticated = !!tokenCookie?.value;

  // Check if the requested path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Handle root path redirection
  if (pathname === PATH.HOME) {
    if (isAuthenticated) {
      // Validate token and role
      const { isValid, userRole } = validateTokenRole(tokenCookie.value);

      if (!isValid) {
        // Invalid token or missing role - clear cookie and redirect to login
        const response = NextResponse.redirect(
          new URL(PATH.LOGIN, request.url)
        );
        response.cookies.delete(STORAGE.token);
        return response;
      }

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
        case RoleEnums.PUBLISHER:
          return NextResponse.redirect(new URL(PATH.BOOKS, request.url));
        case RoleEnums.STAFF:
          return NextResponse.redirect(new URL(PATH.EVENT_DATE, request.url));
        default:
          // Should not reach here due to validation, but handle just in case
          const response = NextResponse.redirect(
            new URL(PATH.LOGIN, request.url)
          );
          response.cookies.delete(STORAGE.token);
          return response;
      }
    } else {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url));
    }
  }

  // If authenticated and trying to access auth pages, redirect to appropriate dashboard
  if (isAuthenticated && isPublicPath) {
    const { isValid, userRole } = validateTokenRole(tokenCookie.value);

    if (!isValid) {
      // Invalid token or missing role - clear cookie and redirect to login with error message
      const loginUrl = new URL(PATH.LOGIN, request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(STORAGE.token);
      return response;
    }

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
      case RoleEnums.PUBLISHER:
        return NextResponse.redirect(new URL(PATH.BOOKS, request.url));
      case RoleEnums.STAFF:
        return NextResponse.redirect(new URL(PATH.EVENT_DATE, request.url));
      default:
        // Should not reach here due to validation, but handle just in case
        const response = NextResponse.redirect(
          new URL(PATH.LOGIN, request.url)
        );
        response.cookies.delete(STORAGE.token);
        return response;
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
    const { isValid, userRole } = validateTokenRole(tokenCookie.value);

    if (!isValid) {
      // Invalid token or missing role - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL(PATH.LOGIN, request.url));
      response.cookies.delete(STORAGE.token);
      return response;
    }

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

    if (userRole) {
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        // Redirect to unauthorized page
        return NextResponse.redirect(new URL(PATH.UNAUTHORIZED, request.url));
      }
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
     * 5. /favicon.ico, sitemap.xml, robots.txt (public files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
