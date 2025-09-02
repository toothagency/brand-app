import { useMutation } from '@tanstack/react-query';
import fapshiAPI from '../configs/fapshiConfig';

interface InitiatePaymentRequest {
    amount: number;
    email?: string;
    redirectUrl?: string;
    userId?: string;
    externalId?: string;
    message?: string;
}

export const useFapshiPayment = () => {
    // Initiate payment and get payment link
    const initiatePayment = useMutation({
        mutationFn: (data: InitiatePaymentRequest) =>
            fapshiAPI.initiatePayment(data),
        onSuccess: (data) => {
            console.log('Fapshi payment initiated successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to initiate Fapshi payment:', error);
        },
    });

    // Get payment status
    const getPaymentStatus = useMutation({
        mutationFn: (transId: string) =>
            fapshiAPI.getPaymentStatus(transId),
        onSuccess: (data) => {
            console.log('Fapshi payment status retrieved:', data);
        },
        onError: (error) => {
            console.error('Failed to get Fapshi payment status:', error);
        },
    });

    return {
        initiatePayment,
        getPaymentStatus,
    };
};
