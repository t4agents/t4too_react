import { createClient, type User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_SUPABASE_URL = 'https://pjenyfvefvgbldgdegxs.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_YD2rTCUgLpShbIrF1VYK3g_pEy4NR5F';

const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = envUrl ?? DEFAULT_SUPABASE_URL;
const supabaseAnonKey = envAnonKey ?? DEFAULT_SUPABASE_ANON_KEY;

if (!envUrl || !envAnonKey) {
    console.warn('Missing Supabase env vars. Using bundled defaults for EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
    },
});

export type SupabaseUser = User;

export const getAccessToken = async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.warn('Failed to load Supabase session:', error.message);
        return null;
    }
    return data.session?.access_token ?? null;
};

export const getUserDisplayName = (user: User | null): string | null => {
    const metadata = user?.user_metadata ?? {};
    const name =
        (metadata as { full_name?: string }).full_name ??
        (metadata as { name?: string }).name ??
        (metadata as { user_name?: string }).user_name ??
        null;
    return name || null;
};
