import { apiFetch } from 'src/core/apihttp';
import { InterfaceBE } from 'src/types/type_be';

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
    // 新增接口：创建客户
    async createClient(data: Omit<InterfaceBE, 'id'>) {
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
        const response = await apiFetch('/be/list');
        if (!response.ok) {throw new Error(`Failed to fetch clients: ${response.statusText}`);}
        const data = await response.json();
        return normalizeClientsPayload(data);
    },


    // patchbyid
    async updateClient(id: string, data: Partial<InterfaceBE>) {
        console.log('Updating client with ID:', id, 'Data:', data);
        const response = await apiFetch(`/be/edit`, {
            method: 'PATCH',
            body: JSON.stringify(data),
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
export type { InterfaceBE };
