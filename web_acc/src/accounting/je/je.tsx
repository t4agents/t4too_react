import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import BreadcrumbComp from 'src/_layouts/shared/breadcrumb/BreadcrumbComp';
import LoadingSpinner from 'src/components/shared/LoadingSpinner';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Table, TBody, TCell, THead, THeader, TRow } from 'src/components/ui/table';
import { formatMoney } from 'src/core/format';
import { jeAPI, JournalEntryRow, TxRow } from 'src/accounting/je/je-api';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Entries' }];

const getEntryTransactionId = (entry: JournalEntryRow) =>
    typeof entry.transaction_id === 'string' && entry.transaction_id.trim()
        ? entry.transaction_id
        : null;

const getConfidence = (entry: JournalEntryRow) => {
    const value = Number(entry.confidence);
    return Number.isFinite(value) ? value.toFixed(2) : '-';
};

const Entries = () => {
    const [transactions, setTransactions] = useState<TxRow[]>([]);
    const [entries, setEntries] = useState<JournalEntryRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [autoGenerating, setAutoGenerating] = useState(false);
    const [entryErrors, setEntryErrors] = useState<Record<string, string>>({});
    const [msg, setMsg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let accounts = await jeAPI.listAccounts();
            if (accounts.length === 0) {
                await jeAPI.applyGenericCoa();
                accounts = await jeAPI.listAccounts();
                setMsg('No accounts found. Applied generic COA automatically.');
            }

            const [tx, existingEntries] = await Promise.all([
                jeAPI.listTransactions(),
                jeAPI.listEntries(),
            ]);
            const activeTx = tx.filter((item) => item.status !== 'posted');
            const entryTxIds = new Set(existingEntries.map(getEntryTransactionId).filter(Boolean));
            const missingEntryTx = activeTx.filter((item) => !entryTxIds.has(item.id));

            setTransactions(missingEntryTx);
            setEntries(existingEntries);

            if (missingEntryTx.length === 0) {
                setEntryErrors({});
                return;
            }

            setAutoGenerating(true);
            let success = 0;
            let failed = 0;
            const errors: Record<string, string> = {};

            for (const txn of missingEntryTx) {
                try {
                    await jeAPI.generateEntry(txn.id);
                    success += 1;
                } catch (err) {
                    failed += 1;
                    errors[txn.id] =
                        err instanceof Error ? err.message : 'Journal entry generation failed';
                }
            }

            const [txAfter, entriesAfter] = await Promise.all([
                jeAPI.listTransactions(),
                jeAPI.listEntries(),
            ]);
            const entryTxIdsAfter = new Set(entriesAfter.map(getEntryTransactionId).filter(Boolean));

            setTransactions(
                txAfter.filter((item) => item.status !== 'posted' && !entryTxIdsAfter.has(item.id)),
            );
            setEntries(entriesAfter);
            setEntryErrors(errors);
            setMsg(
                failed > 0
                    ? `Auto-generated ${success} journal entr${success === 1 ? 'y' : 'ies'}, ${failed} failed.`
                    : `Auto-generated ${success} journal entr${success === 1 ? 'y' : 'ies'}.`,
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load entries.');
        } finally {
            setAutoGenerating(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const headBoxes = (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="w-[150px] gap-1 p-3 rounded-md shadow-none border-secondary/20 bg-transparent">
                <CardHeader className="p-0 pb-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Need Entry</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-2xl font-semibold">{transactions.length}</CardContent>
            </Card>
            <Card className="w-[150px] gap-1 p-3 rounded-md shadow-none border-secondary/20 bg-transparent">
                <CardHeader className="p-0 pb-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Entries</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-2xl font-semibold">{entries.length}</CardContent>
            </Card>
        </div>
    );

    return (
        <>
            <BreadcrumbComp title="Entries" items={BCrumb} leftContent={null} rightContent={headBoxes} />
            <div className="flex gap-6 flex-col">
                <Card className="shadow-none border-secondary/20">
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                                Journal entries are generated directly from unposted transactions.
                            </div>
                            <Button
                                className="h-9 px-5 rounded-full shadow-sm"
                                onClick={refresh}
                                disabled={isLoading || autoGenerating}
                            >
                                {isLoading || autoGenerating ? (
                                    <LoadingSpinner size="sm" variant="dots" />
                                ) : (
                                    <Icon icon="mdi:refresh" className="h-4 w-4" />
                                )}
                                {autoGenerating ? 'Auto-generating...' : 'Refresh Entries'}
                            </Button>
                        </div>
                        {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
                        {error ? <p className="text-sm text-red-600">Error: {error}</p> : null}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card className="shadow-none border-secondary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Transactions Needing Entry</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto border-t border-ld">
                                <Table>
                                    <THeader>
                                        <TRow>
                                            <THead className="min-w-28 px-2">Date</THead>
                                            <THead className="min-w-48 px-2">Description</THead>
                                            <THead className="min-w-28 px-2 text-right">Amount</THead>
                                        </TRow>
                                    </THeader>
                                    <TBody>
                                        {transactions.map((row) => (
                                            <TRow key={row.id} className="hover:bg-primary/10 transition-colors">
                                                <TCell className="text-sm px-2 py-3">{row.txn_date || '-'}</TCell>
                                                <TCell className="text-sm px-2 py-3">
                                                    <div>{row.description || '-'}</div>
                                                    {entryErrors[row.id] ? (
                                                        <div className="text-xs text-red-600 mt-1">
                                                            Reason: {entryErrors[row.id]}
                                                        </div>
                                                    ) : null}
                                                </TCell>
                                                <TCell className="text-sm px-2 py-3 text-right tabular-nums">
                                                    {formatMoney(row.amount)}
                                                </TCell>
                                            </TRow>
                                        ))}
                                        {!isLoading && transactions.length === 0 ? (
                                            <TRow>
                                                <TCell className="text-sm px-2 py-4 text-muted-foreground" colSpan={3}>
                                                    No transactions need entries.
                                                </TCell>
                                            </TRow>
                                        ) : null}
                                    </TBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-secondary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Generated Entries</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex flex-col gap-3">
                            {entries.map((entry) => (
                                <Card key={entry.id} className="shadow-none border-secondary/20 rounded-md">
                                    <CardContent className="p-4 flex flex-col gap-3">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                            <div>
                                                <div className="font-semibold text-sm">{entry.memo || 'No memo'}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Confidence {getConfidence(entry)}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {entry.status || 'entry'}
                                            </div>
                                        </div>
                                        {entry.rationale ? (
                                            <p className="text-sm text-muted-foreground">{entry.rationale}</p>
                                        ) : null}
                                        <div className="overflow-x-auto border rounded-md border-ld">
                                            <Table>
                                                <THeader>
                                                    <TRow>
                                                        <THead className="min-w-24 px-2">Type</THead>
                                                        <THead className="min-w-28 px-2 text-right">Amount</THead>
                                                        <THead className="min-w-48 px-2">Account</THead>
                                                    </TRow>
                                                </THeader>
                                                <TBody>
                                                    {(entry.lines ?? []).map((line, index) => (
                                                        <TRow key={line.id ?? `${entry.id}-${index}`}>
                                                            <TCell className="text-sm px-2 py-2">
                                                                {line.line_type || '-'}
                                                            </TCell>
                                                            <TCell className="text-sm px-2 py-2 text-right tabular-nums">
                                                                {formatMoney(line.amount)}
                                                            </TCell>
                                                            <TCell className="text-sm px-2 py-2">
                                                                {line.account_id || '-'}
                                                            </TCell>
                                                        </TRow>
                                                    ))}
                                                    {(entry.lines ?? []).length === 0 ? (
                                                        <TRow>
                                                            <TCell className="text-sm px-2 py-3 text-muted-foreground" colSpan={3}>
                                                                No lines found.
                                                            </TCell>
                                                        </TRow>
                                                    ) : null}
                                                </TBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {!isLoading && entries.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-2">
                                    No generated entries yet.
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Entries;
