import { useEffect } from 'react';
import userImg from 'src/assets/images/profile/user-1.jpg';
import supportImg from 'src/assets/images/dashboard/customer-support-img.png';
import { useUserProfileStore } from 'src/store/user-profile-store';
import { getUserAvatar } from 'src/lib/supabase';
import { useAuthStore } from 'src/store/auth-store';

const ProfileWelcome = () => {
    const authUser = useAuthStore((state) => state.user);
    const avatarUrl = useUserProfileStore((state) => state.fbAvatar) || getUserAvatar(authUser) || userImg;
    const firstName = useUserProfileStore((state) => state.fbName);
    const hydrateFromApi = useUserProfileStore((state) => state.hydrateFromApi);

    useEffect(() => {
        void hydrateFromApi();
    }, [hydrateFromApi]);

    // const welcomeText = useMemo(() => {
    //     if (firstName.trim()) return `Welcome back! ${firstName} 👋`;
    //     return 'Welcome back! 👋';
    // }, [firstName]);

    return (
        <div className="relative flex items-center justify-between rounded-lg p-6 bg-[radial-gradient(circle_at_top_left,rgba(242,133,0,0.18),transparent_55%),radial-gradient(circle_at_top_right,rgba(242,133,0,0.16),transparent_48%)]">
            <div className="flex items-center gap-3">
                <div>
                    <img src={avatarUrl} alt="user-img" width={50} height={50} className="rounded-full h-[50px] w-[50px] object-cover" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <h5 className="card-title">Welcome back! 👋</h5>
                    <p className="text-muted-foreground">Check your reports</p>
                </div>
            </div>

            {/* Support Image */}
            <div className="hidden sm:block absolute right-8 bottom-0">
                <img src={supportImg} alt="support-img" width={145} height={95} />
            </div>
        </div>
    );
};

export default ProfileWelcome;
