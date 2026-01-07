'use server';

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    user_guid?: string;
}

export interface UserProfile {
    id?: string;
    guid: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles?: string[];
}

const GAM_BASE_URL = process.env.NEXT_PUBLIC_GAM_BASE_URL || 'http://localhost:8089/K2BHealthAMBJavaPostgreSQL';
const CLIENT_ID = process.env.NEXT_PUBLIC_GAM_CLIENT_ID || 'SxGuEahcWCnY8vATy67Ew6yw8zs6wNpSrL8ZvCm3';

/**
 * Login with username and password
 */
export async function login(username: string, password: string): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'fullcontrol');

    try {
        const response = await fetch(`${GAM_BASE_URL}/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error_description: response.statusText }));
            console.error('Login error:', error);
            throw new Error(error.error_description || 'Login failed');
        }

        return response.json();
    } catch (error) {
        console.error('Login network error:', error);
        throw error;
    }
}

/**
 * Refresh the access token
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', CLIENT_ID);
    params.append('refresh_token', refreshToken);

    try {
        const response = await fetch(`${GAM_BASE_URL}/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            console.error('Refresh token error:', response.status);
            throw new Error('Failed to refresh token');
        }

        return response.json();
    } catch (error) {
        console.error('Refresh token network error:', error);
        throw error;
    }
}

/**
 * Get user profile data from GAM
 */
export async function getUserProfile(token: string): Promise<UserProfile> {
    try {
        const response = await fetch(`${GAM_BASE_URL}/oauth/gam/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Get profile error:', response.status);
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();

        return {
            id: data.guid,
            guid: data.guid,
            username: data.username,
            email: data.email,
            firstName: data.first_name || data.firstName || '',
            lastName: data.last_name || data.lastName || '',
            roles: data.roles || []
        };
    } catch (error) {
        console.error('Get profile network error:', error);
        throw error;
    }
}
