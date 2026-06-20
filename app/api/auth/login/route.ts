import { NextRequest, NextResponse } from 'next/server';
import { signSessionToken, SESSION_COOKIE_OPTIONS } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: { password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const { password } = body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Server is not configured. ADMIN_PASSWORD is missing.' },
      { status: 500 }
    );
  }

  if (!password || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Password is required.' },
      { status: 400 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: 'Incorrect password.' },
      { status: 401 }
    );
  }

  const token = await signSessionToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE_OPTIONS.name,
    value: token,
    httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
    secure: SESSION_COOKIE_OPTIONS.secure,
    sameSite: SESSION_COOKIE_OPTIONS.sameSite,
    path: SESSION_COOKIE_OPTIONS.path,
    maxAge: SESSION_COOKIE_OPTIONS.maxAge,
  });

  return response;
}
