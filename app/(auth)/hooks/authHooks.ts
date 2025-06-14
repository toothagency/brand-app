import { useMutation } from '@tanstack/react-query';
import { LoginRequest, SignupRequest, AuthResponse } from '../utils/types';
import apiClient from '../../configs/axiosConfigs';
import Cookies from 'js-cookie';

/**
 * Custom hook for handling user login
 * @returns Mutation hook for login functionality
 */
export const useLogin = () => {
    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            const response = await apiClient.post<AuthResponse>('/login', credentials);
            if (!response.data || typeof response.data === 'string') {
                throw new Error('Invalid response from server');
            }
            return response.data;
        },
        onSuccess: (data) => {
            // Access the user property which contains user data
            const userData = data.user;
            console.log(data)
            if (userData && userData.email && userData.userId && userData.username) {
                // Store user session data in cookies - exclude password
                const userDataToStore = {
                    email: userData.email,
                    userId: userData.userId,
                    username: userData.username
                };

                // Set user data in a cookie
                Cookies.set('userData', JSON.stringify(userDataToStore), {
                    expires: 7, // Expires in 7 days
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });

                // Set a simpler auth flag for middleware to check quickly
                Cookies.set('isAuthenticated', 'true', {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
            } else {
                console.error("Login response missing user data", data);
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
    return useMutation<AuthResponse, Error, SignupRequest>({
        mutationFn: async (signupData: SignupRequest) => {
            const response = await apiClient.post<AuthResponse>('/register_user', signupData);
            return response.data;
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
                    sameSite: 'lax'
                });

                // Set a simpler auth flag for middleware
                Cookies.set('isAuthenticated', 'true', {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
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
    Cookies.remove('userData');
    Cookies.remove('isAuthenticated');
};
