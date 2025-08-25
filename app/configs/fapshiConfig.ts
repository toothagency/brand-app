// Fapshi Configuration
const FAPSHI_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_FAPSHI_API_URL || 'https://live.fapshi.com', // Change to 'https://fapshi.com' for production
    apiKey: process.env.NEXT_PUBLIC_FAPSHI_API_KEY || '',
    apiUser: process.env.NEXT_PUBLIC_FAPSHI_API_USER || '',
    mode: 'live', // Change to 'live' for production
    currency: 'XAF',
    paymentCountry: 'CM', // Cameroon
};

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
                // ...(data.email && { email: data.email }),
                ...(data.redirectUrl && { redirectUrl: data.redirectUrl }),
                // // ...(data.userId && { userId: data.userId }),
                // // ...(data.externalId && { externalId: data.externalId }),
                ...(data.message && { message: data.message })
            };

            console.log('🟡 FAPSHI REQUEST:', {
                method: 'POST',
                url: `${FAPSHI_CONFIG.baseURL}/initiate-pay`,
                data: requestData,
                headers: {
                    'apiuser': FAPSHI_CONFIG.apiUser,
                    'apikey': FAPSHI_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                },
                timestamp: new Date().toISOString(),
            });

            const response = await fetch(`${FAPSHI_CONFIG.baseURL}/initiate-pay`, {
                method: 'POST',
                headers: {
                    'apiuser': FAPSHI_CONFIG.apiUser,
                    'apikey': FAPSHI_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const responseData = await response.json();
            
            console.log('🟢 FAPSHI RESPONSE:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                data: responseData,
                timestamp: new Date().toISOString(),
            });

            if (response.ok) {
                return {
                    success: true,
                    data: responseData
                };
            } else {
                // Handle 4XX error responses
                console.error('Fapshi error response:', responseData);
                return {
                    success: false,
                    error: responseData.message || `Payment initiation failed (${response.status})`
                };
            }
        } catch (error: any) {
            console.error('Fapshi initiate payment error:', error);
            throw error;
        }
    },

    // Get payment status
    getPaymentStatus: async (transId: string) => {
        try {
            console.log('🟡 FAPSHI REQUEST:', {
                method: 'GET',
                url: `${FAPSHI_CONFIG.baseURL}/payment-status/${transId}`,
                headers: {
                    'apiuser': FAPSHI_CONFIG.apiUser,
                    'apikey': FAPSHI_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                },
                timestamp: new Date().toISOString(),
            });

            const response = await fetch(`${FAPSHI_CONFIG.baseURL}/payment-status/${transId}`, {
                method: 'GET',
                headers: {
                    'apiuser': FAPSHI_CONFIG.apiUser,
                    'apikey': FAPSHI_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            
            console.log('🟢 FAPSHI RESPONSE:', {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                data: responseData,
                timestamp: new Date().toISOString(),
            });
            
            if (response.ok) {
                // Handle array response format
                if (Array.isArray(responseData) && responseData.length > 0) {
                    return responseData[0]; // Return the first transaction
                }
                
                return responseData;
            } else {
                // Handle 4XX error responses
                console.error('Fapshi error response:', responseData);
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
            }
        } catch (error: any) {
            console.error('Fapshi get payment status error:', error);
            throw error;
        }
    },
};

export default fapshiAPI;
