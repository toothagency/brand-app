"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import apiClient from '../configs/axiosConfigs';
import { getCurrentUser } from '../(auth)/hooks/authHooks';

// Brand type definition based on the API response
export interface Brand {
  answerId: string;
  brand_communication: string;
  brand_identity: string;
  brand_strategy: string;
  id: string;
  logo: string;
  marketing_and_social_media_strategy: string;
  name: string;
  userId: string;
}

interface BrandContextType {
  brand: Brand | null;
  setBrand: (brand: Brand | null) => void;
  createBrand: () => Promise<Brand | null>;
  isLoading: boolean;
  error: Error | null;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to create a new brand
  const createBrand = async (): Promise<Brand | null> => {
    const currentUser = getCurrentUser();
    if (!currentUser?.userId) {
      setError(new Error('User not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/create_brand', {
        userId: currentUser.userId
      });
      
      const newBrand = response.data;
      console.log('Brand created successfully:', newBrand);
      
      // Store the brand in state
      setBrand(newBrand);
      return newBrand;
    } catch (err) {
      console.error('Failed to create brand:', err);
      setError(err instanceof Error ? err : new Error('Failed to create brand'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    brand,
    setBrand,
    createBrand,
    isLoading,
    error
  };

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

// Custom hook to use the brand context
export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};