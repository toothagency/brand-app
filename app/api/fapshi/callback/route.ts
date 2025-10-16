import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('Fapshi callback received:', body);

        // Forward the callback to the backend
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
        
        try {
            const response = await fetch(`${backendUrl}/api/payment/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('Backend processed Fapshi callback successfully:', result);
                return NextResponse.json({
                    status: 'SUCCESS',
                    message: 'Fapshi payment callback processed successfully'
                });
            } else {
                console.error('Backend failed to process Fapshi callback:', result);
                return NextResponse.json({
                    status: 'ERROR',
                    message: 'Failed to process Fapshi callback'
                }, { status: 500 });
            }
        } catch (backendError) {
            console.error('Error forwarding to backend:', backendError);
            return NextResponse.json({
                status: 'ERROR',
                message: 'Failed to forward callback to backend'
            }, { status: 500 });
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
