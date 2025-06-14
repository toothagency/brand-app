// src/hooks/useBrandingFormQueries.ts (adjust path as needed)
import { useMutation, UseMutationResult, UseMutationOptions } from '@tanstack/react-query';
import axiosInstance from '../../../configs/axiosConfigs'; // UPDATE THIS PATH
import { DetailedBrandObject } from '../utils/types';

// --- TYPE DEFINITIONS ---
export interface SubmitAnswerPayload {
  question: number; 
  section: number;  
  answer: string | string[] | undefined;
  userId: string;
  brandId: string;
}

export interface SubmitAnswerResponse {
  error: boolean;
  message: string;
}

export interface FetchSuggestionsPayload {
  question: number; 
  section: number;  
  brandId: string;
  userId: string;
}

// This type represents the actual JSON body returned by your /get_suggestions endpoint
export interface SuggestionsResponseBody { 
  question: number;
  section: number;
  suggestions: string[];
  userId: string;
  // any other fields at this top level of the response body
}

// Brand creation types
export interface BrandObject {
  id: string; 
  answerId?: string; 
  brand_communication?: string;
  brand_identity?: string;
  brand_strategy?: string;
  logo?: string;
  marketing_and_social_media_strategy?: string;
  name?: string;
  userId: string;
}
export interface CreateBrandResponse {
  success: boolean;
  message: string;
  brand: BrandObject;
}
export interface CreateBrandRequest {
  userId: string;
}

// --- API FUNCTIONS ---
const submitAnswerAPI = async (payload: SubmitAnswerPayload): Promise<SubmitAnswerResponse> => {
  const response = await axiosInstance.post<SubmitAnswerResponse>('/send_answer', payload); // REPLACE ENDPOINT
  return response.data;
};

export const fetchBrandingSuggestionsAPI = async (payload: FetchSuggestionsPayload): Promise<string[]> => {
  // The generic <SuggestionsResponseBody> tells Axios what structure to expect for `response.data`
  const response = await axiosInstance.post<SuggestionsResponseBody>('/get_suggestions', payload); // REPLACE ENDPOINT
  
  console.log("fetchBrandingSuggestionsAPI - Axios response.data:", response.data);

  // Now, response.data directly IS the object that should contain the 'suggestions' array
  if (response.data && Array.isArray(response.data.suggestions)) {
    return response.data.suggestions;
  }
  
  console.warn("fetchBrandingSuggestionsAPI: 'suggestions' array not found or invalid in response.data.", response.data);
  return []; 
};

const createBrandAPI = async (payload: CreateBrandRequest): Promise<CreateBrandResponse> => {
  const response = await axiosInstance.post<CreateBrandResponse>('/create_brand', payload, { // REPLACE ENDPOINT
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });
  if (!response.data || !response.data.brand || typeof response.data.brand.id !== 'string' || !response.data.brand.id) {
    throw new Error("Backend did not return a valid brand structure with a brand ID.");
  }
  return response.data;
};


const fetchBrandResultsAPI = async (userId: string, brandId: string): Promise<DetailedBrandObject> => { // <--- RETURN TYPE IS DetailedBrandObject
  const response = await axiosInstance.post<DetailedBrandObject>(`/get_results`, { userId: userId, brandId: brandId }); // Expect DetailedBrandObject
  if (!response.data?.brandId) { // Check a key property of DetailedBrandObject
    throw new Error("Backend did not return a valid detailed brand object with brandId.");
  }
  return response.data;
};
// --- REACT QUERY HOOKS ---
export const useSubmitBrandingAnswer = (
  hookOptions?: Omit<UseMutationOptions<SubmitAnswerResponse, Error, SubmitAnswerPayload>, 'mutationFn'>
): UseMutationResult<SubmitAnswerResponse, Error, SubmitAnswerPayload> => {
  const defaultMutationOptions: Partial<UseMutationOptions<SubmitAnswerResponse, Error, SubmitAnswerPayload>> = {
    onSuccess: (data) => console.log('RQ Hook (SubmitAnswer) - Success:', data),
    onError: (error) => console.error('RQ Hook (SubmitAnswer) - Error:', error.message),
  };
  const mutationConfig: UseMutationOptions<SubmitAnswerResponse, Error, SubmitAnswerPayload> = {
    mutationFn: submitAnswerAPI, ...defaultMutationOptions, ...hookOptions,
  };
  return useMutation(mutationConfig);
};

export const useCreateBrand = (
  hookOptions?: Omit<UseMutationOptions<CreateBrandResponse, Error, CreateBrandRequest>, 'mutationFn'>
): UseMutationResult<CreateBrandResponse, Error, CreateBrandRequest> => {
  const defaultOptions: Partial<UseMutationOptions<CreateBrandResponse, Error, CreateBrandRequest>> = {
    onSuccess: (data) => console.log('RQ Hook (CreateBrand) - Success:', data),
    onError: (error) => console.error('RQ Hook (CreateBrand) - Error:', error.message),
  };
  const mutationConfig: UseMutationOptions<CreateBrandResponse, Error, CreateBrandRequest> = {
    mutationFn: createBrandAPI, ...defaultOptions, ...hookOptions,
  };
  return useMutation(mutationConfig);
};

export const useGetBrandResults = (
  userId: string,
  hookOptions?: Omit<UseMutationOptions<DetailedBrandObject, Error, { brandId: string }>, 'mutationFn'> // <--- TData IS DetailedBrandObject
): UseMutationResult<DetailedBrandObject, Error, { brandId: string }> => { // <--- UseMutationResult also uses DetailedBrandObject
  const defaultOptions: Partial<UseMutationOptions<DetailedBrandObject, Error, { brandId: string }>> = {
    // onSuccess and onError can be handled in the component if preferred
    // onSuccess: (data) => console.log('RQ Hook (GetBrandResults) - Success:', data),
    // onError: (error) => console.error('RQ Hook (GetBrandResults) - Error:', error.message),
  };
  const mutationConfig: UseMutationOptions<DetailedBrandObject, Error, { brandId: string }> = { // <--- Use DetailedBrandObject
    mutationFn: async ({ brandId }) => {
        if (!userId) throw new Error("User ID is required for fetching results.");
        return fetchBrandResultsAPI(userId, brandId);
    },
    ...defaultOptions,
    ...hookOptions,
  };
  return useMutation(mutationConfig);
};