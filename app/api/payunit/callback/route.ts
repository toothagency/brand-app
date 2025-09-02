import { NextRequest, NextResponse } from 'next/server';
import { useFinalResults } from '../../../hooks/useFinalResults';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('PayUnit callback received:', body);

        // Extract payment data from PayUnit callback
        const {
            status,
            statusCode,
            message,
            data: {
                transaction_amount,
                transaction_status,
                transaction_id,
                purchaseRef,
                notify_url,
                callback_url,
                transaction_currency,
                transaction_gateway,
                message: transactionMessage
            }
        } = body;

        // Check if payment was successful
        if (status === 'SUCCESS' && transaction_status === 'SUCCESS') {
            console.log('Payment successful for transaction:', transaction_id);

            // Here you would typically:
            // 1. Update your database with payment status
            // 2. Generate the final brand results
            // 3. Send confirmation email to user

            // For now, we'll just log the success
            console.log('Payment details:', {
                amount: transaction_amount,
                currency: transaction_currency,
                gateway: transaction_gateway,
                purchaseRef
            });

            return NextResponse.json({
                status: 'SUCCESS',
                message: 'Payment callback processed successfully'
            });
        } else {
            console.log('Payment failed or pending for transaction:', transaction_id);
            console.log('Status:', transaction_status);

            return NextResponse.json({
                status: 'FAILED',
                message: 'Payment not successful'
            });
        }

    } catch (error) {
        console.error('Error processing PayUnit callback:', error);

        return NextResponse.json(
            {
                status: 'ERROR',
                message: 'Failed to process payment callback'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Handle GET requests (for testing)
    return NextResponse.json({
        status: 'OK',
        message: 'PayUnit callback endpoint is working'
    });
} 