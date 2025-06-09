'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Check authentication using cookies
    const isAuthenticated = !!Cookies.get('isAuthenticated');
    
    // If not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !pathname.includes('/login') && !pathname.includes('/signup')) {
      router.push('/login');
    }
  }, [pathname, router]);

  // The middleware should prevent this component from even loading for 
  // unauthenticated users, but this provides a backup
  return <>{children}</>;
}