'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

export function useSyncSessionWithCookies() {
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      Cookies.set('userSession', 'true');
    } else {
      Cookies.remove('userSession');
    }
  }, []);
}