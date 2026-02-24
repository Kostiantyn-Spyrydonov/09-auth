import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/notes', '/profile'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const isAuthenticated = !!(accessToken || refreshToken);

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export { proxy };

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
