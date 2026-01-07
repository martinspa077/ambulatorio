'use server';

const GAM_BASE_URL = process.env.NEXT_PUBLIC_GAM_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL/rest';

/**
 * Generic API client for consuming GeneXus REST APIs
 */
export async function apiGet<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure endpoint starts with slash if not present, or handle it robustly
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${GAM_BASE_URL}${normalizedEndpoint}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        console.error(`API Error GET ${endpoint}: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

export async function apiPost<T>(endpoint: string, data: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${GAM_BASE_URL}${normalizedEndpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error(`API Error POST ${endpoint}: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

export const apiClient = {
    get: apiGet,
    post: apiPost
};
