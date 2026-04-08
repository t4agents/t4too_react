import { Alert, Platform, ToastAndroid } from 'react-native';

export const showToast = (title: string, message?: string) => {
    if (Platform.OS === 'android') {
        const text = message ? `${title}: ${message}` : title;
        ToastAndroid.show(text, ToastAndroid.SHORT);
        return;
    }

    Alert.alert(title, message ?? '');
};
