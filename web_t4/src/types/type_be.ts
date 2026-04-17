export interface InterfaceBE {
    id: string;
    type?: string;
    name: string;
    legal_name?: string;
    operating_name?: string;
    business_type?: string;
    incorporation_date?: string;
    employee_count?: number;
    phone?: string;
    email?: string;
    business_number?: string;
    payroll_account_number?: string;
    remittance_frequency?: string;
    tax_year_end?: string;
    wsib_number?: string;
    eht_account?: string;
    street_address?: string;
    city?: string;
    province?: string;
    country?: string;
    postal_code?: string;
    is_deleted?: boolean;

}

export const EMPTY_BE: InterfaceBE = {
    id: "",
    name: "",
};

export function dateOnly(value?: string): string {
    return value ? value.slice(0, 10) : "";
}
