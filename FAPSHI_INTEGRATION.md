# Fapshi Payment Gateway Integration

This document outlines the integration of Fapshi payment gateway with backend processing for enhanced security.

## Configuration

### Environment Variables

**Frontend (.env.local):**
```env
# Backend URL for payment API calls
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

**Backend (.env):**
```env
# Fapshi API Configuration
FAPSHI_API_URL=https://live.fapshi.com
FAPSHI_API_USER=your_fapshi_api_user_here
FAPSHI_API_KEY=your_fapshi_api_key_here
```

### Backend Configuration

The Fapshi integration is now handled by the backend:

- **Base URL**: `https://live.fapshi.com` (production) / `https://sandbox.fapshi.com` (test)
- **Currency**: XAF (Central African CFA franc)
- **Country**: CM (Cameroon)
- **Security**: API keys stored securely on backend
- **HTTP Client**: Uses Python requests library

## Payment Flow

### Backend-Processed Payment Flow

1. **User clicks "Complete Payment"** on the initialize-payment page
2. **Frontend calls backend** `/api/payment/initiate` with payment details
3. **Backend calls Fapshi's `/initiate-pay` endpoint** with payment details
4. **Backend returns payment link** to frontend
5. **User is redirected to the payment link** to complete payment
6. **User is redirected back** to the success page with transaction ID and status
7. **Frontend calls backend** `/api/payment/verify` to verify payment
8. **Backend verifies payment** with Fapshi API and updates database
9. **Frontend displays success/failure** based on verification result

### Payment Verification

When Fapshi redirects the user back to your app, it includes these URL parameters:
- `transId`: The Fapshi transaction ID (e.g., `GL30RHJSGw`)
- `status`: The payment status from Fapshi (e.g., `SUCCESSFUL`)

The app then calls the Fapshi API to verify the payment status before showing the final result to the user.

### Optional Parameters Benefits

- **Email**: Pre-fills email field, improving user experience
- **Redirect URL**: Ensures user returns to correct page after payment
- **User ID**: Helps with user tracking and analytics
- **External ID**: Enables transaction reconciliation
- **Message**: Provides context for payment purpose

### Payment Status Handling

The app handles different payment statuses appropriately:

- **SUCCESSFUL**: Payment completed successfully - shows success form and updates backend
- **FAILED**: Payment failed - shows error message with retry option and updates backend
- **EXPIRED**: Payment link expired - prompts user to initiate new payment and updates backend
- **PENDING**: Payment in progress - shows pending message (no backend update)
- **CREATED**: Payment not attempted - shows error message and updates backend

### Backend Payment Status Update

When a payment status is determined, the app calls the backend endpoint to update the brand's payment status:

**Endpoint:** `POST /update_brand_payment_status`

**Request Body:**
```json
{
  "brandId": "brand-id-here",
  "paymentStatus": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "updated": true
}
```

This ensures the backend database is updated with the payment status for tracking and analytics purposes.

## API Endpoints

### 1. Initiate Payment
```typescript
POST /initiate-pay
```

**Request Body:**
```json
{
  "amount": 10000,
  "email": "customer@example.com",
  "redirectUrl": "https://yourapp.com/payment-success",
  "userId": "fs-1234567890-abc123",
  "externalId": "fs-1234567890-abc123",
  "message": "Payment for Brand Kit"
}
```

**Parameters:**
- `amount` (required): Amount to be paid (minimum 100 XAF)
- `email` (optional): If set, user won't have to provide email during payment
- `redirectUrl` (optional): URL to redirect user after payment
- `userId` (optional): Your internal user ID (1-100 chars; a-z, A-Z, 0-9, -, _)
- `externalId` (optional): Transaction/order ID for reconciliation (1-100 chars; a-z, A-Z, 0-9, -, _)
- `message` (optional): Reason for payment

**Parameter Validation:**
- Amount must be at least 100 XAF
- User ID and External ID must be 1-100 characters (a-z, A-Z, 0-9, -, _)
- Email should be a valid email format
- Redirect URL should be a valid URL

**Success Response (200):**
```json
{
  "message": "Payment initiated successfully",
  "link": "https://fapshi.com/pay/abc123",
  "transId": "TRANS123456",
  "dateInitiated": "2023-12-25"
}
```

**Error Response (4XX):**
```json
{
  "message": "Invalid amount"
}
```

**Common Error Messages:**
- `"Invalid amount"` - Amount is not valid
- `"Invalid email"` - Email format is incorrect
- `"Transaction not found"` - Transaction ID doesn't exist
- `"Payment failed"` - Payment processing failed
- `"Invalid API key"` - Authentication failed

### 2. Get Payment Status
```typescript
GET /payment-status/{transId}
```

**Headers:**
```
apiuser: <api-user>
apikey: <api-key>
```

