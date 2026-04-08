import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getUserDisplayName, supabase, type SupabaseUser } from '../lib/supabase';
import { runNewUserProvisioning } from '../services/auth';

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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LocalUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mapUser = (supabaseUser: SupabaseUser): LocalUser => ({
        uid: supabaseUser.id,
        email: supabaseUser.email ?? '',
        displayName: getUserDisplayName(supabaseUser) ?? undefined,
    });

    useEffect(() => {
        let isActive = true;
        const restoreSession = async () => {
            try {
                const { data, error: sessionError } = await supabase.auth.getSession();
                if (!isActive) return;
                if (sessionError) {
                    setError(sessionError.message);
                }
                const nextUser = data.session?.user ? mapUser(data.session.user) : null;
                setUser(nextUser);
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

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isActive) return;
            setUser(session?.user ? mapUser(session.user) : null);
            setLoading(false);
        });

        return () => {
            isActive = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setError(null);
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password.trim()) {
            throw new Error('Email and password are required.');
        }
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
        });
        if (signInError) {
            throw new Error(signInError.message);
        }
    };

    const signUp = async (email: string, password: string, displayName?: string) => {
        setError(null);
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password.trim()) {
            throw new Error('Email and password are required.');
        }
        const display = displayName?.trim() || undefined;
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: display ? { data: { full_name: display } } : undefined,
        });
        if (signUpError) {
            throw new Error(signUpError.message);
        }

        if (data.session) {
            try {
                await runNewUserProvisioning({ displayName: display });
            } catch (provisionError) {
                console.warn('Failed to provision new user:', provisionError);
            }
        } else {
            throw new Error('Check your email to confirm your account, then sign in.');
        }
    };

    const signOut = async () => {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
            throw new Error(signOutError.message);
        }
        setUser(null);
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
