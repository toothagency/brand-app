export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string; // Optional
  lastName?: string;  // Optional
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
  user: User;
  token: string; // e.g., JWT
  // Add other relevant response fields like expiration, refresh token, etc.
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
