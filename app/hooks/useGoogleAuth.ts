import { useMutation } from '@tanstack/react-query';
import axios from '../configs/axiosConfigs';
import { toast } from 'react-hot-toast';

interface GoogleAuthResponse {
    success: boolean;
    message: string;
    auth_url?: string;
    state?: string;
    user?: {
        userId: string;
        username: string;
        email: string;
        profile_picture?: string;
        auth_provider: string;
    };
}

interface GoogleTokenAuthRequest {
    id_token: string;
}

// Initialize Google OAuth flow
const initiateGoogleAuth = async (): Promise<GoogleAuthResponse> => {
    try {
        const response = await axios.get('/auth/google');
        return response.data;
    } catch (error) {
        console.error('Error initiating Google auth:', error);
        if ((error as any)?.isAxiosError) {
            const axiosError = error as any;
            throw new Error(axiosError.response?.data?.message || 'Failed to initiate Google authentication');
        }
        throw new Error('Network error occurred');
    }
};

// Authenticate with Google ID token
const authenticateWithGoogleToken = async (idToken: string): Promise<GoogleAuthResponse> => {
    try {
        const response = await axios.post('/auth/google/token', {
            id_token: idToken
        });
        return response.data;
    } catch (error) {
        console.error('Error authenticating with Google token:', error);
        if ((error as any)?.isAxiosError) {
            const axiosError = error as any;
            throw new Error(axiosError.response?.data?.message || 'Failed to authenticate with Google');
        }
        throw new Error('Network error occurred');
    }
};

export const useGoogleAuth = () => {
    const initiateAuth = useMutation({
        mutationFn: initiateGoogleAuth,
        onSuccess: (data) => {
            if (data.success && data.auth_url) {
                // Redirect to Google OAuth URL
                window.location.href = data.auth_url;
            } else {
                toast.error(data.message || 'Failed to initiate Google authentication');
            }
        },
        onError: (error) => {
            console.error('Google auth initiation failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to initiate Google authentication');
        },
    });

    const authenticateWithToken = useMutation({
        mutationFn: authenticateWithGoogleToken,
        onSuccess: (data) => {
            if (data.success && data.user) {
                // Store user data in cookies/localStorage
                const userData = {
                    userId: data.user.userId,
                    username: data.user.username,
                    email: data.user.email,
                    profile_picture: data.user.profile_picture,
                    auth_provider: data.user.auth_provider,
                };

                // Store in localStorage for now (you might want to use cookies)
                localStorage.setItem('userData', JSON.stringify(userData));

                toast.success(data.message || 'Authentication successful');

                // Redirect to dashboard or form
                window.location.href = '/form';
            } else {
                toast.error(data.message || 'Authentication failed');
            }
        },
        onError: (error) => {
            console.error('Google token authentication failed:', error);
            toast.error(error instanceof Error ? error.message : 'Authentication failed');
        },
    });

    return {
        initiateAuth,
        authenticateWithToken,
    };
}; 