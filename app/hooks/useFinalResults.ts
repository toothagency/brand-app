import { useMutation } from '@tanstack/react-query';
import axios from '../configs/axiosConfigs';

interface FinalResultsRequest {
  userId: string;
  brandId: string;
  userName: string;
  userEmail: string;
  userPhoneNumbers?: string;
  registrationNumber?: string;
  website?: string;
  brandLogo?: string;
  others?: Record<string, any>;
}

interface FinalResultsResponse {
  success: boolean;
  message: string;
  results: any;
}

const callFinalResultsAPI = async (data: FinalResultsRequest): Promise<FinalResultsResponse> => {
  try {
    console.log('Calling backend endpoint with data:', data);

    // Replace this URL with your actual backend URL

    const response = await axios.post(`/get_final_results`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error calling final results API:', error);

    // Properly check if error is an AxiosError
    if ((error as any)?.isAxiosError) {
      const axiosError = error as any;
      throw new Error(axiosError.response?.data?.message || 'Failed to generate final results');
    }

    throw new Error('Network error occurred');
  }
};

export const useFinalResults = () => {
  return useMutation({
    mutationFn: callFinalResultsAPI,
    onSuccess: (data) => {
      console.log('Final results generated successfully:', data);
    },
    onError: (error) => {
      console.error('Final results generation failed:', error);
    },
  });
}; 