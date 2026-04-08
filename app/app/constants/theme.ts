import { AppTheme } from '../types/index';
import { colors } from './colors';

export const lightTheme: AppTheme = {
    colors: {
        primary: colors.main,
        secondary: '#1F2937',
        background: '#F8F4EE',
        surface: '#FFFDF9',
        text: '#1F2937',
        textSecondary: '#6B7280',
        error: '#DC2626',
        success: '#16A34A',
        warning: '#F59E0B',
        border: '#E6D8C6',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
    },
};


export const darkTheme: AppTheme = {
    colors: {
        primary: colors.main,
        secondary: '#F8FAFC',
        background: '#101418',
        surface: '#1B222C',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        error: '#F87171',
        success: '#22C55E',
        warning: '#FBBF24',
        border: '#2A3442',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
    },
};

// export const darkTheme: AppTheme = {
//     colors: {
//         primary: '#3b82f6',
//         secondary: '#8b5cf6',
//         background: '#0f172a',
//         surface: 'rgba(255, 255, 255, 0.2)',
//         text: '#fff',
//         textSecondary: '#cfd8dc',
//         error: '#f87171',
//         success: '#4ade80',
//         warning: '#fbbf24',
//         border: '#334155',
//     },
//     spacing: {
//         xs: 4,
//         sm: 8,
//         md: 16,
//         lg: 24,
//         xl: 32,
//     },
//     borderRadius: {
//         sm: 4,
//         md: 8,
//         lg: 12,
//     },
// }; 
