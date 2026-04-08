import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextValue {
    user: LocalUser | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signOut: () => Promise<void>;
}

interface LocalUser {
    uid: string;
    email: string;
    displayName?: string;
}

const AUTH_USER_KEY = 't4auth:user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LocalUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;
        const restoreSession = async () => {
            try {
                const stored = await AsyncStorage.getItem(AUTH_USER_KEY);
                if (!isActive) return;
                if (stored) {
                    setUser(JSON.parse(stored) as LocalUser);
                }
            } catch (err) {
                if (isActive) {
                    setError(err instanceof Error ? err.message : 'Failed to restore session');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };
        void restoreSession();
        return () => {
            isActive = false;
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setError(null);
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password.trim()) {
            throw new Error('Email and password are required.');
        }
        const nextUser: LocalUser = {
            uid: trimmedEmail.toLowerCase(),
            email: trimmedEmail,
        };
        setUser(nextUser);
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    };

    const signUp = async (email: string, password: string, displayName?: string) => {
        setError(null);
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password.trim()) {
            throw new Error('Email and password are required.');
        }
        const nextUser: LocalUser = {
            uid: trimmedEmail.toLowerCase(),
            email: trimmedEmail,
            displayName: displayName?.trim() || undefined,
        };
        setUser(nextUser);
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem(AUTH_USER_KEY);
    };

    const value = useMemo<AuthContextValue>(() => ({
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
    }), [user, loading, error]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
};
