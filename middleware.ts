// Next.js middleware runs on the edge before every request.
// Protects all /admin/* routes except /admin/login.

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
);

const PROTECTED_PREFIX = '/admin';
const LOGIN_PATH = '/admin/login';
const COOKIE_NAME = 'admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process /admin/* paths
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  // Allow access to login page always
  if (pathname === LOGIN_PATH) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        // Already authenticated → send to dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {
        // Token invalid, let them see login page
      }
    }
    return NextResponse.next();
  }

  // Verify session for all other /admin/* paths
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginURL = new URL(LOGIN_PATH, request.url);
    loginURL.searchParams.set('from', pathname);
    return NextResponse.redirect(loginURL);
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const loginURL = new URL(LOGIN_PATH, request.url);
    loginURL.searchParams.set('from', pathname);
    return NextResponse.redirect(loginURL);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
