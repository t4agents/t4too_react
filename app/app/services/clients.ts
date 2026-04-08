import { apiFetch } from './api';

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

export interface ListClientsResponse {
    ztid?: string;
    zuid?: string;
    zbid?: string;
    zbe_list?: InterfaceBE[];
}

export interface NormalizedClientsPayload {
    clients: InterfaceBE[];
    activeClientId: string | null;
}

export function normalizeClientsPayload(data: unknown): NormalizedClientsPayload {
    if (Array.isArray(data)) {
        const clients = data as InterfaceBE[];
        return {
            clients,
            activeClientId: clients[0]?.id ?? null,
        };
    }

    if (data && typeof data === 'object') {
        const payload = data as ListClientsResponse;
        const clients = Array.isArray(payload.zbe_list) ? payload.zbe_list : [];
        const activeClientId = payload.zbid ?? payload.zuid ?? null;
        return { clients, activeClientId };
    }

    return {
        clients: [],
        activeClientId: null,
    };
}

export const clientsAPI = {
    async listClients(): Promise<NormalizedClientsPayload> {
        const response = await apiFetch('/be/list');
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Failed to fetch clients: ${response.status} ${text}`);
        }
        const data = await response.json();
        return normalizeClientsPayload(data);
    },

    async changeActiveBid(rzbid: string): Promise<void> {
        const response = await apiFetch('/zme/change_active_bid', {
            method: 'PATCH',
            body: JSON.stringify({ rzbid }),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Failed to change active client: ${response.status} ${text}`);
        }
    },
};
