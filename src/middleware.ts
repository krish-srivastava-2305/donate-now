import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = ['/signin', '/signup', '/'].includes(path);

  const token = request.cookies.get('token')?.value;

  if (token) {
    try {
      const decodedToken = jwt.decode(token) as { id: string; isDonor: boolean } | null;

      if (decodedToken) {
        if (isPublicPath && decodedToken.isDonor) {
          return NextResponse.redirect(new URL('/requests', request.nextUrl));
        }

        if (isPublicPath && !decodedToken.isDonor) {
          return NextResponse.redirect(new URL('/products', request.nextUrl));
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/signin',
    '/signup',
    '/products',
    '/requests',
    '/donor_settings',
  ],
};
