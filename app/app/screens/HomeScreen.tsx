import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors } from '../constants/colors';
import { darkTheme, lightTheme } from '../constants/theme';
import { getHomeScreenStyles } from '../constants/styles';
import { useAuth } from '../contexts/AuthContext';
import { useClient } from '../contexts/ClientContext';
import { historyAPI, PayrollHistoryResponse } from '../services/history';
import { entryAPI, PayrollEntryResponse } from '../services/entry';
import { employeeAPI, Employee } from '../services/employees';
import { formatDateRange, formatDateShort, formatMoney, toNumberSafe } from '../utils/format';
import { RootTabParamList } from '../types/navigation';
import { showToast } from '../utils/toast';

const formatStatusLabel = (status: string, meta: Record<string, unknown> = {}) => {
    const metaBits = [
        meta.query ? `query="${meta.query}"` : null,
        meta.top_k ? `top_k=${meta.top_k}` : null,
        meta.route ? `route="${meta.route}"` : null,
        meta.confidence ? `confidence=${meta.confidence}` : null,
        meta.model ? `model="${meta.model}"` : null,
    ].filter(Boolean);
    const suffix = metaBits.length ? ` (${metaBits.join('; ')})` : '';
    switch (status) {
        case 'start':
            return `Thinking...${suffix}`;
        case 'routing_start':
            return `Routing question...${suffix}`;
        case 'routing_done':
            return `Route selected${suffix}`;
        case 'rag_start':
            return `Searching records...${suffix}`;
        case 'rag_generate_done':
        case 'general_done':
        case 'rag_done':
            return `Answer ready${suffix}`;
        default:
            return `Working: ${status.replace(/_/g, ' ')}${suffix}`;
    }
};

const extractAnswerMeta = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') {
        return { answer: payload ? String(payload) : null, meta: null };
    }
    const data = payload as Record<string, any>;
    const nested = data.response ?? data.output ?? data.result ?? data.data ?? data.payload;
    if (nested && nested !== payload) {
        return extractAnswerMeta(nested);
    }
    const answer = data.answer ?? data.message ?? data.summary ?? data.text ?? null;
    const meta = {
        confidence: data.confidence,
        model: data.model,
        route: data.route ?? data.tool,
        top_k: data.top_k,
    };
    return {
        answer: typeof answer === 'string' ? answer : answer ? JSON.stringify(answer) : null,
        meta,
    };
};

