import { apiFetch } from 'src/lib/apihttp';
import { InterfaceBE } from 'src/types/type_be';
import { InterfaceUser } from 'src/types/type_user';


export const meOrgAPI = {
    async getMe(): Promise<InterfaceUser> {
        const response = await apiFetch('/settings/userprofile', {method: 'GET',});
        if (!response.ok) {throw new Error(`Failed to fetch organization: ${response.statusText}`);}
        return response.json();
    },


    async getMyOrg(): Promise<InterfaceBE> {
        const response = await apiFetch('/zme/get_myorg', {method: 'GET',});
        if (!response.ok) {throw new Error(`Failed to fetch user: ${response.statusText}`);}
        
        return response.json();
    },
    
    
    async patchMe(data: Partial<InterfaceUser>): Promise<InterfaceUser> {
        
        const response = await apiFetch('/settings/saveme', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to update user: ${response.status} ${text}`);
        }

        return response.json();
    },

    
    async patchOrg(data: Partial<InterfaceBE>): Promise<InterfaceBE> {
        const response = await apiFetch('/zme/patch_myorg', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to update user: ${response.status} ${text}`);
        }

        return response.json();
    },


    async uploadProfilePicture(file: File): Promise<{ profile_picture: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiFetch('/zme/profile-picture', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to upload profile picture: ${response.status} ${text}`);
        }

        return response.json();
    },








};
