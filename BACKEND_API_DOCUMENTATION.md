# Backend API Documentation

This document outlines all the API endpoints that need to be implemented by the backend developer for the Brand App.

## Base URL
- Development: `http://localhost:8000` (or your backend URL)
- Production: `https://your-backend-domain.com`

## Authentication Headers
All endpoints (except auth endpoints) should include:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 1. Authentication Endpoints

### 1.1 Initialize Google OAuth
**GET** `/auth/google`

Initiates Google OAuth flow and returns the authorization URL.

**Response:**
```json
{
  "success": true,
  "message": "Google OAuth initiated successfully",
  "auth_url": "https://accounts.google.com/oauth/authorize?...",
  "state": "random_state_string"
}
```

### 1.2 Authenticate with Google Token
**POST** `/auth/google/token`

Authenticates user with Google ID token.

**Request Body:**
```json
{
  "id_token": "google_id_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "userId": "user_123",
    "username": "john_doe",
    "email": "john@example.com",
    "profile_picture": "https://example.com/photo.jpg",
    "auth_provider": "google"
  }
}
```

---

## 2. Brand Management Endpoints

### 2.1 Create Brand
**POST** `/create_brand`

Creates a new brand for the authenticated user.

**Request Body:**
```json
{
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Brand created successfully",
  "brand": {
    "id": "brand_456",
    "userId": "user_123",
    "status": "in_progress",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.2 Get Brand Suggestions
**POST** `/get_suggestions`

Gets AI-powered suggestions for brand questions.

**Request Body:**
```json
{
  "question": 1,
  "section": 1,
  "brandId": "brand_456",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "suggestions": [
    "Creative Brand Name 1",
    "Creative Brand Name 2",
    "Creative Brand Name 3"
  ]
}
```

### 2.3 Submit Brand Answer
**POST** `/send_answer`

Submits an answer for a specific brand question.

**Request Body:**
```json
{
  "question": 1,
  "section": 1,
  "answer": "My brand name",
  "userId": "user_123",
  "brandId": "brand_456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "passed"
}
```

### 2.4 Get Brand Results
**POST** `/get_results`

Retrieves detailed brand results for a specific brand.

**Request Body:**
```json
{
  "userId": "user_123",
  "brandId": "brand_456"
}
```

**Response:**
```json
{
  "brandId": "brand_456",
  "userId": "user_123",
  "brandName": "My Brand",
  "logo": {
    "primary": "logo_url_here",
    "variations": ["variation1_url", "variation2_url"]
  },
  "colors": {
    "primary": "#FF5733",
    "secondary": "#33FF57",
    "accent": "#3357FF"
  },
  "typography": {
    "primary": "Arial",
    "secondary": "Helvetica"
  },
  "status": "completed",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 2.5 Get Brand Results (Alternative)
**GET** `/get_brand_results/{brandId}`

Alternative endpoint to get brand results by brand ID only.

**Path Parameters:**
- `brandId` (string): The brand ID

**Response:**
```json
{
  "success": true,
  "message": "Brand results retrieved successfully",
  "brand_results": {
    "brandId": "brand_456",
    "userId": "user_123",
    "brandName": "My Brand",
    "logo": "logo_url_here",
    "colors": ["#FF5733", "#33FF57"],
    "status": "completed"
  }
}
```

### 2.6 Get Full Brand Results
**GET** `/get_full_brand/{brandId}`

Retrieves complete brand information including all assets.

**Path Parameters:**
- `brandId` (string): The brand ID

**Response:**
```json
{
  "success": true,
  "brand": {
    "id": "brand_456",
    "name": "My Brand",
    "logo": {
      "primary": "logo_url",
      "variations": ["var1_url", "var2_url"]
    },
    "colors": {
      "primary": "#FF5733",
      "secondary": "#33FF57",
      "accent": "#3357FF"
    },
    "typography": {
      "primary": "Arial",
      "secondary": "Helvetica"
    },
    "brandGuidelines": "guidelines_text_here",
    "status": "completed",
    "paymentStatus": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.7 Get Final Results
**POST** `/get_final_results`

Generates final brand results after payment completion.

**Request Body:**
```json
{
  "brandId": "brand_456",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Final results generated successfully",
  "results": {
    "brandId": "brand_456",
    "assets": {
      "logos": ["logo1_url", "logo2_url"],
      "colors": ["#FF5733", "#33FF57"],
      "fonts": ["Arial", "Helvetica"]
    },
    "downloadLinks": {
      "fullKit": "download_url_here",
      "blueprint": "blueprint_url_here"
    }
  }
}
```

---

## 3. Payment Endpoints

### 3.1 Update Brand Payment Status
**POST** `/update_brand_payment_status`

Updates the payment status of a brand after successful payment.

**Request Body:**
```json
{
  "brandId": "brand_456",
  "paymentStatus": true,
  "transactionId": "fapshi_transaction_123"
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

---

## 4. Download Endpoints

### 4.1 Download Blueprint PDF
**GET** `/api/brand/{brandId}/blueprint-pdf`

Downloads the brand blueprint PDF.

**Path Parameters:**
- `brandId` (string): The brand ID

**Response:**
- File download (PDF blob)

### 4.2 Download Full Brand PDF
**GET** `/api/brand/{brandId}/full-pdf`

Downloads the complete brand kit PDF.

**Path Parameters:**
- `brandId` (string): The brand ID

**Response:**
- File download (PDF blob)

---

## 5. Feedback Endpoints

### 5.1 Submit Feedback
**POST** `/api/feedback`

Submits user feedback.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "feedback": "Great app!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": "feedback_123",
    "name": "John Doe",
    "email": "john@example.com",
    "feedback": "Great app!",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5.2 Get All Feedback
**GET** `/api/feedback`

Retrieves all feedback (admin only).

**Response:**
```json
{
  "data": [
    {
      "id": "feedback_123",
      "name": "John Doe",
      "email": "john@example.com",
      "feedback": "Great app!",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 6. Analytics Endpoints

### 6.1 Track Analytics Event
**POST** `/api/analytics`

Tracks user analytics events.

**Request Body:**
```json
{
  "page": "/home",
  "action": "view",
  "userId": "user_123",
  "metadata": {
    "referrer": "google.com",
    "utm_source": "social"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Analytics event tracked"
}
```

### 6.2 Get Analytics Data
**GET** `/api/analytics`

Retrieves analytics events.

**Query Parameters:**
- `page` (optional): Filter by page
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "event_123",
      "page": "/home",
      "action": "view",
      "userId": "user_123",
      "metadata": {
        "referrer": "google.com"
      },
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 7. Health Check

### 7.1 Health Check
**GET** `/api/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

---

## Error Responses

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes for Backend Developer

1. **Authentication**: Implement JWT-based authentication for protected endpoints
2. **CORS**: Enable CORS for frontend domain
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Validation**: Validate all request parameters and body data
5. **Error Handling**: Implement comprehensive error handling
6. **Logging**: Add proper logging for debugging and monitoring
7. **Database**: Ensure proper database schema for brands, users, and analytics
8. **File Storage**: Implement file storage for brand assets and PDFs
9. **Payment Integration**: Integrate with Fapshi payment gateway
10. **Security**: Implement proper security measures (input sanitization, SQL injection prevention, etc.)
