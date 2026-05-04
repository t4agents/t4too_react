import { useEffect, useRef, useState } from 'react';
import BreadcrumbComp from 'src/_layouts/shared/breadcrumb/BreadcrumbComp';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Table, TBody, TCell, THead, THeader, TRow } from 'src/components/ui/table';
import LoadingSpinner from 'src/components/shared/LoadingSpinner';
import { Icon } from '@iconify/react/dist/iconify.js';
import { formatMoney } from 'src/core/format';
import { AccountRow, inboxAPI, TxRow } from 'src/accounting/inbox/inbox-api';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Inbox' }];

const normalizeText = (value: string) =>
    value.toLowerCase().replace(/\d+(?:\.\d+)?/g, '').replace(/\b(today|yesterday)\b/g, '').trim();

const Inbox = () => {
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);
    const [accounts, setAccounts] = useState<AccountRow[]>([]);
    const [transactions, setTransactions] = useState<TxRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [transactionNote, setTransactionNote] = useState('');
    const [firstLineDraft, setFirstLineDraft] = useState({
        txn_date: '',
        description: '',
        amount: '',
        status: '',
    });

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const [tx, accts] = await Promise.all([
                inboxAPI.listTransactions(),
                inboxAPI.listAccounts(),
            ]);
            setTransactions(tx);
            setAccounts(accts);
        } catch (e: any) {
            setError(e?.message || 'Failed to load inbox data.');
        } finally {
            setLoading(false);
        }
    };

    const uploadCsv = async (nextFile?: File) => {
        if (!nextFile) return;
        setError(null);
        try {
            const res = await inboxAPI.importCsv(nextFile);
            setMsg(`Imported ${res.imported_count}, duplicates ${res.duplicate_count}.`);
            await refresh();
        } catch (e: any) {
            setError(e?.message || 'Failed to upload CSV.');
        }
    };

    const addTypedTransaction = async () => {
        const note = transactionNote.trim();
        if (!note) return;
        setError(null);
        setMsg(`Captured transaction note: ${note}`);
        setTransactionNote('');
        await refresh();
    };

    const handleCameraFile = async (nextFile?: File) => {
        if (!nextFile) return;
        setError(null);
        setMsg(`Captured image: ${nextFile.name}`);
        await refresh();
    };

    const handleVoiceCapture = () => {
        setError(null);
        // setMsg('Voice capture selected.');
    };

    const composerTokens = ['Expense', 'Income', 'Today', 'Cash', 'Bank'];
    const parsedAmount = transactionNote.match(/(-?\d+(?:\.\d+)?)/)?.[1] || '-';
    const parsedDate = /\btoday\b/i.test(transactionNote) ? 'Today' : /\byesterday\b/i.test(transactionNote) ? 'Yesterday' : '-';
    const parsedDesc = transactionNote.replace(/-?\d+(?:\.\d+)?/g, '').replace(/\b(today|yesterday)\b/gi, '').trim() || '-';
    const looksLikeUber = /\buber\b/i.test(transactionNote);
    const looksLikeGrab = /\bgrab\b/i.test(transactionNote);
    const looksLikeSalary = /\bsalary|payroll|income\b/i.test(transactionNote);
    const aiCategory = looksLikeSalary ? 'Income' : looksLikeUber || looksLikeGrab ? 'Transportation Expense' : 'General Expense';
    const aiAccount = looksLikeSalary ? 'Revenue / Payroll' : 'Operating Expense';
    const aiConfidence = looksLikeSalary || looksLikeUber || looksLikeGrab ? 'High' : transactionNote.trim() ? 'Medium' : 'Low';
    const similarTransactions = transactions
        .filter((row) => normalizeText(row.description || '').includes(normalizeText(transactionNote)) && normalizeText(transactionNote).length > 2)
        .slice(0, 3);
    const recentCaptures = transactions.slice(0, 5);

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

    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        const firstRow = transactions[0];
        if (!firstRow) {
            setFirstLineDraft({ txn_date: '', description: '', amount: '', status: '' });
            return;
        }

        setFirstLineDraft({
            txn_date: firstRow.txn_date || '',
            description: firstRow.description || '',
            amount: String(firstRow.amount ?? ''),
            status: firstRow.status || '',
        });
    }, [transactions]);

    return (
        <>
            <BreadcrumbComp title="AI Accounting" items={BCrumb} leftContent={null} rightContent={headBoxes} />
            <div className="flex gap-6 flex-col">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card className="shadow-none border-secondary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Chatbot</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="rounded-md border border-secondary/20 bg-muted/20 p-3">
                                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                                    <Icon icon="mdi:message-text-outline" className="h-4 w-4 text-muted-foreground" />
                                    <input
                                        className="h-10 w-full bg-transparent text-sm outline-none"
                                        value={transactionNote}
                                        onChange={(e) => setTransactionNote(e.target.value)}
                                        placeholder='Type transaction (e.g. "Uber 23 yesterday")'
                                    />
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {composerTokens.map((token) => (
                                        <button
                                            key={token}
                                            type="button"
                                            className="rounded-full border border-secondary/30 bg-background px-3 py-1 text-xs text-muted-foreground hover:bg-muted/60"
                                            onClick={() => setTransactionNote((prev) => `${prev ? `${prev} ` : ''}${token}`)}
                                        >
                                            + {token}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 rounded-md border border-dashed border-secondary/30 bg-background px-3 py-2 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">Preview:</span>{' '}
                                Date: {parsedDate} | Desc: {parsedDesc} | Amount: {parsedAmount}
                            </div>

                            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <Button
                                    className="h-9 px-5 rounded-full shadow-sm"
                                    onClick={addTypedTransaction}
                                    disabled={!transactionNote.trim()}
                                >
                                    <Icon icon="mdi:plus-circle-outline" className="h-4 w-4" />
                                    Add to Inbox
                                </Button>

                                <div className="flex flex-wrap items-center gap-2">
                                    <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        onChange={(e) => {
                                            uploadCsv(e.target.files?.[0] || undefined);
                                            e.target.value = '';
                                        }}
                                    />
                                    <input
                                        ref={cameraInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => handleCameraFile(e.target.files?.[0])}
                                    />
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 rounded-full"
                                        onClick={() => uploadInputRef.current?.click()}
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner size="sm" variant="dots" /> : <Icon icon="material-symbols:upload-rounded" className="h-4 w-4" />}
                                        Upload
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 rounded-full"
                                        onClick={() => cameraInputRef.current?.click()}
                                    >
                                        <Icon icon="mdi:camera-outline" className="h-4 w-4" />
                                        Camera
                                    </Button>
                                </div>
                            </div>
                            {msg ? <p className="mt-3 text-sm text-muted-foreground">{msg}</p> : null}
                            {error ? <p className="mt-3 text-sm text-red-600">Error: {error}</p> : null}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-secondary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Review & Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="space-y-3">
                                <div className="rounded-md border border-secondary/20 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">AI Suggestion</p>
                                        <span className="rounded-full bg-lightprimary/40 px-2 py-0.5 text-xs">{aiConfidence}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">Category: <span className="text-foreground">{aiCategory}</span></p>
                                    <p className="text-xs text-muted-foreground">Account: <span className="text-foreground">{aiAccount}</span></p>
                                </div>

                                <div className="rounded-md border border-secondary/20 p-3">
                                    <p className="text-sm font-medium">Duplicate Check</p>
                                    {similarTransactions.length > 0 ? (
                                        <div className="mt-2 space-y-2">
                                            {similarTransactions.map((tx) => (
                                                <div key={tx.id} className="rounded-md bg-muted/30 px-2 py-1 text-xs">
                                                    {tx.txn_date || '-'} | {tx.description || '-'} | {formatMoney(tx.amount ?? 0)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-xs text-muted-foreground">No close duplicate detected.</p>
                                    )}
                                </div>

                                <div className="rounded-md border border-secondary/20 p-3">
                                    <p className="text-sm font-medium">Smart Rules</p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Example: If description contains <span className="text-foreground">UBER</span>, map to <span className="text-foreground">Transportation Expense</span>.
                                    </p>
                                    <Button variant="outline" className="mt-2 h-8 rounded-full px-3 text-xs">
                                        Create rule from this
                                    </Button>
                                </div>

                                <div className="rounded-md border border-secondary/20 p-3">
                                    <p className="text-sm font-medium">Recent Captures</p>
                                    {recentCaptures.length > 0 ? (
                                        <div className="mt-2 space-y-2">
                                            {recentCaptures.map((tx) => (
                                                <div key={`recent-${tx.id}`} className="flex items-center justify-between text-xs">
                                                    <span className="truncate pr-2">{tx.description || '-'}</span>
                                                    <span className="text-muted-foreground">{tx.status || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-xs text-muted-foreground">No recent captures yet.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card className="shadow-none border-secondary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">Inbox Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto border-t border-ld">
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
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-secondary/20">
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">First Line Edit</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto border-t border-ld">
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
                                        {transactions.length > 0 ? (
                                            <TRow>
                                                <TCell className="px-2 py-3">
                                                    <input
                                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                        value={firstLineDraft.txn_date}
                                                        onChange={(e) =>
                                                            setFirstLineDraft((prev) => ({ ...prev, txn_date: e.target.value }))
                                                        }
                                                    />
                                                </TCell>
                                                <TCell className="px-2 py-3">
                                                    <input
                                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                        value={firstLineDraft.description}
                                                        onChange={(e) =>
                                                            setFirstLineDraft((prev) => ({ ...prev, description: e.target.value }))
                                                        }
                                                    />
                                                </TCell>
                                                <TCell className="px-2 py-3">
                                                    <input
                                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-right tabular-nums"
                                                        value={firstLineDraft.amount}
                                                        onChange={(e) =>
                                                            setFirstLineDraft((prev) => ({ ...prev, amount: e.target.value }))
                                                        }
                                                    />
                                                </TCell>
                                                <TCell className="px-2 py-3">
                                                    <input
                                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                        value={firstLineDraft.status}
                                                        onChange={(e) =>
                                                            setFirstLineDraft((prev) => ({ ...prev, status: e.target.value }))
                                                        }
                                                    />
                                                </TCell>
                                            </TRow>
                                        ) : (
                                            <TRow>
                                                <TCell className="text-sm px-2 py-4 text-muted-foreground" colSpan={4}>
                                                    No first line to edit.
                                                </TCell>
                                            </TRow>
                                        )}
                                    </TBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </>
    );
};

export default Inbox;
