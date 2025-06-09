import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes should be protected
const protectedRoutes = [
  '/dashboard',
  '/profile',
  'form'
  // Add other protected routes here
];

// Define routes that are public (no auth needed)
const authRoutes = ['/login', '/register', '/forgot-password', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware processing: ${pathname}`);
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if we're on an auth page
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if user is authenticated by looking for the auth cookie
  const isAuthenticated = request.cookies.has('isAuthenticated');
  console.log(`User authenticated: ${isAuthenticated}, Protected route: ${isProtectedRoute}`);
  
  // If trying to access protected route without being logged in
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`Redirecting to login from ${pathname}`);
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // If trying to access login/signup while already logged in
  if (isAuthRoute && isAuthenticated) {
    console.log(`Redirecting to dashboard from ${pathname}`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Continue to the requested page
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     * - api routes (API endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};