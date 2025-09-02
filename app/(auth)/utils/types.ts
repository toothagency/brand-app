export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    userName: string;
    email: string;
    password: string;
  
}

export interface User {
    id: string; // Or number, depending on your backend
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // Add other relevant user fields
}

export interface AuthResponse {
    message: string,
    success: boolean,
    user: {
        email: string,
        password: string,
        userId?: string, // Handle camelCase
        userid?: string, // Handle lowercase (backend inconsistency)
        username: string,
        referral_code?: string,
        phoneNumber?: string
    },
    userId?: string
}

// Specific types for Login and Register responses if they differ significantly
// Often, they might just use the common AuthResponse
export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

// You might also want types for potential error responses
export interface AuthErrorResponse {
    statusCode: number;
    message: string | string[]; // Can be a single message or array of validation errors
    error: string; // e.g., "Bad Request", "Unauthorized"
}
