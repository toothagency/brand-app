import { useMutation } from '@tanstack/react-query';
import axios from '../configs/axiosConfigs';

interface GetBrandResponse {
    success: boolean;
    message: string;
    brand_results: any; // This will be the brand data
}

const callGetBrandAPI = async (brandId: string): Promise<GetBrandResponse> => {
    try {
        console.log('Calling get brand API with brandId:', brandId);

        const response = await axios.get(`/get_brand_results/${brandId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Get brand API response:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error calling get brand API:', error);

        if ((error as any)?.isAxiosError) {
            const axiosError = error as any;
            throw new Error(axiosError.response?.data?.message || 'Failed to fetch brand data');
        }

        throw new Error('Network error occurred');
    }
};

export const useGetBrand = () => {
    const getBrand = useMutation({
        mutationFn: callGetBrandAPI,
        onSuccess: (data) => {
            console.log('Brand data fetched successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to fetch brand data:', error);
        },
    });

    return {
        getBrand,
    };
}; 