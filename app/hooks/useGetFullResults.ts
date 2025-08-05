import { useMutation } from '@tanstack/react-query';
import axios from '../configs/axiosConfigs';

interface FullBrandResponse {
    success: boolean;
    message: string;
    full_brand: {
        brand: any;
        brand_assets: any;
        social_media_content: any;
    };
}

const callGetFullResultsAPI = async (brandId: string): Promise<FullBrandResponse> => {
    try {
        const response = await axios.get(`/get_full_brand/${brandId}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching full brand results:', error);
        throw new Error('Failed to fetch full brand results');
    }
};

export const useGetFullResults = () => {
    const getFullResults = useMutation({
        mutationFn: callGetFullResultsAPI,
        onSuccess: (data) => {
            console.log('Full brand results fetched successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to fetch full brand results:', error);
        },
    });
    return { getFullResults };
}; 