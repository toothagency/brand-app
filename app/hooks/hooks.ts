import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../configs/axiosConfigs';
import { getCurrentUser } from '../(auth)/hooks/authHooks';
import { Brand } from '../contexts/BrandContext';
import { DetailedBrandObject } from '../(protected)/form/utils/types';

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
  brands: DetailedBrandObject[];
}

interface DeleteBrandRequest {
  brandId: string;
  userId: string;
}

interface DeleteBrandResponse {
  success: boolean;
  message: string;
}

interface DownloadBrandRequest {
  brandId: string;
  userId: string;
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

/**
 * Custom hook to delete a brand
 * @returns Mutation hook for brand deletion functionality
 */
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteBrandResponse, Error, DeleteBrandRequest>({
    mutationFn: async (data) => {
      console.log('Deleting brand:', data.brandId);
      const response = await apiClient.post<DeleteBrandResponse>('/delete_brand', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Brand deleted successfully:', data);
      // Invalidate and refetch user brands
      queryClient.invalidateQueries({ queryKey: ['userBrands'] });
    },
    onError: (error) => {
      console.error('Failed to delete brand:', error);
    }
  });
};

/**
 * Custom hook to download a brand as PDF
 * @returns Mutation hook for brand download functionality
 */
export const useDownloadBrand = () => {
  return useMutation<Blob, Error, DownloadBrandRequest>({
    mutationFn: async (data) => {
      console.log('Downloading brand:', data.brandId);
      const response = await apiClient.post('/download_brand', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (blob) => {
      console.log('Brand downloaded successfully');
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brand-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Failed to download brand:', error);
    }
  });
};