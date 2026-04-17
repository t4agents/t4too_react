import { apiFetch } from 'src/core/apihttp';
import { ClientDB, getClientId } from 'src/types/type_client';

export interface ListClientsResponse {
    ztid?: string;
    zuid?: string;
    zbid?: string;
    zbe_list?: ClientDB[];
    clients?: ClientDB[];
}

export interface NormalizedClientsPayload {
    clients: ClientDB[];
    activeClientId: string | null;
}

function asClientRecord(value: unknown): ClientDB | null {
    if (!value || typeof value !== 'object') {
        return null;
    }
    const client = value as ClientDB;
    const resolvedId = getClientId(client);
    if (!client.id && resolvedId) {
        return { ...client, id: resolvedId };
    }
    return client;
}

function normalizeClientArray(list: unknown): ClientDB[] {
    if (!Array.isArray(list)) {
        return [];
    }
    return list
        .map(asClientRecord)
        .filter((client): client is ClientDB => client !== null);
}

export function normalizeClientsPayload(data: unknown): NormalizedClientsPayload {
    if (Array.isArray(data)) {
        const clients = normalizeClientArray(data);
        return {
            clients,
            activeClientId: clients.length ? getClientId(clients[0]) || null : null,
        };
    }

    if (data && typeof data === 'object') {
        const payload = data as ListClientsResponse;
        const clients = normalizeClientArray(payload.zbe_list ?? payload.clients ?? []);
        const activeClientId = payload.zbid ?? payload.zuid ?? null;
        return { clients, activeClientId };
    }

    return {
        clients: [],
        activeClientId: null,
    };
}

export const clientsAPI = {
    async createClient(data: Partial<ClientDB>) {
        const response = await apiFetch('/be/new', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to create client: ${response.status} ${text}`);
        }

        return response.json();
    },



    // 获取客户列表
    async listClients() {
        const response = await apiFetch('/settings/get_client_list');
        if (!response.ok) {throw new Error(`Failed to fetch clients: ${response.statusText}`);}
        const data = await response.json();
        return normalizeClientsPayload(data);
    },


    // patchbyid
    async updateClient(id: string, data: Partial<ClientDB>) {
        const payload: Partial<ClientDB> = {
            ...data,
            id: data.id ?? id,
            client_id: data.client_id ?? id,
        };
        const response = await apiFetch(`/be/edit`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to update client: ${response.status} ${text}`);
        }

        return response.json();
    },


    // 删除客户（软删除）
    async softDeleteClient(id: string) {
        // Call DELETE endpoint which sets is_deleted = true on backend
        const response = await apiFetch(`/be/deletebyid/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to delete client: ${response.status} ${text}`);
        }

        return response.json();
    },


    async changeActiveBid(rzbid: string) {
        console.log('Changing active bid to:', rzbid);
        const response = await apiFetch('/zme/change_active_bid', {
            method: 'PATCH',
            body: JSON.stringify({ rzbid }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to patch zbid: ${response.status} ${text}`);
        }

        return response.json();
    },


};

export default clientsAPI;
export type InterfaceBE = ClientDB;
