import { apiFetch } from './api';

export interface PayrollHistoryResponse {
    id?: string;
    history_id?: string;
    period_key?: string;
    biz_id?: string;
    schedule_id?: string;
    employee_id?: string;
    period_start?: string;
    period_end?: string;
    pay_day?: string | null;
    total_gross?: number | string | null;
    payroll_cost?: number | string | null;
    total_net?: number | string | null;
    taxes_and_deductions?: number | string | null;
    employee_count?: number | null;
    excluded_count?: number | null;
    employment_type?: string | null;
    full_name?: string | null;
    annual_salary_snapshot?: number | string | null;
    hourly_rate_snapshot?: number | string | null;
    federal_claim_snapshot?: number | string | null;
    ontario_claim_snapshot?: number | string | null;
    regular_hours?: number | string | null;
    overtime_hours?: number | string | null;
    bonus?: number | string | null;
    vacation?: number | string | null;
    cpp?: number | string | null;
    ei?: number | string | null;
    tax?: number | string | null;
    gross?: number | string | null;
    total_deduction?: number | string | null;
    adjustment?: number | string | null;
    net?: number | string | null;
    cpp_exempt_snapshot?: boolean;
    ei_exempt_snapshot?: boolean;
    status?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface PayrollHistoryDetailResponse {
    summary: PayrollHistoryResponse;
    entries: PayrollHistoryResponse[];
}

type StatusCallback = (status: string, meta: Record<string, unknown>) => void;

const parseSsePayloads = (rawText: string) => {
    const parts = rawText.split('\n\n').map((part) => part.trim()).filter(Boolean);
    return parts.map((part) => {
        const lines = part.split('\n');
        let event = 'message';
        let data = '';
        for (const line of lines) {
            if (line.startsWith('event:')) event = line.slice(6).trim();
            if (line.startsWith('data:')) data += line.slice(5).trim();
        }
        return { event, data };
    });
};

async function parseSseResponse<T>(response: Response, onStatus?: StatusCallback): Promise<T> {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/event-stream')) {
        return response.json();
    }

    if (!response.body || !(response.body as ReadableStream<Uint8Array>).getReader) {
        const rawText = await response.text();
        let finalPayload: T | null = null;
        parseSsePayloads(rawText).forEach(({ event, data }) => {
            if (!data) return;
            try {
                const payload = JSON.parse(data);
                if (event === 'status') {
                    onStatus?.(payload.status, payload.meta ?? {});
                }
                if (event === 'final') {
                    finalPayload = payload.response as T;
                }
            } catch {
                return;
            }
        });

        if (finalPayload !== null) return finalPayload;
        throw new Error('Stream ended without a final response.');
    }

    const reader = response.body.getReader();
    const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null;
    let buffer = '';
    let finalPayload: T | null = null;
    let doneEarly = false;

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (decoder) {
            buffer += decoder.decode(value, { stream: true });
        } else {
            buffer += String.fromCharCode(...value);
        }
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
            const lines = part.split('\n');
            let event = 'message';
            let data = '';

            for (const line of lines) {
                if (line.startsWith('event:')) event = line.slice(6).trim();
                if (line.startsWith('data:')) data += line.slice(5).trim();
            }

            if (!data) continue;
            let payload: any;
            try {
                payload = JSON.parse(data);
            } catch {
                continue;
            }

            if (event === 'status') {
                onStatus?.(payload.status, payload.meta ?? {});
            } else if (event === 'final') {
                finalPayload = payload.response as T;
                doneEarly = true;
                break;
            } else if (event === 'error') {
                throw new Error(payload.message || 'Streaming error');
            }
        }

        if (doneEarly) {
            await reader.cancel();
            break;
        }
    }

    if (finalPayload !== null) return finalPayload;
    throw new Error('Stream ended without a final response.');
}

export const historyAPI = {
    async listPayrollHistory(skip = 0, limit = 500): Promise<PayrollHistoryResponse[]> {
        const queryParams = new URLSearchParams();
        queryParams.append('skip', String(skip));
        queryParams.append('limit', String(limit));
        const path = `/history/list?${queryParams.toString()}`;
        const response = await apiFetch(path);
        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to fetch payroll history: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }
        const payload = await response.json();
        if (Array.isArray(payload)) return payload;
        if (payload && Array.isArray((payload as { data?: unknown }).data)) {
            return (payload as { data: PayrollHistoryResponse[] }).data;
        }
        return [];
    },

    async getPayrollHistoryDetail(id: string): Promise<PayrollHistoryDetailResponse | PayrollHistoryResponse | PayrollHistoryResponse[]> {
        const path = `/history/detail?id=${encodeURIComponent(id)}`;
        const response = await apiFetch(path);
        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to fetch payroll history detail: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }
        return response.json();
    },

    async searchPayrollHistory(query: string, topK = 5, onStatus?: StatusCallback): Promise<unknown> {
        const response = await apiFetch('/brain/lgstream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
            body: JSON.stringify({ query, top_k: topK }),
        });

        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to search payroll history: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }

        return parseSseResponse(response, onStatus);
    },
};