export const HomeScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const styles = getHomeScreenStyles(currentTheme);
    const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
    const { user } = useAuth();
    const { activeClient } = useClient();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [history, setHistory] = useState<PayrollHistoryResponse[]>([]);
    const [entries, setEntries] = useState<PayrollEntryResponse[]>([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);

    const [query, setQuery] = useState('');
    const [askLoading, setAskLoading] = useState(false);
    const [askError, setAskError] = useState<string | null>(null);
    const [askStatusLines, setAskStatusLines] = useState<string[]>([]);
    const [askAnswer, setAskAnswer] = useState<string | null>(null);
    const [askMeta, setAskMeta] = useState<{ confidence?: number; model?: string; route?: string; top_k?: number } | null>(null);
    const [assistantOpen, setAssistantOpen] = useState(false);

    const loadDashboardData = useCallback(async () => {
        setDataLoading(true);
        setDataError(null);
        try {
            const [employeesList, historyList, entryList] = await Promise.all([
                employeeAPI.listEmployees(0, 500),
                historyAPI.listPayrollHistory(0, 500),
                entryAPI.listCurrentEntries(0, 500),
            ]);
            setEmployees(employeesList);
            setHistory(historyList);
            setEntries(entryList);
        } catch (err) {
            setDataError(err instanceof Error ? err.message : 'Failed to load payroll data');
        } finally {
            setDataLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboardData();
    }, [loadDashboardData, activeClient?.id]);

    const handleAsk = useCallback(async (overrideQuery?: string) => {
        const candidate = typeof overrideQuery === 'string' ? overrideQuery : query;
        const trimmed = candidate.trim();
        if (!trimmed) {
            Alert.alert('Ask Payroll AI', 'Type a question to get started.');
            return;
        }
        setAskLoading(true);
        setAskError(null);
        setAskAnswer(null);
        setAskMeta(null);
        setAskStatusLines(['Thinking...']);
        try {
            const payload = await historyAPI.searchPayrollHistory(trimmed, 5, (status, meta) => {
                const next = formatStatusLabel(status, meta);
                setAskStatusLines((prev) => {
                    if (status === 'start') return [next];
                    if (prev[prev.length - 1] === next) return prev;
                    return [...prev, next];
                });
            });
            const { answer, meta } = extractAnswerMeta(payload);
            setAskAnswer(answer);
            setAskMeta(meta);
        } catch (err) {
            setAskError(err instanceof Error ? err.message : 'Search failed');
        } finally {
            setAskLoading(false);
        }
    }, [query]);

    const employeeCount = employees.length;
    const missingSinCount = employees.filter((employee) => !employee.sin).length;

    const latestHistory = useMemo(() => {
        if (!history.length) return null;
        return [...history].sort((a, b) => {
            const aDate = new Date(a.pay_day ?? a.period_end ?? a.created_at ?? 0).getTime();
            const bDate = new Date(b.pay_day ?? b.period_end ?? b.created_at ?? 0).getTime();
            return bDate - aDate;
        })[0];
    }, [history]);

    const entrySummary = useMemo(() => {
        if (!entries.length) return null;
        const totalGross = entries.reduce((sum, entry) => sum + toNumberSafe(entry.gross ?? 0), 0);
        const totalNet = entries.reduce((sum, entry) => sum + toNumberSafe(entry.net), 0);
        const periodStart = entries[0].period_start ?? null;
        const periodEnd = entries[0].period_end ?? null;
        return {
            periodStart,
            periodEnd,
            totalGross,
            totalNet,
            count: entries.length,
        };
    }, [entries]);

    const quickActions = useMemo(() => ([
        { title: 'Scan T4 / IDs', subtitle: 'Auto-fill onboarding', icon: 'scan-outline' as const, route: 'Onboarding' as const },
        { title: 'Add Employee', subtitle: 'Invite or bulk import', icon: 'person-add-outline' as const, route: 'Onboarding' as const },
        { title: 'Run Payroll', subtitle: entrySummary ? `${entrySummary.count} entries ready` : 'Create a draft run', icon: 'cash-outline' as const, route: 'Payroll' as const },
        { title: 'Send Payslips', subtitle: latestHistory ? `Last run ${formatDateShort(latestHistory.pay_day ?? latestHistory.period_end)}` : 'No history yet', icon: 'paper-plane-outline' as const, route: 'Payroll' as const },
    ]), [entrySummary, latestHistory]);

    const insights = useMemo(() => ([
        {
            title: 'Missing tax IDs',
            detail: missingSinCount ? `${missingSinCount} employees need SIN` : 'All SINs on file',
            tone: missingSinCount ? 'error' as const : 'success' as const,
        },
        {
            title: 'Draft payroll',
            detail: entrySummary ? `${entrySummary.count} employees in current run` : 'No draft payroll yet',
            tone: entrySummary ? 'warning' as const : 'success' as const,
        },
        {
            title: 'Latest net pay',
            detail: latestHistory ? formatMoney(latestHistory.total_net ?? latestHistory.net) : 'No payroll history yet',
            tone: latestHistory ? 'success' as const : 'warning' as const,
        },
    ]), [missingSinCount, entrySummary, latestHistory]);

    const greetingName = user?.displayName ? ` ${user.displayName}` : '';

    const assistantBriefing = useMemo(() => ([
        { label: 'Employees', value: employeeCount ? String(employeeCount) : '—' },
        { label: 'Draft payroll', value: entrySummary ? `${entrySummary.count} entries` : 'None' },
        { label: 'Last run', value: latestHistory ? formatDateShort(latestHistory.pay_day ?? latestHistory.period_end) : 'No history' },
        { label: 'Missing tax IDs', value: missingSinCount ? String(missingSinCount) : '0' },
    ]), [employeeCount, entrySummary, latestHistory, missingSinCount]);

    const assistantActions = useMemo(() => ([
        {
            title: 'Ask Payroll AI',
            subtitle: 'Get a quick status summary',
            icon: 'sparkles-outline' as const,
            onPress: () => {
                setAssistantOpen(false);
                const question = 'Summarize our current payroll status and next steps.';
                setQuery(question);
                void handleAsk(question);
            },
        },
        {
            title: 'Review Payroll Runs',
            subtitle: 'Open draft and history',
            icon: 'cash-outline' as const,
            onPress: () => {
                setAssistantOpen(false);
                navigation.navigate('Payroll');
            },
        },
        {
            title: 'Onboard Employees',
            subtitle: 'Scan and verify documents',
            icon: 'scan-outline' as const,
            onPress: () => {
                setAssistantOpen(false);
                navigation.navigate('Onboarding');
            },
        },
        {
            title: 'Refresh Dashboard',
            subtitle: 'Sync latest payroll data',
            icon: 'refresh-outline' as const,
            onPress: () => {
                void loadDashboardData();
                setAssistantOpen(false);
                showToast('Refreshing', 'Fetching the latest payroll data.');
            },
        },
    ]), [handleAsk, loadDashboardData, navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.eyebrow}>Good morning{greetingName}</Text>
                        <Text style={styles.title}>{activeClient?.name ?? 'Your Payroll'}</Text>
                        <Text style={styles.subtitle}>All your people, one AI-first hub.</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={() => setAssistantOpen(true)}
                    >
                        <Ionicons name="sparkles" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={[colors.main, '#FFB45E', '#FFD6A1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.askCard}
                >
                    <Text style={styles.askTitle}>Ask Payroll AI</Text>
                    <Text style={styles.askSubtitle}>
                        From “What is a T4?” to “Run payroll for Apr 15”.
                    </Text>

                    <View style={styles.searchBar}>
                        <Ionicons name="sparkles-outline" size={18} color={currentTheme.colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Ask about payroll, taxes, or onboarding…"
                            placeholderTextColor={currentTheme.colors.textSecondary}
                            style={styles.searchInput}
                            returnKeyType="search"
                            onSubmitEditing={() => handleAsk()}
                        />
                        <View style={styles.searchActions}>
                            <Ionicons name="mic-outline" size={18} color={currentTheme.colors.textSecondary} />
                            <Ionicons name="scan-outline" size={18} color={currentTheme.colors.textSecondary} style={styles.searchActionIcon} />
                            <TouchableOpacity onPress={handleAsk} style={styles.searchActionIcon} disabled={askLoading}>
                                <Ionicons name="send" size={18} color={currentTheme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.askChips}>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Explain payroll taxes</Text>
                        </View>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>Set up bi-weekly run</Text>
                        </View>
                    </View>

                    {(askLoading || askAnswer || askError) && (
                        <View style={styles.askResult}>
                            {askStatusLines.map((line, index) => (
                                <Text key={`${line}-${index}`} style={styles.askStatusLine}>{line}</Text>
                            ))}
                            {askError && <Text style={styles.askStatusLine}>{askError}</Text>}
                            {askAnswer && <Text style={styles.askAnswer}>{askAnswer}</Text>}
                            {askMeta && (
                                <View style={styles.askMetaRow}>
                                    {askMeta.model && (
                                        <View style={styles.askMetaChip}>
                                            <Text style={styles.askMetaText}>{askMeta.model}</Text>
                                        </View>
                                    )}
                                    {askMeta.route && (
                                        <View style={styles.askMetaChip}>
                                            <Text style={styles.askMetaText}>{askMeta.route}</Text>
                                        </View>
                                    )}
                                    {askMeta.top_k ? (
                                        <View style={styles.askMetaChip}>
                                            <Text style={styles.askMetaText}>Top {askMeta.top_k}</Text>
                                        </View>
                                    ) : null}
                                    {(() => {
                                        const value = Number(askMeta.confidence);
                                        if (!Number.isFinite(value)) return null;
                                        const percent = Math.round(value > 1 ? value : value * 100);
                                        return (
                                            <View style={styles.askMetaChip}>
                                                <Text style={styles.askMetaText}>Confidence {percent}%</Text>
                                            </View>
                                        );
                                    })()}
                                </View>
                            )}
                        </View>
                    )}
                </LinearGradient>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <TouchableOpacity onPress={() => showToast('Coming soon', 'Quick action customization is on the way.')}>
                            <Text style={styles.sectionLink}>Customize</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actionGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.title}
                                style={styles.actionCard}
                                onPress={() => navigation.navigate(action.route)}
                            >
                                <View style={styles.actionIcon}>
                                    <Ionicons name={action.icon} size={20} color={colors.main} />
                                </View>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payroll Snapshot</Text>
                    <View style={styles.snapshotCard}>
                        <View style={styles.snapshotRow}>
                            <View style={styles.snapshotItem}>
                                <Text style={styles.snapshotLabel}>Current Period</Text>
                                <Text style={styles.snapshotValue}>
                                    {entrySummary ? formatDateRange(entrySummary.periodStart, entrySummary.periodEnd) : 'No draft run'}
                                </Text>
                            </View>
                            <View style={styles.snapshotItem}>
                                <Text style={styles.snapshotLabel}>Employees</Text>
                                <Text style={styles.snapshotValue}>{employeeCount || '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.snapshotRow}>
                            <View style={styles.snapshotItem}>
                                <Text style={styles.snapshotLabel}>Gross Pay</Text>
                                <Text style={styles.snapshotValue}>
                                    {entrySummary ? formatMoney(entrySummary.totalGross) : latestHistory ? formatMoney(latestHistory.total_gross) : '-'}
                                </Text>
                            </View>
                            <View style={styles.snapshotItem}>
                                <Text style={styles.snapshotLabel}>Taxes Due</Text>
                                <Text style={styles.snapshotValue}>
                                    {latestHistory ? formatMoney(latestHistory.taxes_and_deductions) : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.snapshotFooter}>
                            <Ionicons name="checkmark-circle" size={18} color={currentTheme.colors.success} />
                            <Text style={styles.snapshotFooterText}>
                                {dataLoading ? 'Updating payroll data...' : dataError ? 'Unable to sync payroll data' : entrySummary ? 'Draft payroll ready' : 'Connect your first payroll'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Insights</Text>
                    <View style={styles.insightsCard}>
                        {insights.map((insight, index) => (
                            <View
                                key={insight.title}
                                style={[
                                    styles.insightRow,
                                    index < insights.length - 1 ? styles.insightRowSpacing : null
                                ]}
                            >
                                <View style={styles.insightIcon}>
                                    <Ionicons
                                        name={insight.tone === 'success' ? 'trending-up' : insight.tone === 'warning' ? 'alert-circle' : 'alert'}
                                        size={18}
                                        color={insight.tone === 'success' ? currentTheme.colors.success : insight.tone === 'warning' ? currentTheme.colors.warning : currentTheme.colors.error}
                                    />
                                </View>
                                <View style={styles.insightText}>
                                    <Text style={styles.insightTitle}>{insight.title}</Text>
                                    <Text style={styles.insightDetail}>{insight.detail}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <Modal visible={assistantOpen} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalIcon}>
                                <Ionicons name="sparkles" size={18} color="#fff" />
                            </View>
                            <View style={styles.modalHeaderText}>
                                <Text style={styles.modalTitle}>AI Assistant</Text>
                                <Text style={styles.modalSubtitle}>Quick briefing and shortcuts</Text>
                            </View>
                            <TouchableOpacity onPress={() => setAssistantOpen(false)}>
                                <Ionicons name="close" size={20} color={currentTheme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBriefing}>
                            {assistantBriefing.map((item) => (
                                <View key={item.label} style={styles.modalBriefingItem}>
                                    <Text style={styles.modalBriefingLabel}>{item.label}</Text>
                                    <Text style={styles.modalBriefingValue}>{item.value}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            {assistantActions.map((action) => (
                                <TouchableOpacity
                                    key={action.title}
                                    style={styles.modalActionCard}
                                    onPress={action.onPress}
                                >
                                    <View style={styles.modalActionIcon}>
                                        <Ionicons name={action.icon} size={18} color={colors.main} />
                                    </View>
                                    <View style={styles.modalActionText}>
                                        <Text style={styles.modalActionTitle}>{action.title}</Text>
                                        <Text style={styles.modalActionSubtitle}>{action.subtitle}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={currentTheme.colors.textSecondary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
