// hooks/useClientAuth.ts
"use client";

import { useState, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from './authHooks'; // Adjust the import path as needed

// Define the User type based on your cookie data
interface User {
  email: string;
  userId: string;
  username: string;
  initials: string; // We'll add this for the avatar
  referral_code: string;
}

export const useClientAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs on the client after the component mounts
    const userData = getCurrentUser();
    
    if (userData) {
      // Create initials from the username for the avatar
      const initials = (userData.username || 'U')
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
        
      setUser({ ...userData, initials });
    }
    
    // Finished checking for user
    setIsLoading(false);
  }, []);

  const logout = () => {
    apiLogout(); // Call the function from authHooks to clear cookies
    setUser(null); // Update the state in React to immediately reflect the change in the UI
    // Optional: Force a reload or redirect to ensure a clean state
    window.location.href = '/'; 
  };

  return { user, isLoading, logout };
};