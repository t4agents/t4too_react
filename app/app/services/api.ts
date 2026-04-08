import { API_BASE_URL } from '../constants/api';

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers || {});

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const prefix = path.startsWith('/') ? '' : '/';
    return fetch(`${API_BASE_URL}${prefix}${path}`, {
        ...options,
        headers,
    });
}

export async function apiGetJson<T>(path: string): Promise<T> {
    const response = await apiFetch(path);
    if (!response.ok) {
        const details = await response.text().catch(() => '');
        throw new Error(`Request failed: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
    }
    return response.json();
}
