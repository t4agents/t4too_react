import { apiFetch } from './api';

export interface Employee {
    id: string;
    first_name?: string;
    last_name?: string;
    sin?: string;
    date_of_birth?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    province?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    employment_type?: 'hourly' | 'salary' | null | string;
    hourly_rate?: number | string | null;
    annual_salary?: number | string | null;
    regular_hours?: number | string | null;
    federal_claim_amount?: number | string | null;
    ontario_claim_amount?: number | string | null;
    cpp_exempt?: boolean | null;
    ei_exempt?: boolean | null;
    is_deleted?: boolean | null;
}

export const employeeAPI = {
    async listEmployees(skip = 0, limit = 200): Promise<Employee[]> {
        const queryParams = new URLSearchParams();
        queryParams.append('skip', String(skip));
        queryParams.append('limit', String(limit));
        const response = await apiFetch(`/employee/list?${queryParams.toString()}`);
        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }
        return response.json();
    },

    async createEmployee(payload: Omit<Employee, 'id'>): Promise<Employee> {
        const response = await apiFetch('/employee/new', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const details = await response.text().catch(() => '');
            throw new Error(`Failed to create employee: ${response.status} ${response.statusText}${details ? ` - ${details}` : ''}`);
        }

        return response.json();
    },
};
