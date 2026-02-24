import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const PRIVATE_ROUTES = ['/notes', '/profile'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;

  if (!isAuthenticated && refreshToken) {
    try {
      const response = await checkSession();
      if (response.data.success) {
        isAuthenticated = true;
        const nextResponse = isAuthRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
          cookieArray.forEach((cookie) => {
            nextResponse.headers.append('Set-Cookie', cookie);
          });
        }
        return nextResponse;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export { proxy };

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
