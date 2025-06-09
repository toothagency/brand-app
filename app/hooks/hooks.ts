import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../configs/axiosConfigs';
import { getCurrentUser } from '../(auth)/hooks/authHooks';

// Types
interface CreateBrandResponse {
  brandId: string;
  userId: string;
  name?: string;
  answerId?: string;
  // Add other brand properties as needed
}

interface CreateBrandRequest {
  userId: string;
}

interface UserBrandsResponse {
  userId: string;
  brands: Array<{
    brandId: string;
    name?: string;
    // Add other brand properties as needed
  }>;
}

/**
 * Custom hook for creating a new brand
 * @returns Mutation hook for brand creation functionality
 */
export const useCreateBrand = () => {
  return useMutation<CreateBrandResponse, Error, CreateBrandRequest>({
    mutationFn: async (data) => {
      console.log('Creating new brand for user:', data.userId);
      const response = await apiClient.post<CreateBrandResponse>('/create_brand', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Brand created successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to create brand:', error);
    }
  });
};

/**
 * Custom hook to fetch all brands for the current user
 * @returns Query result with user's brands
 */
export const useUserBrands = () => {
  const currentUser = getCurrentUser();
  const userId = currentUser?.userId;

  return useQuery<UserBrandsResponse, Error>({
    queryKey: ['userBrands', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await apiClient.post<UserBrandsResponse>('/user_brands', { userId }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    },
    enabled: !!userId, // Only run the query if userId exists
  });
};

/**
 * Custom hook to fetch a specific brand by ID
 * @param brandId - The ID of the brand to fetch
 * @returns Query result with brand data
 */
export const useBrand = (brandId: string | null) => {
  return useQuery<CreateBrandResponse, Error>({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      if (!brandId) {
        throw new Error('Brand ID is required');
      }
      
      const response = await apiClient.post<CreateBrandResponse>('/brand', { brandId }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    },
    enabled: !!brandId, // Only run the query if brandId exists
  });
};