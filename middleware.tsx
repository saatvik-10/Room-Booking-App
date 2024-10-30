import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log(`Requested to ${pathname}`);

  return NextResponse.next();
}

export const config = {
    matcher:['/login']
};
