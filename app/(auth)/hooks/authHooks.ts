import { useMutation } from '@tanstack/react-query';
import { LoginRequest, SignupRequest, AuthResponse } from '../utils/types';
import apiClient from '../../configs/axiosConfigs';

/**
 * Custom hook for handling user login
 * @returns Mutation hook for login functionality
 */
export const useLogin = () => {
    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            // Store token in localStorage or secure storage
            localStorage.setItem('authToken', data.token);
        },
    });
};

/**
 * Custom hook for handling user signup
 * @returns Mutation hook for signup functionality
 */
export const useSignup = () => {
    return useMutation<AuthResponse, Error, SignupRequest>({
        mutationFn: async (userData: SignupRequest) => {
            const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
            return response.data;
        },
        onSuccess: (data) => {
            // Store token in localStorage or secure storage
            localStorage.setItem('authToken', data.token);
        },
    });
};
