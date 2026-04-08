import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { darkTheme, lightTheme } from '../constants/theme';
import { getOnboardingScreenStyles } from '../constants/styles';
import { colors } from '../constants/colors';
import { employeeAPI, Employee } from '../services/employees';
import { useClient } from '../contexts/ClientContext';

export const OnboardingScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const styles = getOnboardingScreenStyles(currentTheme);
    const { activeClient } = useClient();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const loadEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await employeeAPI.listEmployees(0, 500);
            setEmployees(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadEmployees();
    }, [loadEmployees, activeClient?.id]);

    const pendingDocs = useMemo(() => {
        return employees
            .map((employee) => {
                const fullName = `${employee.first_name ?? ''} ${employee.last_name ?? ''}`.trim() || 'Unnamed';
                let status = 'Ready';
                let doc = 'All forms complete';
                if (!employee.sin) {
                    status = 'Missing SIN';
                    doc = 'SIN card needed';
                } else if (!employee.email) {
                    status = 'Needs review';
                    doc = 'Email missing';
                }
                return { name: fullName, doc, status };
            })
            .filter((item) => item.status !== 'Ready')
            .slice(0, 3);
    }, [employees]);

    const handleCreateEmployee = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            Alert.alert('Missing info', 'First and last name are required.');
            return;
        }
        try {
            await employeeAPI.createEmployee({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim() || undefined,
            });
            setModalVisible(false);
            setFirstName('');
            setLastName('');
            setEmail('');
            await loadEmployees();
        } catch (err) {
            Alert.alert('Failed to add employee', err instanceof Error ? err.message : 'Try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Onboarding</Text>
                    <Text style={styles.subtitle}>Scan and verify employee documents in minutes.</Text>
                </View>

                <View style={styles.scanCard}>
                    <View style={styles.scanIcon}>
                        <Ionicons name="scan" size={26} color="#fff" />
                    </View>
                    <View style={styles.scanText}>
                        <Text style={styles.scanTitle}>Smart Scan</Text>
                        <Text style={styles.scanSubtitle}>
                            Extract data from T4s, IDs, and bank forms automatically.
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.scanButton} onPress={() => Alert.alert('Scan', 'Document scanning is coming soon.')}>
                        <Ionicons name="camera-outline" size={18} color="#fff" />
                        <Text style={styles.scanButtonText}>Scan</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Import Options</Text>
                    <View style={styles.importGrid}>
                        <TouchableOpacity style={styles.importCard} onPress={() => Alert.alert('Upload CSV', 'CSV import is coming soon.')}>
                            <Ionicons name="cloud-upload-outline" size={20} color={colors.main} />
                            <Text style={styles.importTitle}>Upload CSV</Text>
                            <Text style={styles.importSubtitle}>Bulk employee list</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.importCard} onPress={() => Alert.alert('Offer Letters', 'Auto-extract is coming soon.')}>
                            <Ionicons name="document-text-outline" size={20} color={colors.main} />
                            <Text style={styles.importTitle}>Offer Letters</Text>
                            <Text style={styles.importSubtitle}>Auto-extract details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.importCard} onPress={() => Alert.alert('Verify IDs', 'ID verification is coming soon.')}>
                            <Ionicons name="shield-checkmark-outline" size={20} color={colors.main} />
                            <Text style={styles.importTitle}>Verify IDs</Text>
                            <Text style={styles.importSubtitle}>Instant validation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.importCard} onPress={() => setModalVisible(true)}>
                            <Ionicons name="mail-outline" size={20} color={colors.main} />
                            <Text style={styles.importTitle}>Send Invite</Text>
                            <Text style={styles.importSubtitle}>Self-serve onboarding</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pending Review</Text>
                        <TouchableOpacity onPress={() => {}}>
                            <Text style={styles.sectionLink}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.pendingCard}>
                        {pendingDocs.length === 0 ? (
                            <Text style={styles.pendingDoc}>
                                {loading ? 'Loading employees...' : error ? error : 'No pending documents.'}
                            </Text>
                        ) : pendingDocs.map((doc, index) => (
                            <View
                                key={doc.name}
                                style={[
                                    styles.pendingRow,
                                    index < pendingDocs.length - 1 ? styles.pendingRowSpacing : null
                                ]}
                            >
                                <View style={styles.pendingIcon}>
                                    <Ionicons name="document-text-outline" size={18} color={currentTheme.colors.textSecondary} />
                                </View>
                                <View style={styles.pendingText}>
                                    <Text style={styles.pendingName}>{doc.name}</Text>
                                    <Text style={styles.pendingDoc}>{doc.doc}</Text>
                                </View>
                                <View style={[
                                    styles.pendingStatus,
                                    doc.status === 'Ready'
                                        ? styles.statusReady
                                        : doc.status === 'Needs review'
                                            ? styles.statusReview
                                            : styles.statusMissing
                                ]}>
                                    <Text style={styles.pendingStatusText}>{doc.status}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Invite Employee</Text>
                        <Text style={styles.modalSubtitle}>Add a new employee to start onboarding.</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="First name"
                            placeholderTextColor={currentTheme.colors.textSecondary}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Last name"
                            placeholderTextColor={currentTheme.colors.textSecondary}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Email (optional)"
                            placeholderTextColor={currentTheme.colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={handleCreateEmployee}>
                                <Text style={styles.modalButtonText}>Send Invite</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
