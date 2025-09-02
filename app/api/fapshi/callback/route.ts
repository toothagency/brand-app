import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Fapshi callback received:', body);

        // Extract payment data from Fapshi callback
        const {
            status,
            statusCode,
            message,
            data: {
                amount,
                transaction_status,
                transaction_id,
                reference,
                notify_url,
                callback_url,
                currency,
                payment_method,
                phone_number,
                message: transactionMessage
            }
        } = body;

        // Check if payment was successful
        if (status === 'SUCCESS' && transaction_status === 'SUCCESS') {
            console.log('Fapshi payment successful for transaction:', transaction_id);

            // Here you would typically:
            // 1. Update your database with payment status
            // 2. Generate the final brand results
            // 3. Send confirmation email to user

            // For now, we'll just log the success
            console.log('Fapshi payment details:', {
                amount: amount,
                currency: currency,
                payment_method: payment_method,
                phone_number: phone_number,
                reference: reference
            });

            return NextResponse.json({
                status: 'SUCCESS',
                message: 'Fapshi payment callback processed successfully'
            });
        } else {
            console.log('Fapshi payment failed or pending for transaction:', transaction_id);
            console.log('Status:', transaction_status);

            return NextResponse.json({
                status: 'FAILED',
                message: 'Fapshi payment not successful'
            });
        }

    } catch (error) {
        console.error('Fapshi callback error:', error);
        return NextResponse.json(
            {
                status: 'ERROR',
                message: 'Failed to process Fapshi callback'
            },
            { status: 500 }
        );
    }
}
