import { useUserProfileStore } from 'src/store/user-profile-store';

const ClientSwitcher = () => {
    const fbClientName = useUserProfileStore((state) => state.fbClientName);

    return (
        <div className="relative group/menu pe-1 sm:pe-3 shrink-0">
            <span className="h-9 px-3 rounded-full border border-border bg-background inline-flex items-center text-sm text-foreground max-w-[220px] truncate">
                {fbClientName || 'No client'}
            </span>
        </div>
    );
};

export default ClientSwitcher;
