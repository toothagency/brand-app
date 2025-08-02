import axios from './axiosConfigs';

// PayUnit Configuration
const PAYUNIT_CONFIG = {
    baseURL: 'https://gateway.payunit.net',
    apiKey: process.env.NEXT_PUBLIC_PAYUNIT_API_KEY || '',
    mode: 'test', // Change to 'live' for production
    currency: 'XAF',
    paymentCountry: 'CM', // Cameroon
};

// PayUnit Authentication
const getAuthHeaders = () => {
    // For now, using API key authentication
    // You can add API_USER and API_PASSWORD to env vars if needed
    // Note: The curl example shows Authorization header, but we're using x-api-key for now
    return {
        'x-api-key': PAYUNIT_CONFIG.apiKey,
        'mode': PAYUNIT_CONFIG.mode,
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PAYUNIT_API_USER}:${process.env.NEXT_PUBLIC_PAYUNIT_API_PASSWORD}`)}`,
    };
};

// PayUnit API Functions
export const payunitAPI = {
    // Initialize a payment transaction
    initializePayment: async (data: {
        total_amount: number;
        transaction_id: string;
        return_url: string;
        notify_url?: string;
    }) => {
        try {
            const response = await axios.post(
                `${PAYUNIT_CONFIG.baseURL}/api/gateway/initialize`,
                {
                    total_amount: data.total_amount,
                    currency: PAYUNIT_CONFIG.currency,
                    transaction_id: data.transaction_id,
                    return_url: data.return_url,
                    notify_url: data.notify_url,
                    payment_country: PAYUNIT_CONFIG.paymentCountry,
                },
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error('PayUnit initialize payment error:', error);
            throw error;
        }
    },

    // Get payment providers
    getProviders: async (t_url: string, t_id: string, t_sum: string) => {
        try {
            const response = await axios.get(
                `${PAYUNIT_CONFIG.baseURL}/api/gateway/gateways?t_url=${t_url}&t_id=${t_id}&t_sum=${t_sum}`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error('PayUnit get providers error:', error);
            throw error;
        }
    },

    // Make payment with mobile money
    makePayment: async (data: {
        gateway: string;
        amount: number;
        transaction_id: string;
        return_url: string;
        phone_number: string;
        notify_url?: string;
    }) => {
        try {
            const response = await axios.post(
                `${PAYUNIT_CONFIG.baseURL}/api/gateway/makepayment`,
                {
                    gateway: data.gateway,
                    amount: data.amount,
                    transaction_id: data.transaction_id,
                    return_url: data.return_url,
                    phone_number: data.phone_number,
                    currency: PAYUNIT_CONFIG.currency,
                    paymentType: 'button',
                    notify_url: data.notify_url,
                },
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error('PayUnit make payment error:', error);
            throw error;
        }
    },

    // Get payment status
    getPaymentStatus: async (transactionID: string) => {
        try {
            const response = await axios.get(
                `${PAYUNIT_CONFIG.baseURL}/api/gateway/paymentstatus/${transactionID}`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        } catch (error) {
            console.error('PayUnit get payment status error:', error);
            throw error;
        }
    },
};

export default payunitAPI; 