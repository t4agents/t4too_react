import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clientsAPI, InterfaceBE } from '../services/clients';
import { useAuth } from './AuthContext';

interface ClientContextValue {
    clients: InterfaceBE[];
    activeClient: InterfaceBE | null;
    loading: boolean;
    error: string | null;
    refreshClients: () => Promise<void>;
    setActiveClient: (clientId: string) => Promise<void>;
}

const ClientContext = createContext<ClientContextValue | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [clients, setClients] = useState<InterfaceBE[]>([]);
    const [activeClient, setActiveClientState] = useState<InterfaceBE | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshClients = useCallback(async () => {
        if (!user) {
            setClients([]);
            setActiveClientState(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const payload = await clientsAPI.listClients();
            setClients(payload.clients);
            const active =
                payload.clients.find((client) => client.id === payload.activeClientId) ??
                payload.clients[0] ??
                null;
            setActiveClientState(active ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load clients');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const setActiveClient = useCallback(async (clientId: string) => {
        setLoading(true);
        setError(null);
        try {
            await clientsAPI.changeActiveBid(clientId);
            const next = clients.find((client) => client.id === clientId) ?? null;
            setActiveClientState(next);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change active client');
        } finally {
            setLoading(false);
        }
    }, [clients]);

    useEffect(() => {
        void refreshClients();
    }, [refreshClients]);

    const value = useMemo<ClientContextValue>(() => ({
        clients,
        activeClient,
        loading,
        error,
        refreshClients,
        setActiveClient,
    }), [clients, activeClient, loading, error, refreshClients, setActiveClient]);

    return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClient = () => {
    const ctx = useContext(ClientContext);
    if (!ctx) {
        throw new Error('useClient must be used within a ClientProvider');
    }
    return ctx;
};
