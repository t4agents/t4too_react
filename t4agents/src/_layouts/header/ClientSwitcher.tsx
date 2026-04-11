import { useState } from 'react';
import { Icon } from '@iconify/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from 'src/components/ui/dropdown-menu';
import { clientsAPI } from 'src/_settings/clients/clients-api';
import { useClientStore } from 'src/store/client-store';

const ClientSwitcher = () => {
    const clients = useClientStore((state) => state.clients);
    const activeBE = useClientStore((state) => state.activeBE);
    const setActiveBE = useClientStore((state) => state.setActiveBE);
    const [isSwitching, setIsSwitching] = useState(false);
    const activeClientId = activeBE?.active_zbid ?? null;
    const activeClientName = clients.find((client) => client.id === activeClientId)?.name;

    const handleSwitch = async (bizId: string) => {
        if (!bizId) {
            console.error('[ClientSwitcher] handleSwitch called with empty id');
            return;
        }
        if (isSwitching || bizId === activeClientId) {
            return;
        }

        const previousActiveBE = activeBE;
        const selected = clients.find((client) => client.id === bizId);
        setActiveBE({
            active_zbid: bizId,
            name: selected?.name || activeBE?.name || bizId,
        });
        setIsSwitching(true);
        try {
            await clientsAPI.changeActiveBid(bizId);
        } catch (error) {
            setActiveBE(previousActiveBE);
            console.error('Failed to switch active client:', error);
        } finally {
            setIsSwitching(false);
        }
    };

    return (
        <div className="relative group/menu pe-1 sm:pe-3 shrink-0">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="h-9 px-3 rounded-full border border-border bg-background hover:bg-lightprimary inline-flex items-center gap-2 text-sm text-foreground"
                    >
                        <span className="max-w-[150px] truncate">
                            {activeClientName || activeBE?.name || 'Select client'}
                        </span>
                        <Icon icon="tabler:chevron-down" width={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px] rounded-sm">
                    {clients.length === 0 ? (
                        <DropdownMenuItem disabled>No clients available</DropdownMenuItem>
                    ) : (
                        clients.map((client) => (
                            <DropdownMenuItem
                                key={client.id}
                                className="cursor-pointer flex items-center justify-between"
                                onClick={() => {
                                    void handleSwitch(client.id);
                                }}
                            >
                                <span>{client.name}</span>
                                {activeClientId === client.id ? <Icon icon="tabler:check" width={16} /> : null}
                            </DropdownMenuItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ClientSwitcher;
