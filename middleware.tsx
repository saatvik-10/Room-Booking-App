import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const isAuth = false;

  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', req.nextUrl).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bookings'],
};
