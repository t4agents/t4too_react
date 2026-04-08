import { useMemo, useState, useEffect } from 'react';

import { TbDotsVertical } from 'react-icons/tb';
import { Icon } from '@iconify/react';
import { InterfaceBE } from 'src/types/type_be';

import { Checkbox } from 'src/components/ui/checkbox';
import LoadingSpinner from 'src/components/shared/LoadingSpinner';
import { Button } from 'src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from 'src/components/ui/card';
import { Table, TBody, TCell, THead, THeader, TRow, } from 'src/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from 'src/components/ui/dropdown-menu';
import { Input } from 'src/components/ui/input';

import BreadcrumbComp from 'src/_layouts/shared/breadcrumb/BreadcrumbComp';
import { useClientStore } from 'src/store/client-store';

import { clientsAPI } from './clients-api';
import BizEntityFormModal from './BizEntityFormModal';
import { downloadClientsCsv } from './clientDownload';

const BCrumb = [
    { to: '/', title: 'Home', },
    { title: 'Clients', },
];

const pageSize = 20;

const Clients = () => {
    const [clients, setClients] = useState<InterfaceBE[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchingActive, setIsSwitchingActive] = useState(false);
    const [query, setQuery] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const setStoreClients = useClientStore((state) => state.setClients);
    const activeBE = useClientStore((state) => state.activeBE);
    const setActiveBE = useClientStore((state) => state.setActiveBE);
    const activeClientId = activeBE?.active_zbid ?? null;
    const selectedClient: InterfaceBE | null = clients.find((client) => client.id === activeClientId) || null;
    const refreshClients = async () => {
        setIsLoading(true);
        try {
            const data = await clientsAPI.listClients();
            const nextClients = data.clients;
            setClients(nextClients);
            setStoreClients(nextClients);
            const nextActiveClient = nextClients.find((client) => client.id === data.activeClientId) ?? null;

            if (nextActiveClient) {
                setActiveBE({
                    active_zbid: nextActiveClient.id,
                    name: nextActiveClient.name,
                });
                return;
            }

            setActiveBE(null);
        } finally {
            setIsLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any | null>(null);

    const handleCheckboxChange = async (clientId: string) => {
        const nextBizId = activeClientId === clientId ? null : clientId;
        if (!nextBizId) {
            setActiveBE(null);
            return;
        }
        if (isSwitchingActive || nextBizId === activeClientId) {
            return;
        }

        const previousActiveBE = activeBE;
        const selected = clients.find((client) => client.id === nextBizId);
        setActiveBE({
            active_zbid: nextBizId,
            name: selected?.name || nextBizId,
        });
        setIsSwitchingActive(true);
        try {
            await clientsAPI.changeActiveBid(nextBizId);
        } catch (err) {
            setActiveBE(previousActiveBE);
            console.error('Failed to update active client:', err);
        } finally {
            setIsSwitchingActive(false);
        }
    };

    const fetchClients = async () => {
        try {
            await refreshClients();
        } catch (err) {
            console.error('Failed to load clients:', err);
        }
    };

    const handleCreateClient = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClient = (client: any) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClient = async (clientId: string) => {
        console.log("--------", clientId)
        try {
            await clientsAPI.softDeleteClient(clientId);
            // reload
            await fetchClients();
        } catch (err) {
            console.error('Failed to delete client:', err);
        }
    };

    // load on mount
    useEffect(() => {
        void refreshClients();
    }, []);

    const filtered = useMemo(() => {
        if (!query.trim()) return clients;
        const needle = query.trim().toLowerCase();
        return clients.filter((row) =>
            Object.values(row).some((val) => String(val).toLowerCase().includes(needle)),
        );
    }, [clients, query]);

    useEffect(() => {
        setPageIndex(0);
    }, [query, clients.length]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageData = useMemo(
        () => filtered.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
        [filtered, pageIndex],
    );

    const canPrev = pageIndex > 0;
    const canNext = pageIndex + 1 < pageCount;

    const handleDownload = () => {
        downloadClientsCsv(filtered);
    };

    return (
        <>
            <BreadcrumbComp
                title="Clients"
                items={BCrumb}
                leftContent={
                    selectedClient ? (
                        // <Card className="p-4 gap-2 bg-muted/50">
                        <Card className="w-auto gap-1 p-3 rounded-md border-secondary/20 bg-lightsecondary/10 shadow-none">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-medium">Active Workspace</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-base font-semibold mb-1">{selectedClient.name}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="p-4">
                            <CardContent className="text-center text-muted-foreground py-2">
                                No client selected
                            </CardContent>
                        </Card>
                    )
                }
            />

            <div className="flex gap-6 flex-col">

                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <div className="relative flex-1 min-w-0">
                
                    <Icon icon="solar:magnifer-linear" width="18" height="18" className="absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        className="pl-9 rounded-md border-0 bg-gray-100/80 shadow-none placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-secondary/40 focus-visible:ring-offset-0 dark:bg-slate-900/50 dark:placeholder:text-white/20"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                    />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                        <Button
                            onClick={handleDownload}
                            variant="lightsecondary"
                            size="icon"
                            className="h-9 w-9 rounded-md border border-secondary/20"
                            title="Download CSV"
                            disabled={filtered.length === 0}
                        >
                            <Icon icon="material-symbols:download-rounded" width="18" height="18" />
                            <span className="sr-only">Download CSV</span>
                        </Button>
                        <Button onClick={handleCreateClient} color={"primary"} className="flex items-center gap-1.5 rounded-md">
                            <Icon icon="solar:add-circle-outline" width="18" height="18" /> Add Client
                        </Button>
                    </div>
                </div>

                <div className="border rounded-md border-ld">
                    <Table>
                        <THeader>
                            <TRow>
                                <THead className="text-sm font-semibold pl-11">Client Name</THead>
                                <THead className="text-sm font-semibold">City, Province</THead>
                                <THead className="text-sm font-semibold">Phone</THead>
                                <THead className="text-sm font-semibold">Email</THead>
                                <THead className="text-sm font-semibold">Employees</THead>
                                <THead className="text-sm font-semibold">Actions</THead>
                            </TRow>
                        </THeader>

                        <TBody>
                            {isLoading ? (
                                <TRow><TCell colSpan={6} className="text-center py-8">
                                    <div className="inline-flex items-center gap-2 text-gray-500">
                                        <LoadingSpinner size="md" />
                                    </div>
                                </TCell></TRow>
                            ) : filtered.length === 0 ? (
                                <TRow><TCell colSpan={6} className="text-center py-8">
                                    No clients found
                                </TCell></TRow>
                            ) : (
                                pageData.map((client) => (
                                    <TRow
                                        key={client.id}
                                        className={
                                            activeClientId === client.id
                                                ? 'bg-primary/5'
                                                : ''
                                        }
                                    >
                                        {/* Client Name */}
                                        <TCell className="font-semibold">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer"
                                                onClick={() =>
                                                    void handleCheckboxChange(client.id)
                                                }
                                            >
                                                <Checkbox
                                                    checked={activeClientId === client.id}
                                                    onCheckedChange={() =>
                                                        void handleCheckboxChange(client.id)
                                                    }
                                                />
                                                {client.name}
                                            </div>
                                        </TCell>

                                        <TCell className="text-muted-foreground text-sm">{client.city}, {client.province}</TCell>
                                        <TCell className="text-muted-foreground text-sm">{client.phone}</TCell>
                                        <TCell className="text-muted-foreground text-sm">{client.email}</TCell>
                                        <TCell className="text-center text-sm">{client.employee_count}</TCell>
                                        <TCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                                                        <TbDotsVertical size={22} />
                                                    </span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem className="flex gap-3 items-center cursor-pointer" onClick={() => handleEditClient(client)}>
                                                        <Icon icon={'solar:pen-new-square-broken'} height={18} /><span>Edit</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex gap-3 items-center cursor-pointer" onClick={() => handleDeleteClient(client.id)}>
                                                        <Icon icon={'solar:trash-bin-minimalistic-outline'} height={18} /><span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TCell>
                                    </TRow>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-4 p-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                                disabled={!canPrev}
                                variant="secondary"
                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                                disabled={!canNext}
                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                                Next
                            </Button>
                        </div>

                        <div className="text-forest-black dark:text-white/90 font-medium text-xs sm:text-base whitespace-nowrap">
                            Page {pageIndex + 1} of {pageCount}
                        </div>
                    </div>
                </div>

                <BizEntityFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onComplete={async () => { setIsModalOpen(false); await fetchClients(); }}
                    initialData={editingClient}
                />
            </div>
        </>
    );
};

export default Clients;
