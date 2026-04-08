import { API_BASE_URL } from '../constants/api';

export async function runNewUserProvisioning(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/newuseronly/new_user`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(errText || 'Failed to provision new user');
    }
}
