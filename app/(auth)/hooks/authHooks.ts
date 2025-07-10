import { useMutation } from '@tanstack/react-query';
import { LoginRequest, SignupRequest, AuthResponse } from '../utils/types';
import apiClient from '../../configs/axiosConfigs';
import Cookies from 'js-cookie';
import axios from 'axios';

// Enhanced error type for better error handling
interface ApiError extends Error {
  statusCode?: number;
  response?: {
    status: number;
    data: any;
  };
}

/**
 * Custom hook for handling user login
 * @returns Mutation hook for login functionality
 */
export const useLogin = () => {
    return useMutation<AuthResponse, ApiError, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            try {
                const response = await apiClient.post<AuthResponse>('/login', credentials);
                if (!response.data || typeof response.data === 'string') {
                    throw new Error('Invalid response from server');
                }
                return response.data;
            } catch (error) {
                // Enhanced error handling
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || 
                                        (error.response?.status === 401 ? 'Invalid email or password' : 
                                         'An error occurred during login');
                    
                    // Create a more detailed error object
                    const apiError = new Error(errorMessage) as ApiError;
                    apiError.statusCode = error.response?.status;
                    apiError.response = error.response;
                    
                    throw apiError;
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            // Access the user property which contains user data
            const userData = data.user;
            console.log("Login response data:", data);
            console.log("User data from response:", userData);
            
            // Handle both userId and userid (backend inconsistency)
            const userId = userData?.userId || userData?.userid;
            
            if (userData && userData.email && userId && userData.username) {
                // Store user session data in cookies - exclude password
                const userDataToStore = {
                    email: userData.email,
                    userId: userId, // Use the extracted userId
                    username: userData.username
                };

                console.log("Setting cookies with data:", userDataToStore);

                // Set user data in a cookie
                Cookies.set('userData', JSON.stringify(userDataToStore), {
                    expires: 7, // Expires in 7 days
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/'
                });

                // Set a simpler auth flag for middleware to check quickly
                Cookies.set('isAuthenticated', 'true', {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/'
                });

                // Verify cookies were set
                console.log("Cookies after setting:", {
                    userData: Cookies.get('userData'),
                    isAuthenticated: Cookies.get('isAuthenticated')
                });
            } else {
                console.error("Login response missing user data", data);
                console.error("Missing fields:", {
                    email: !!userData?.email,
                    userId: !!userId,
                    username: !!userData?.username
                });
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
        }
    });
};

/**
 * Custom hook for handling user signup
 * @returns Mutation hook for signup functionality
 */
export const useSignup = () => {
    return useMutation<AuthResponse, ApiError, SignupRequest>({
        mutationFn: async (signupData: SignupRequest) => {
            try {
                const response = await apiClient.post<AuthResponse>('/register_user', signupData);
                return response.data;
            } catch (error) {
                // Enhanced error handling similar to login
                if (axios.isAxiosError(error)) {
                    const errorMessage = error.response?.data?.message || 
                                        'An error occurred during registration';
                    
                    const apiError = new Error(errorMessage) as ApiError;
                    apiError.statusCode = error.response?.status;
                    apiError.response = error.response;
                    
                    throw apiError;
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            // Access the user property which contains user data
            const userData = data.user;

            if (userData && userData.email && userData.userId && userData.username) {
                // Store user session data in cookies - exclude password
                const userDataToStore = {
                    email: userData.email,
                    userId: userData.userId,
                    username: userData.username
                };

                // Set user data in a cookie
                Cookies.set('userData', JSON.stringify(userDataToStore), {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/'
                });

                // Set a simpler auth flag for middleware
                Cookies.set('isAuthenticated', 'true', {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/'
                });
            } else {
                console.error("Signup response missing user data", data);
            }
        },
        onError: (error) => {
            console.error("Signup error:", error);
        }
    });
};

/**
 * Custom hook to check if user is logged in
 * @returns Boolean indicating if user is authenticated
 */
export const useIsAuthenticated = () => {
    return !!Cookies.get('isAuthenticated');
};

/**
 * Function to get current user data from cookies
 * @returns User data object or null if not logged in
 */
export const getCurrentUser = () => {
    const userDataCookie = Cookies.get('userData');
    if (!userDataCookie) return null;

    try {
        return JSON.parse(userDataCookie);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Function to log out the current user
 */
export const logout = () => {
    // Clear all authentication cookies
    Cookies.remove('userData');
    Cookies.remove('isAuthenticated');
    Cookies.remove('currentBrandData');
    
    // Clear localStorage items
    try {
        localStorage.removeItem('brandingFormData');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};


