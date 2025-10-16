import { useMutation } from '@tanstack/react-query';
import axios from '../configs/axiosConfigs';

interface InitiatePaymentRequest {
    amount: number;
    brandId: string;
    email?: string;
    redirectUrl?: string;
    userId?: string;
    message?: string;
}

interface VerifyPaymentRequest {
    transId: string;
}

export const useFapshiPayment = () => {
    // Initiate payment through backend
    const initiatePayment = useMutation({
        mutationFn: (data: InitiatePaymentRequest) =>
            axios.post('/api/payment/initiate', data).then(res => res.data),
        onSuccess: (data) => {
            console.log('Payment initiated successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to initiate payment:', error);
        },
    });

    // Verify payment through backend
    const verifyPayment = useMutation({
        mutationFn: (data: VerifyPaymentRequest) =>
            axios.post('/api/payment/verify', data).then(res => res.data),
        onSuccess: (data) => {
            console.log('Payment verification result:', data);
        },
        onError: (error) => {
            console.error('Failed to verify payment:', error);
        },
    });

    // Get payment status through backend
    const getPaymentStatus = useMutation({
        mutationFn: (transId: string) =>
            axios.get(`/api/payment/status?transId=${transId}`).then(res => res.data),
        onSuccess: (data) => {
            console.log('Payment status retrieved:', data);
        },
        onError: (error) => {
            console.error('Failed to get payment status:', error);
        },
    });

    return {
        initiatePayment,
        verifyPayment,
        getPaymentStatus,
    };
};
