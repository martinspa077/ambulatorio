'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserProfile, AuthResponse } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            // Security Bypass for development/restricted environments
            if (process.env.NEXT_PUBLIC_DISABLE_SECURITY === 'true') {
                console.warn('SECURITY DISABLED: Running in bypass mode');
                setUser({
                    id: 'bypass-user',
                    guid: 'bypass-user',
                    username: 'admin_bypass',
                    email: 'admin@bypass.local',
                    firstName: 'Admin',
                    lastName: 'Bypass',
                    roles: ['admin', 'doctor']
                });
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('gam_access_token');
            if (token) {
                try {
                    const profile = await authService.getUserProfile(token);
                    setUser(profile);
                } catch (error) {
                    console.error('Failed to restore session', error);
                    handleLogout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        console.log('Starting login for:', username);

        if (process.env.NEXT_PUBLIC_DISABLE_SECURITY === 'true') {
            console.warn('SECURITY DISABLED: Login bypassed');
            setUser({
                id: 'bypass-user',
                guid: 'bypass-user',
                username: username,
                email: `${username}@bypass.local`,
                firstName: 'Admin',
                lastName: 'Bypass',
                roles: ['admin', 'doctor']
            });
            document.cookie = `gam_access_token=bypass_token; path=/; max-age=3600; samesite=lax`;
            router.push('/agenda');
            setLoading(false);
            return;
        }

        try {
            const response: AuthResponse = await authService.login(username, password);
            console.log('Login successful, response received:', response);

            // Store in localStorage for client-side
            localStorage.setItem('gam_access_token', response.access_token);
            localStorage.setItem('gam_refresh_token', response.refresh_token);

            // Store in cookies for middleware (Server-side)
            // Use a default expiry if expires_in is 0 or missing (common in some GAM configs)
            const maxAge = response.expires_in > 0 ? response.expires_in : 3600;
            document.cookie = `gam_access_token=${response.access_token}; path=/; max-age=${maxAge}; samesite=lax`;
            console.log(`Tokens stored in localStorage and cookies (max-age: ${maxAge}s)`);

            console.log('Fetching user profile...');
            const profile = await authService.getUserProfile(response.access_token);
            console.log('Profile fetched:', profile);

            setUser(profile);
            console.log('User state updated, redirecting to /agenda...');
            router.push('/agenda');
        } catch (error: any) {
            console.error('Login flow error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('gam_access_token');
        localStorage.removeItem('gam_refresh_token');
        document.cookie = 'gam_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout: handleLogout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
