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

const GAM_PROXY_BASE = '/api/proxy';
const CLIENT_ID = process.env.NEXT_PUBLIC_GAM_CLIENT_ID || 'SxGuEahcWCnY8vATy67Ew6yw8zs6wNpSrL8ZvCm3';

/**
 * Service to handle GeneXus GAM Authentication
 */
export const authService = {
    /**
     * Login with username and password
     */
    async login(username: string, password: string): Promise<AuthResponse> {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', CLIENT_ID);
        params.append('username', username);
        params.append('password', password);
        params.append('scope', 'fullcontrol'); // Corrected scope from OpenAPI doc

        const response = await fetch(`${GAM_PROXY_BASE}/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error_description || 'Login failed');
        }

        return response.json();
    },

    /**
     * Refresh the access token
     */
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', CLIENT_ID);
        params.append('refresh_token', refreshToken);

        const response = await fetch(`${GAM_PROXY_BASE}/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        return response.json();
    },

    /**
     * Get user profile data from GAM
     */
    async getUserProfile(token: string): Promise<UserProfile> {
        const response = await fetch(`${GAM_PROXY_BASE}/oauth/gam/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
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
    }
};