**Success Response (200):**
```json
[
  {
    "transId": "GL30RHJSGw",
    "status": "SUCCESSFUL",
    "medium": "mobile money",
    "serviceName": "Orange Money",
    "amount": 10000,
    "revenue": 10000,
    "payerName": "John Smith",
    "email": "jsmith@example.com",
    "redirectUrl": "https://yourapp.com/payment-success",
    "externalId": "fs-1234567890-abc123",
    "userId": "fs-1234567890-abc123",
    "webhook": "https://yourapp.com/api/fapshi/callback",
    "financialTransId": "FIN123456",
    "dateInitiated": "2023-12-25",
    "dateConfirmed": "2023-12-25"
  }
]
```

**Error Response (4XX):**
```json
{
  "message": "Transaction not found"
}
```

**Status Values:**
- `CREATED`: Payment not yet attempted
- `PENDING`: User is in process of payment
- `SUCCESSFUL`: Payment completed successfully
- `FAILED`: Payment failed
- `EXPIRED`: Payment link expired (24 hours passed or manually expired)

## Usage

### 1. Import the Hook
```typescript
import { useFapshiPayment } from '../hooks/useFapshiPayment';
```

### 2. Use in Component
```typescript
const { initiatePayment, getPaymentStatus } = useFapshiPayment();

// Initiate payment and get payment link
const result = await initiatePayment.mutateAsync({
  amount: 10000,
  email: 'customer@example.com', // Optional: user won't need to enter email
  redirectUrl: 'https://yourapp.com/payment-success', // Optional: redirect after payment
  userId: 'fs-1234567890-abc123', // Optional: your internal user ID
  externalId: 'fs-1234567890-abc123', // Optional: transaction ID for reconciliation
  message: 'Payment for Brand Kit' // Optional: reason for payment
});

if (result.success && result.data.link) {
  // Redirect user to payment link
  window.location.href = result.data.link;
} else {
  // Handle error
  console.error(result.error);
}

// Verify payment status (called when user returns from Fapshi)
const paymentStatus = await getPaymentStatus.mutateAsync('GL30RHJSGw');
if (paymentStatus.status === 'SUCCESSFUL') {
  // Payment verified successfully
  console.log('Payment confirmed:', paymentStatus);
  console.log('Payment details:', {
    amount: paymentStatus.amount,
    medium: paymentStatus.medium,
    serviceName: paymentStatus.serviceName,
    payerName: paymentStatus.payerName,
    email: paymentStatus.email
  });
} else if (paymentStatus.status === 'EXPIRED') {
  // Payment link expired
  console.log('Payment link expired');
} else if (paymentStatus.status === 'FAILED') {
  // Payment failed
  console.log('Payment failed');
} else if (paymentStatus.status === 'PENDING') {
  // Payment still pending
  console.log('Payment still pending');
} else {
  // Other statuses (CREATED, etc.)
  console.log('Payment verification failed:', paymentStatus.status);
}
```

## Transaction ID Format

Transaction IDs are generated with the format: `fs-{timestamp}-{random_string}`

Example: `fs-1704884144000-abc123def`

## Error Handling

The integration includes comprehensive error handling for:
- Network errors
- API errors (4XX responses with error messages)
- Payment failures
- Invalid data

### Error Response Handling

Both API endpoints return error messages in the response body for 4XX status codes:

**Initiate Payment Errors:**
- Invalid amount, email, or other parameters
- Authentication failures
- Server errors

**Payment Status Errors:**
- Transaction not found
- Invalid transaction ID
- Authentication failures

The app properly extracts and displays these error messages to users.

## Testing

1. Use sandbox URL: `https://sandbox.fapshi.com`
2. Use test API keys provided by Fapshi
3. Test with test amounts and email addresses

## Production Deployment

1. Change base URL to: `https://fapshi.com`
2. Use production API keys
3. Update redirect URLs to production domain
4. Test with real payment methods

## Implementation Files

The following files implement the Fapshi payment integration:

- `app/configs/fapshiConfig.ts` - Fapshi API configuration
- `app/hooks/useFapshiPayment.ts` - React hooks for payment operations
- `app/api/fapshi/callback/route.ts` - Payment callback handler
- `app/payment/page.tsx` - Redirects to initialize-payment
- `app/initialize-payment/page.tsx` - Payment initiation page

## Payment Flow Summary

1. **User completes brand form** → Redirected to `/payment`
2. **Payment page** → Redirects to `/initialize-payment` with brand data
3. **Initialize payment page** → Shows payment summary and "Complete Payment" button
4. **User clicks "Complete Payment"** → Calls Fapshi API to get payment link
5. **User redirected to Fapshi** → Completes payment on Fapshi's platform
6. **User redirected back** → Returns to `/payment-success?transId=GL30RHJSGw&status=SUCCESSFUL`
7. **Payment verification** → App calls Fapshi API to verify payment status
8. **Success/Failure display** → Shows appropriate UI based on verification result

## Support

For Fapshi API documentation and support, visit: https://docs.fapshi.com
