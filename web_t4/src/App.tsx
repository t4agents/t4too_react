import { RouterProvider } from 'react-router';
import router from './routes/Router';
import './assets/css/globals.css';
import { ThemeProvider } from './components/provider/theme-provider';
import ToastHost from './components/shared/ToastHost';
import { useEffect } from 'react';
import { supabase, getUserAvatar } from './lib/supabase';
import { useUserProfileStore } from './store/user-profile-store';
import { useAuthStore } from './store/auth-store';
import config from './config';

function App() {
    useEffect(() => {
        const setAuthUser = useAuthStore.getState().setUser;
        const setAuthReady = useAuthStore.getState().setReady;

        const setAvatarUrl = useUserProfileStore.getState().setFBAvatar;
        const hydrateFromApi = useUserProfileStore.getState().hydrateFromApi;
        const setFBClient = useUserProfileStore.getState().setFBClient;

        const initializeAuth = async () => {
            const { data } = await supabase.auth.getSession();
            const user = data.session?.user ?? null;
            setAuthUser(user);
            setAuthReady(true);
            setAvatarUrl(getUserAvatar(user));
            setFBClient(user?.user_metadata?.sbu_client_name);
            
            // if (user) {
            //     void hydrateFromApi();
            // }
        };

        void initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            setAuthUser(user);
            setAuthReady(true);
            setAvatarUrl(getUserAvatar(user));
            setFBClient(user?.user_metadata?.sbu_client_name);
            // if (user) {
            //     void hydrateFromApi();
            // }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <ThemeProvider
                defaultTheme={config.ui.defaultTheme as 'light' | 'dark' | 'system'}
                storageKey="vite-ui-theme"
            >
                <RouterProvider router={router} />
                <ToastHost />
            </ThemeProvider>
        </>
    );
}

export default App;
