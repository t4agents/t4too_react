import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { darkTheme, lightTheme } from '../constants/theme';
import { getPayrollScreenStyles } from '../constants/styles';
import { colors } from '../constants/colors';
import { entryAPI, PayrollEntryResponse } from '../services/entry';
import { historyAPI, PayrollHistoryResponse } from '../services/history';
import { employeeAPI, Employee } from '../services/employees';
import { formatDateRange, formatDateShort, formatMoney, toNumberSafe } from '../utils/format';
import { useClient } from '../contexts/ClientContext';

export const PayrollScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const styles = getPayrollScreenStyles(currentTheme);
    const { activeClient } = useClient();

    const [entries, setEntries] = useState<PayrollEntryResponse[]>([]);
    const [history, setHistory] = useState<PayrollHistoryResponse[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPayrollData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [entryList, historyList, employeeList] = await Promise.all([
                entryAPI.listCurrentEntries(0, 500),
                historyAPI.listPayrollHistory(0, 500),
                employeeAPI.listEmployees(0, 500),
            ]);
            setEntries(entryList);
            setHistory(historyList);
            setEmployees(employeeList);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load payroll data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPayrollData();
    }, [loadPayrollData, activeClient?.id]);

    const currentRun = useMemo(() => {
        if (!entries.length) return null;
        const totalGross = entries.reduce((sum, entry) => sum + toNumberSafe(entry.gross), 0);
        const totalNet = entries.reduce((sum, entry) => sum + toNumberSafe(entry.net), 0);
        return {
            date: formatDateRange(entries[0].period_start, entries[0].period_end),
            status: 'Draft',
            total: formatMoney(totalGross || totalNet),
            employees: entries.length,
        };
    }, [entries]);

    const latestHistory = useMemo(() => {
        if (!history.length) return null;
        return [...history].sort((a, b) => {
            const aDate = new Date(a.pay_day ?? a.period_end ?? a.created_at ?? 0).getTime();
            const bDate = new Date(b.pay_day ?? b.period_end ?? b.created_at ?? 0).getTime();
            return bDate - aDate;
        })[0];
    }, [history]);

    const runs = useMemo(() => {
        const list: Array<{ date: string; status: string; total: string; employees: number | string }> = [];
        if (currentRun) list.push(currentRun);
        if (latestHistory) {
            list.push({
                date: formatDateShort(latestHistory.pay_day ?? latestHistory.period_end ?? latestHistory.created_at),
                status: latestHistory.status ?? 'Finalized',
                total: formatMoney(latestHistory.total_gross ?? latestHistory.total_net),
                employees: latestHistory.employee_count ?? '-',
            });
        }
        return list;
    }, [currentRun, latestHistory]);

    const tasks = useMemo(() => {
        if (!entries.length) {
            return [
                { title: 'Create a draft payroll', detail: 'Add employees to start a run', tone: 'warning' as const },
            ];
        }
        const missingRates = entries.filter((entry) => !entry.hourly_rate_snapshot && !entry.annual_salary_snapshot).length;
        const excluded = entries.filter((entry) => entry.excluded).length;
        const list = [];
        if (missingRates) {
            list.push({ title: 'Missing pay rates', detail: `${missingRates} entries need a rate`, tone: 'error' as const });
        }
        if (excluded) {
            list.push({ title: 'Review exclusions', detail: `${excluded} entries excluded`, tone: 'warning' as const });
        }
        list.push({ title: 'Finalize payroll', detail: `${entries.length} employees ready`, tone: 'success' as const });
        return list;
    }, [entries]);

    const teamSnapshot = useMemo(() => {
        const activeCount = employees.length;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newHires = employees.filter((employee) => {
            if (!employee.start_date) return false;
            return new Date(employee.start_date).getTime() >= thirtyDaysAgo.getTime();
        }).length;
        return { activeCount, newHires };
    }, [employees]);

    const handleFinalizePayroll = async () => {
        if (!entries.length) {
            Alert.alert('No draft payroll', 'Create a draft payroll before finalizing.');
            return;
        }
        Alert.alert(
            'Finalize payroll?',
            'This will lock the current entries and create a history record.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Finalize',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await entryAPI.finalizeEntries();
                            await loadPayrollData();
                        } catch (err) {
                            Alert.alert('Finalize failed', err instanceof Error ? err.message : 'Unable to finalize payroll.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Payroll Runs</Text>
                    <TouchableOpacity style={styles.runButton} onPress={handleFinalizePayroll} disabled={loading}>
                        <Ionicons name="play" size={18} color="#fff" />
                        <Text style={styles.runButtonText}>Run Payroll</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Runs</Text>
                    {runs.length === 0 ? (
                        <View style={styles.runCard}>
                            <Text style={styles.runDate}>{loading ? 'Loading payroll...' : 'No payroll runs yet'}</Text>
                            <Text style={styles.runMeta}>{loading ? 'Syncing data from your backend.' : 'Start a draft to see upcoming runs.'}</Text>
                        </View>
                    ) : (
                        runs.map((run, index) => (
                            <View key={`${run.date}-${index}`} style={styles.runCard}>
                                <View>
                                    <Text style={styles.runDate}>{run.date}</Text>
                                    <Text style={styles.runMeta}>{run.employees} employees · {run.total}</Text>
                                </View>
                                <View style={styles.runStatus}>
                                    <View style={[styles.statusDot, { backgroundColor: run.status === 'Draft' ? colors.main : currentTheme.colors.success }]} />
                                    <Text style={styles.runStatusText}>{run.status}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payroll Tasks</Text>
                    <View style={styles.taskCard}>
                        {tasks.map((task, index) => (
                            <View
                                key={task.title}
                                style={[
                                    styles.taskRow,
                                    index < tasks.length - 1 ? styles.taskRowSpacing : null
                                ]}
                            >
                                <Ionicons
                                    name={task.tone === 'success' ? 'checkmark-circle' : task.tone === 'warning' ? 'alert-circle' : 'alert'}
                                    size={18}
                                    color={task.tone === 'success' ? currentTheme.colors.success : task.tone === 'warning' ? currentTheme.colors.warning : currentTheme.colors.error}
                                />
                                <View style={styles.taskText}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskDetail}>{task.detail}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={currentTheme.colors.textSecondary} />
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Team Snapshot</Text>
                    <View style={styles.snapshotCard}>
                        <View style={styles.snapshotItem}>
                            <Text style={styles.snapshotLabel}>Active</Text>
                            <Text style={styles.snapshotValue}>{teamSnapshot.activeCount}</Text>
                        </View>
                        <View style={styles.snapshotDivider} />
                        <View style={styles.snapshotItem}>
                            <Text style={styles.snapshotLabel}>On Leave</Text>
                            <Text style={styles.snapshotValue}>0</Text>
                        </View>
                        <View style={styles.snapshotDivider} />
                        <View style={styles.snapshotItem}>
                            <Text style={styles.snapshotLabel}>New Hires</Text>
                            <Text style={styles.snapshotValue}>{teamSnapshot.newHires}</Text>
                        </View>
                    </View>
                    {error && <Text style={styles.runMeta}>{error}</Text>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
