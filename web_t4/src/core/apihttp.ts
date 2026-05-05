import { config } from 'src/config';
import { getAccessToken } from 'src/core/supabase';
import { notifyToast } from 'src/core/toast';
import { waitForAuthReady } from 'src/store/auth-store';

const API_BASE_URL = config.api.baseUrl;
const API_GZ_URL = config.api.baseGZUrl;

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) return null;
        const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
        const decoded = atob(padded);
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
};

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    let token: string | undefined;

    await waitForAuthReady();

    try {
        token = (await getAccessToken()) ?? undefined;
    } catch (error) {
        console.error('Failed to refresh access token:', error);
    }

    const headers = new Headers(options.headers || {});

    // Only set JSON content-type if body is not a FormData instance
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) { headers.set('Authorization', `Bearer ${token}`); }
    const isInvoicePaymentsCsv = path.includes('/invoice_payments_csv');
    if (isInvoicePaymentsCsv) {
        const jwtPayload = token ? decodeJwtPayload(token) : null;
        console.log('[invoice_payments_csv][apiFetch][request]', {
            path,
            hasToken: Boolean(token),
            hasAuthorizationHeader: headers.has('Authorization'),
            authorizationScheme: headers.get('Authorization')?.split(' ')[0] ?? null,
            jwtEmail:
                (jwtPayload?.email as string | undefined) ??
                (jwtPayload?.preferred_username as string | undefined) ??
                null,
        });
    }

    const prefix = path.startsWith('/') ? '' : '/';
    const baseUrl = isInvoicePaymentsCsv ? API_GZ_URL : API_BASE_URL;
    const res = await fetch(`${baseUrl}${prefix}${path}`, {
        ...options,
        headers,
    });
    if (isInvoicePaymentsCsv) {
        console.log('[invoice_payments_csv][apiFetch][response]', {
            status: res.status,
            ok: res.ok,
            contentType: res.headers.get('content-type'),
        });
    }

    if ((res.status === 401 || res.status === 403) && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/auth2/login') {
            notifyToast({
                message: 'Session expired. Please sign in again.',
                variant: 'error',
                durationMs: 2200,
            });
            window.location.href = '/auth/auth2/login';
        }
    }

    return res;
}

export async function apiGetJson<T>(path: string): Promise<T> {
    const response = await apiFetch(path);
    if (!response.ok) {
        const details = await response.text().catch(() => '');
        throw new Error(`-- Request failed: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
    }
    return response.json();
}
