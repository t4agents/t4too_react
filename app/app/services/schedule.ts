import { apiFetch } from './api';

export interface PayrollSchedule {
    id: string;
    frequency: string;
    period?: string;
    payon?: string;
    semi1?: string;
    semi2?: string;
    note?: string;
    anchor_date?: string | null;
    pay_date_offset_days?: number | string | null;
    effective_from: string;
    status: 'active' | 'inactive' | string;
}

export const scheduleAPI = {
    async listPayrollSchedules(skip = 0, limit = 100): Promise<PayrollSchedule[]> {
        const queryParams = new URLSearchParams();
        queryParams.append('skip', String(skip));
        queryParams.append('limit', String(limit));
        const response = await apiFetch(`/schedule/list?${queryParams.toString()}`);
        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to fetch payroll schedules: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }
        return response.json();
    },
};
