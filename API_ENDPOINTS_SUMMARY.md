# API Endpoints Quick Reference

## Authentication
- `GET /auth/google` - Initialize Google OAuth
- `POST /auth/google/token` - Authenticate with Google token

## Brand Management
- `POST /create_brand` - Create new brand
- `POST /get_suggestions` - Get AI-powered brand suggestions
- `POST /send_answer` - Submit brand form answer
- `POST /get_results` - Get brand results
- `GET /get_brand_results/{brandId}` - Get brand results (alternative)
- `GET /get_full_brand/{brandId}` - Get complete brand data
- `POST /get_final_results` - Generate final results after payment

## Payment
- `POST /update_brand_payment_status` - Update payment status

## Downloads
- `GET /api/brand/{brandId}/blueprint-pdf` - Download blueprint PDF
- `GET /api/brand/{brandId}/full-pdf` - Download full brand PDF

## Feedback & Analytics
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/analytics` - Track analytics event
- `GET /api/analytics` - Get analytics data

## System
- `GET /api/health` - Health check

## Key Request/Response Examples

### Create Brand
```json
// Request
{
  "userId": "user_123"
}

// Response
{
  "success": true,
  "brand": {
    "id": "brand_456",
    "userId": "user_123",
    "status": "in_progress"
  }
}
```

### Get Suggestions
```json
// Request
{
  "question": 1,
  "section": 1,
  "brandId": "brand_456",
  "userId": "user_123"
}

// Response
{
  "suggestions": [
    "Creative Brand Name 1",
    "Creative Brand Name 2",
    "Creative Brand Name 3"
  ]
}
```

### Submit Answer
```json
// Request
{
  "question": 1,
  "section": 1,
  "answer": "My brand name",
  "userId": "user_123",
  "brandId": "brand_456"
}

// Response
{
  "success": true,
  "message": "passed"
}
```

### Update Payment Status
```json
// Request
{
  "brandId": "brand_456",
  "paymentStatus": true,
  "transactionId": "fapshi_transaction_123"
}

// Response
{
  "success": true,
  "message": "Payment status updated successfully",
  "updated": true
}
```

For detailed documentation, see `BACKEND_API_DOCUMENTATION.md`
