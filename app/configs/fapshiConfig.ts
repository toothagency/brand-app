import Axios from 'axios';

// Fapshi Configuration
const FAPSHI_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_FAPSHI_API_URL || 'https://live.fapshi.com', // Change to 'https://fapshi.com' for production
    apiKey: process.env.NEXT_PUBLIC_FAPSHI_API_KEY || '',
    apiUser: process.env.NEXT_PUBLIC_FAPSHI_API_USER || '',
    mode: 'live', // Change to 'live' for production
    currency: 'XAF',
    paymentCountry: 'CM', // Cameroon
};

// Create Fapshi-specific axios instance
const fapshiAxios = Axios.create({
    baseURL: FAPSHI_CONFIG.baseURL,
});

// Add request interceptor for Fapshi requests
fapshiAxios.interceptors.request.use(
    (config) => {
        console.log('🟡 FAPSHI REQUEST:', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            data: config.data,
            headers: config.headers,
            timestamp: new Date().toISOString(),
        });
        return config;
    },
    (error) => {
        console.error('❌ FAPSHI REQUEST ERROR:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for Fapshi responses
fapshiAxios.interceptors.response.use(
    (response) => {
        console.log('🟢 FAPSHI RESPONSE:', {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            data: response.data,
            timestamp: new Date().toISOString(),
        });
        return response;
    },
    (error) => {
        console.error('🔴 FAPSHI RESPONSE ERROR:', {
            message: error.message,
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            timestamp: new Date().toISOString(),
        });
        return Promise.reject(error);
    }
);

// Fapshi API Functions
export const fapshiAPI = {
    // Initialize payment and get payment link
    initiatePayment: async (data: {
        amount: number;
        email?: string;
        redirectUrl?: string;
        userId?: string;
        externalId?: string;
        message?: string;
    }) => {
        try {
            const requestData = {
                amount: data.amount,
                ...(data.email && { email: data.email }),
                ...(data.redirectUrl && { redirectUrl: data.redirectUrl }),
                ...(data.userId && { userId: data.userId }),
                ...(data.externalId && { externalId: data.externalId }),
                ...(data.message && { message: data.message })
            };

            const response = await fapshiAxios.post('/initiate-pay', requestData, {
                headers: {
                    'apiuser': FAPSHI_CONFIG.apiUser,
                    'apikey': FAPSHI_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            console.error('Fapshi initiate payment error:', error);
            
            if (error.response) {
                // Handle 4XX error responses
                console.error('Fapshi error response:', error.response.data);
                return {
                    success: false,
                    error: error.response.data.message || `Payment initiation failed (${error.response.status})`
                };
            }
            
            throw error;
        }
    },

    // Get payment status
    getPaymentStatus: async (transId: string) => {
        try {
            const response = await fapshiAxios.get(`/payment-status/${transId}`, {
                headers: {
                    'apiuser': FAPSHI_CONFIG.apiUser,
                    'apikey': FAPSHI_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            // Handle array response format
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0]; // Return the first transaction
            }
            
            return response.data;
        } catch (error: any) {
            console.error('Fapshi get payment status error:', error);
            
            if (error.response) {
                // Handle 4XX error responses
                console.error('Fapshi error response:', error.response.data);
                throw new Error(error.response.data.message || `HTTP error! status: ${error.response.status}`);
            }
            
            throw error;
        }
    },
};

export default fapshiAPI;
