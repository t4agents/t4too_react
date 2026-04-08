// app/types/navigation.tsx
import { StormDocumentation } from './index';

// For your main tab navigator
export type RootTabParamList = {
    Home: undefined;
    Payroll: undefined;
    Onboarding: undefined;
    Settings: undefined;
};

// Legacy stack types kept for existing screens that haven't been removed yet.
export type StormStackParamList = {
    StormList: undefined;
    CaptureStorm: undefined;
    StormDetail: { storm: StormDocumentation };
};

