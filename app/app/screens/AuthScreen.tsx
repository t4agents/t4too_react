import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme } from '../constants/theme';
import { getAuthScreenStyles } from '../constants/styles';
import { useAuth } from '../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const styles = getAuthScreenStyles(currentTheme);
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing info', 'Please enter an email and password.');
            return;
        }
        setLoading(true);
        try {
            if (mode === 'signup') {
                await signUp(email.trim(), password.trim(), displayName.trim() || undefined);
            } else {
                await signIn(email.trim(), password.trim());
            }
        } catch (err) {
            Alert.alert('Authentication failed', err instanceof Error ? err.message : 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>T4 Payroll AI</Text>
                <Text style={styles.subtitle}>
                    {mode === 'signup'
                        ? 'Create your account to sync payroll data.'
                        : 'Sign in to your payroll workspace.'}
                </Text>

                {mode === 'signup' && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Your name"
                            placeholderTextColor={currentTheme.colors.textSecondary}
                            style={styles.input}
                        />
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@company.com"
                        placeholderTextColor={currentTheme.colors.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        placeholderTextColor={currentTheme.colors.textSecondary}
                        secureTextEntry
                        style={styles.input}
                    />
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.primaryButtonText}>{loading ? 'Working...' : mode === 'signup' ? 'Create Account' : 'Sign In'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                >
                    <Text style={styles.secondaryButtonText}>
                        {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
