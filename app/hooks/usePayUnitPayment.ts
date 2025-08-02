import { useMutation } from '@tanstack/react-query';
import payunitAPI from '../configs/payunitConfig';

interface InitializePaymentRequest {
    total_amount: number;
    transaction_id: string;
    return_url: string;
    notify_url?: string;
}

interface MakePaymentRequest {
    gateway: string;
    amount: number;
    transaction_id: string;
    return_url: string;
    phone_number: string;
    notify_url?: string;
}

export const usePayUnitPayment = () => {
    // Initialize payment transaction
    const initializePayment = useMutation({
        mutationFn: (data: InitializePaymentRequest) =>
            payunitAPI.initializePayment(data),
        onSuccess: (data) => {
            console.log('Payment initialized successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to initialize payment:', error);
        },
    });

    // Make payment with mobile money
    const makePayment = useMutation({
        mutationFn: (data: MakePaymentRequest) =>
            payunitAPI.makePayment(data),
        onSuccess: (data) => {
            console.log('Payment made successfully:', data);
        },
        onError: (error) => {
            console.error('Failed to make payment:', error);
        },
    });

    // Get payment status
    const getPaymentStatus = useMutation({
        mutationFn: (transactionID: string) =>
            payunitAPI.getPaymentStatus(transactionID),
        onSuccess: (data) => {
            console.log('Payment status retrieved:', data);
        },
        onError: (error) => {
            console.error('Failed to get payment status:', error);
        },
    });

    return {
        initializePayment,
        makePayment,
        getPaymentStatus,
    };
}; 