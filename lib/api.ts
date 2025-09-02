// API utility functions for client-side requests

export interface ApiResponse<T = any> {
    success?: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`/api${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Request failed',
                ...result,
            };
        }

        return {
            success: true,
            ...result,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Network error',
        };
    }
}

// Specific API functions
export const feedbackApi = {
    submit: (data: { name?: string; email?: string; feedback: string }) =>
        apiRequest('/feedback', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getAll: () => apiRequest('/feedback'),
};

export const analyticsApi = {
    track: (data: { page: string; action?: string; userId?: string; metadata?: any }) =>
        apiRequest('/analytics', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getEvents: (params?: { page?: string; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page);
        if (params?.limit) searchParams.append('limit', params.limit.toString());

        return apiRequest(`/analytics?${searchParams.toString()}`);
    },
};

export const healthApi = {
    check: () => apiRequest('/health'),
}; 