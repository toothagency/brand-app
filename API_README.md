# API Documentation

This document describes the API routes available in your Next.js application.

## API Structure

All API routes are located in the `app/api/` directory and follow Next.js 13+ App Router conventions.

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

## Available Endpoints

### 1. Health Check

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

### 2. Feedback

**POST** `/api/feedback`

Submit user feedback.

**Request Body:**

```json
{
  "name": "John Doe", // optional
  "email": "john@example.com", // optional
  "feedback": "Great app!" // required
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "feedback": "Great app!",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400/500):**

```json
{
  "error": "Feedback is required"
}
```

**GET** `/api/feedback`

Retrieve all feedback (for admin purposes).

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "feedback": "Great app!",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Analytics

**POST** `/api/analytics`

Track user analytics events.

**Request Body:**

```json
{
  "page": "/home", // required
  "action": "view", // optional, default: "view"
  "userId": "user123", // optional
  "metadata": {
    // optional
    "referrer": "google.com",
    "utm_source": "social"
  }
}
```

**GET** `/api/analytics`

Retrieve analytics events.

**Query Parameters:**

- `page` (optional): Filter by page
- `limit` (optional): Number of results (default: 100)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "page": "/home",
      "action": "view",
      "user_id": "user123",
      "metadata": {},
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Client-Side Usage

Use the utility functions in `lib/api.ts` for making API calls:

```typescript
import { feedbackApi, analyticsApi, healthApi } from "../lib/api";

// Submit feedback
const result = await feedbackApi.submit({
  name: "John Doe",
  email: "john@example.com",
  feedback: "Great app!",
});

// Track analytics
await analyticsApi.track({
  page: "/home",
  action: "view",
  userId: "user123",
});

// Check health
const health = await healthApi.check();
```

## Environment Variables

Make sure you have these environment variables set:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Tables

### Feedback Table

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Allow public inserts" ON feedback
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (optional, for admin purposes)
CREATE POLICY "Allow public reads" ON feedback
  FOR SELECT USING (true);
```

### Analytics Events Table

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,
  action TEXT DEFAULT 'view',
  user_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Allow public inserts" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (optional, for admin purposes)
CREATE POLICY "Allow public reads" ON analytics_events
  FOR SELECT USING (true);
```

## Error Handling

All API routes include comprehensive error handling:

1. **Validation Errors (400)**: Missing required fields
2. **Database Errors (500)**: Supabase connection issues
3. **Table Not Found**: Helpful error messages with SQL to create tables
4. **Network Errors**: Graceful fallbacks

## Security

- API routes use Supabase service role key for server-side operations
- Row Level Security (RLS) is enabled on all tables
- Input validation is performed on all endpoints
- Sensitive operations are kept server-side

## Testing

You can test the API endpoints using curl or any HTTP client:

```bash
# Health check
curl http://localhost:3000/api/health

# Submit feedback
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","feedback":"Test feedback"}'

# Track analytics
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"page":"/test","action":"view"}'
```
