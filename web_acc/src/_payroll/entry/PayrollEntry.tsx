import { useMemo, useState } from 'react';
import BreadcrumbComp from 'src/_layouts/shared/breadcrumb/BreadcrumbComp';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Table, TBody, TCell, THead, THeader, TRow } from 'src/components/ui/table';
import LoadingSpinner from 'src/components/shared/LoadingSpinner';
import { Icon } from '@iconify/react/dist/iconify.js';
import config from 'src/config';
import { formatMoney } from 'src/core/format';
import { useClientStore } from 'src/store/client-store';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Payroll' }];

const defaultBase = import.meta.env.VITE_ACCOUNTING_API_URL || `${config.api.baseUrl}/api/v1`;

type TxRow = {
    id: string;
    txn_date?: string;
    description?: string;
    amount?: number | string;
    status?: string;
};

type ApiContext = {
    baseUrl: string;
    ownerId: string;
};

async function request<T>(ctx: ApiContext, path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    if (ctx.ownerId) {
        headers.set('X-Owner-Id', ctx.ownerId);
    }
    const res = await fetch(`${ctx.baseUrl}${path}`, { ...init, headers });
    if (!res.ok) {
        const detail = await res.text();
        throw new Error(`${res.status} ${detail}`);
    }
    return res.json() as Promise<T>;
}

const Payroll = () => {
    const activeBizId = useClientStore((state) => state.activeBE?.active_zbid ?? '');
    const [file, setFile] = useState<File | null>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<TxRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const ctx: ApiContext = useMemo(
        () => ({ baseUrl: localStorage.getItem('tooacc_base') || defaultBase, ownerId: activeBizId || '' }),
        [activeBizId],
    );

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const [tx, accts] = await Promise.all([
                request<TxRow[]>(ctx, '/transactions?limit=200'),
                request<any[]>(ctx, '/accounts'),
            ]);
            setTransactions(tx);
            setAccounts(accts);
        } catch (e: any) {
            setError(e?.message || 'Failed to load inbox data.');
        } finally {
            setLoading(false);
        }
    };

    const applyCoa = async () => {
        setError(null);
        try {
            const res = await request<{ created: number; existing: number }>(
                ctx,
                '/coa/templates/generic/apply',
                { method: 'POST' },
            );
            setMsg(`COA applied. Created ${res.created}, existing ${res.existing}.`);
            await refresh();
        } catch (e: any) {
            setError(e?.message || 'Failed to apply COA.');
        }
    };

    const uploadCsv = async () => {
        if (!file) return;
        setError(null);
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await request<any>(ctx, '/transactions/import-csv', {
                method: 'POST',
                body: form,
            });
            setMsg(`Imported ${res.imported_count}, duplicates ${res.duplicate_count}.`);
            setFile(null);
            await refresh();
        } catch (e: any) {
            setError(e?.message || 'Failed to upload CSV.');
        }
    };

    const headBoxes = (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="w-[150px] gap-1 p-3 rounded-md shadow-none border-secondary/20 bg-transparent">
                <CardHeader className="p-0 pb-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Accounts</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-2xl font-semibold">{accounts.length}</CardContent>
            </Card>
            <Card className="w-[150px] gap-1 p-3 rounded-md shadow-none border-secondary/20 bg-transparent">
                <CardHeader className="p-0 pb-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-2xl font-semibold">{transactions.length}</CardContent>
            </Card>
            <Card className="w-[150px] gap-1 p-3 rounded-md shadow-none border-secondary/20 bg-transparent">
                <CardHeader className="p-0 pb-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Entries</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-2xl font-semibold">{transactions.filter((t) => t.status === 'posted').length}</CardContent>
            </Card>
        </div>
    );

    return (
        <>
            <BreadcrumbComp title="Payroll Entries" items={BCrumb} leftContent={null} rightContent={headBoxes} />
            <div className="flex gap-6 flex-col">
                <Card className="shadow-none border-secondary/20">
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                                Inbox Operations
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    className="h-9 px-4 rounded-full border-secondary/30 text-secondary hover:bg-secondary/10"
                                    onClick={applyCoa}
                                >
                                    <Icon icon="mdi:chart-tree" className="h-4 w-4" />
                                    Apply Generic COA
                                </Button>
                                <Button
                                    className="h-9 px-5 rounded-full shadow-sm"
                                    onClick={refresh}
                                    disabled={loading}
                                >
                                    {loading ? <LoadingSpinner size="sm" variant="dots" /> : <Icon icon="mdi:refresh" className="h-4 w-4" />}
                                    {loading ? 'Refreshing...' : 'Refresh Inbox'}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-md border border-secondary/20 bg-lightsecondary/10 p-3">
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <label className="text-sm font-medium text-foreground md:min-w-28">
                                    Upload CSV
                                </label>
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <Button
                                    className="h-9 px-5 rounded-full md:ml-auto"
                                    onClick={uploadCsv}
                                    disabled={!file}
                                >
                                    <Icon icon="material-symbols:upload-rounded" className="h-4 w-4" />
                                    Upload CSV
                                </Button>
                            </div>
                        </div>
                        {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
                        {error ? <p className="text-sm text-red-600">Error: {error}</p> : null}
                    </CardContent>
                </Card>

                <div className="overflow-x-auto border rounded-md border-ld">
                    <Table>
                        <THeader>
                            <TRow>
                                <THead className="min-w-3 px-2">Date</THead>
                                <THead className="min-w-3 px-2">Description</THead>
                                <THead className="min-w-3 px-2 text-right">Amount</THead>
                                <THead className="min-w-3 px-2">Status</THead>
                            </TRow>
                        </THeader>
                        <TBody>
                            {transactions.map((row) => (
                                <TRow key={row.id} className="hover:bg-primary/10 transition-colors">
                                    <TCell className="text-sm px-2 py-3">{row.txn_date || '-'}</TCell>
                                    <TCell className="text-sm px-2 py-3">{row.description || '-'}</TCell>
                                    <TCell className="text-sm px-2 py-3 text-right tabular-nums">
                                        {formatMoney(row.amount ?? 0)}
                                    </TCell>
                                    <TCell className="text-sm px-2 py-3">{row.status || '-'}</TCell>
                                </TRow>
                            ))}
                            {!loading && transactions.length === 0 ? (
                                <TRow>
                                    <TCell className="text-sm px-2 py-4 text-muted-foreground" colSpan={4}>
                                        No inbox transactions yet.
                                    </TCell>
                                </TRow>
                            ) : null}
                        </TBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default Payroll;
