import { apiFetch } from './api';
import { supabase } from '../lib/supabase';

type NewUserProfile = {
    displayName?: string | null;
    photoURL?: string | null;
};

export async function runNewUserProvisioning(profile?: NewUserProfile): Promise<void> {
    if (profile?.displayName || profile?.photoURL) {
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: profile?.displayName ?? undefined,
                avatar_url: profile?.photoURL ?? undefined,
            },
        });
        if (error) {
            throw error;
        }
    }

    const response = await apiFetch('/newuseronly/new_user', {
        method: 'POST',
    });

    if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(errText || 'Failed to provision new user');
    }
}
