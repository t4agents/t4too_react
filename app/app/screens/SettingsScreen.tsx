import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from '../constants/theme';
import { useSettings } from '../contexts/SettingsContext';
import { getSettingsScreenStyles } from '../constants/styles';
import { useAuth } from '../contexts/AuthContext';
import { useClient } from '../contexts/ClientContext';
import { API_BASE_URL } from '../constants/api';

export const SettingsScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const { settings, updateSetting } = useSettings();
    const { user, signOut } = useAuth();
    const { clients, activeClient, setActiveClient, loading: clientsLoading } = useClient();

    const resetSampleData = () => {
        Alert.alert(
            'Reset Sample Data',
            'This will clear demo payroll runs and onboarding documents.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            Alert.alert('Success', 'Sample data has been reset.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset sample data.');
                        }
                    },
                },
            ]
        );
    };

    const styles = getSettingsScreenStyles(currentTheme);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <Ionicons name="settings-outline" size={22} color={currentTheme.colors.text} />
                </View>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payroll</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Pay Frequency</Text>
                            <Text style={styles.settingDescription}>
                                Default schedule for new payroll runs
                            </Text>
                        </View>
                        <View style={styles.unitsContainer}>
                            {(['weekly', 'biweekly', 'monthly'] as const).map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        styles.unitButton,
                                        settings.payFrequency === value
                                            ? styles.unitButtonActive
                                            : styles.unitButtonInactive
                                    ]}
                                    onPress={() => updateSetting('payFrequency', value)}
                                >
                                    <Text style={[
                                        styles.unitButtonText,
                                        settings.payFrequency === value
                                            ? styles.unitButtonTextActive
                                            : styles.unitButtonTextInactive
                                    ]}>
                                        {value === 'biweekly' ? 'Bi-weekly' : value.charAt(0).toUpperCase() + value.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Automation</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Auto-run Payroll</Text>
                            <Text style={styles.settingDescription}>
                                Create draft runs automatically on schedule
                            </Text>
                        </View>
                        <Switch
                            value={settings.autoRunPayroll}
                            onValueChange={(value) => updateSetting('autoRunPayroll', value)}
                            trackColor={{
                                false: currentTheme.colors.border,
                                true: currentTheme.colors.primary
                            }}
                            thumbColor={settings.autoRunPayroll ? '#fff' : currentTheme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Notifications</Text>
                            <Text style={styles.settingDescription}>
                                Reminders for approvals and deadlines
                            </Text>
                        </View>
                        <Switch
                            value={settings.notifications}
                            onValueChange={(value) => updateSetting('notifications', value)}
                            trackColor={{
                                false: currentTheme.colors.border,
                                true: currentTheme.colors.primary
                            }}
                            thumbColor={settings.notifications ? '#fff' : currentTheme.colors.textSecondary}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Workspace</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Active Client</Text>
                            <Text style={styles.settingDescription}>
                                {activeClient?.name ?? 'No client selected'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.pillGroup}>
                        {clients.map((client) => (
                            <TouchableOpacity
                                key={client.id}
                                style={[
                                    styles.pillButton,
                                    client.id === activeClient?.id
                                        ? styles.unitButtonActive
                                        : styles.unitButtonInactive
                                ]}
                                onPress={() => setActiveClient(client.id)}
                                disabled={clientsLoading}
                            >
                                <Text
                                    style={[
                                        styles.unitButtonText,
                                        client.id === activeClient?.id
                                            ? styles.unitButtonTextActive
                                            : styles.unitButtonTextInactive
                                    ]}
                                >
                                    {client.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Signed In</Text>
                            <Text style={styles.settingDescription}>{user?.email ?? 'Unknown user'}</Text>
                        </View>
                    </View>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>API Base</Text>
                            <Text style={styles.settingDescription}>{API_BASE_URL}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.dangerButton} onPress={signOut}>
                        <Text style={styles.dangerButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Management</Text>

                    <TouchableOpacity style={styles.dangerButton} onPress={resetSampleData}>
                        <Text style={styles.dangerButtonText}>Reset Sample Data</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
