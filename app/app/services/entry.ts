import { apiFetch } from './api';

export interface PayrollEntryResponse {
    id?: string;
    payroll_period_id?: string | null;
    schedule_id?: string | null;
    period_key?: string | null;
    employee_id?: string | null;
    full_name?: string | null;
    employment_type?: string | null;
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
    net?: number | string | null;
    period_start?: string | null;
    period_end?: string | null;
    pay_day?: string | null;
    excluded?: boolean;
    status?: string;
    [key: string]: unknown;
}

export const entryAPI = {
    async listCurrentEntries(skip = 0, limit = 200): Promise<PayrollEntryResponse[]> {
        const queryParams = new URLSearchParams();
        queryParams.append('skip', String(skip));
        queryParams.append('limit', String(limit));
        const response = await apiFetch(`/entry/show_current_entry?${queryParams.toString()}`);
        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to fetch payroll entries: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }
        return response.json();
    },

    async finalizeEntries(): Promise<void> {
        const response = await apiFetch('/entry/finalize', { method: 'POST' });
        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to finalize payroll: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }
    },
};
