import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js"

import BreadcrumbComp from "src/_layouts/shared/breadcrumb/BreadcrumbComp";
import CardBox from "src/components/shared/CardBox";
import profileImg from "src/assets/images/profile/user-1.jpg"
import { Button } from "src/components/ui/button";
import { meOrgAPI } from "src/_settings/me/me-org-api";
import UserProfileModal from "./MeOrgModal";
import { getUserAvatar, supabase } from "src/lib/supabase";
import { notifyToast } from "src/lib/toast";
import { useUserProfileStore } from "src/store/user-profile-store";
import LoadingSpinner from "src/components/shared/LoadingSpinner";
import { useAuthStore } from "src/store/auth-store";

const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded-md bg-gray-200/70 dark:bg-gray-800/70 ${className}`} />
);

const CLOUDINARY_CLOUD_NAME = "ddcgr5g8z";
const CLOUDINARY_UPLOAD_PRESET = "t4preset";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_AVATAR_DIMENSION = 512;

async function resizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);

        image.onload = () => {
            const scale = Math.min(
                1,
                MAX_AVATAR_DIMENSION / image.width,
                MAX_AVATAR_DIMENSION / image.height,
            );

            const targetWidth = Math.max(1, Math.round(image.width * scale));
            const targetHeight = Math.max(1, Math.round(image.height * scale));

            const canvas = document.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const context = canvas.getContext("2d");
            if (!context) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error("Could not process image."));
                return;
            }

            context.drawImage(image, 0, 0, targetWidth, targetHeight);
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(objectUrl);
                    if (!blob) {
                        reject(new Error("Could not encode image."));
                        return;
                    }
                    resolve(blob);
                },
                "image/jpeg",
                0.82,
            );
        };

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Invalid image file."));
        };

        image.src = objectUrl;
    });
}

const UserProfile = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"personal" | "organization" | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const defaultProfileImg = profileImg;
    const [currentProfileImg, setCurrentProfileImg] = useState(defaultProfileImg);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const setStoreNames = useUserProfileStore((state) => state.setFBName);
    const setStoreAvatar = useUserProfileStore((state) => state.setFBAvatar);
    const authUser = useAuthStore((state) => state.user);

    const BCrumb = [
        { to: "/", title: "Home", },
        { title: "User Profile", },
    ];

    const [personal, setPersonal] = useState({
        firstName: "", lastName: "", email: "", phone: "", position: "", facebook: "", twitter: "",
        github: "", reddit: "", country: "", state: "", pin: "", zip: "", taxNo: "", note: ""
    });

    const [organization, setOrganization] = useState({
        name: "", legal_name: "", operating_name: "", business_type: "", incorporation_date: "",
        employee_count: "", type: "", business_number: "", payroll_account_number: "", remittance_frequency: "",
        tax_year_end: "", wsib_number: "", eht_account: "", street_address: "", city: "",
        province: "", country: "", postal_code: "", phone: "", email: ""
    });
    
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [tempPersonal, setTempPersonal] = useState(personal);
    const [tempOrganization, setTempOrganization] = useState(organization);

    useEffect(() => {
        const fetchUser = async () => {
            setLoadingProfile(true);
            try {
                const authAvatar = getUserAvatar(authUser);
                if (authAvatar) {
                    setCurrentProfileImg(authAvatar);
                }

                const [userResult, myOrgResult] = await Promise.allSettled([
                    meOrgAPI.getMe(),
                    meOrgAPI.getMyOrg(),
                    // clientsAPI.getCurrentOrg(auth.currentUser?.uid || ""),
                ]);
                

                if (userResult.status === "fulfilled") {
                    const user = userResult.value;
                    setPersonal({
                        firstName: user.first_name || "",
                        lastName: user.last_name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        position: user.position || "",
                        facebook: user.facebook || "",
                        twitter: user.twitter || "",
                        github: user.github || "",
                        reddit: user.reddit || "",
                        country: user.country || "",
                        state: user.state || "",
                        pin: user.pin || "",
                        zip: user.zip || "",
                        note: user.note || "",
                        taxNo: user.tax_no || ""
                    });
                    setStoreNames([user.first_name, user.last_name].filter(Boolean).join(' '));
                    if (user.profile_picture && !authAvatar) {
                        setCurrentProfileImg(user.profile_picture);
                        setStoreAvatar(user.profile_picture);
                    }
                } else {
                    console.error('Failed to fetch user:', userResult.reason);
                }

                if (myOrgResult.status === "fulfilled") {
                    const myOrg = myOrgResult.value;
                    console.log("Loaded organization (get_myorg):", myOrg);
                    setOrganizationId(myOrg.id);
                    setOrganization({
                        name: myOrg.name || "",
                        legal_name: myOrg.legal_name || "",
                        operating_name: myOrg.operating_name || "",
                        business_type: myOrg.business_type || "",
                        incorporation_date: myOrg.incorporation_date ? myOrg.incorporation_date.slice(0, 10) : "",
                        employee_count: myOrg.employee_count !== undefined && myOrg.employee_count !== null ? String(myOrg.employee_count) : "",
                        type: myOrg.type || "",
                        business_number: myOrg.business_number || "",
                        payroll_account_number: myOrg.payroll_account_number || "",
                        remittance_frequency: myOrg.remittance_frequency || "",
                        tax_year_end: myOrg.tax_year_end ? myOrg.tax_year_end.slice(0, 10) : "",
                        wsib_number: myOrg.wsib_number || "",
                        eht_account: myOrg.eht_account || "",
                        street_address: myOrg.street_address || "",
                        city: myOrg.city || "",
                        province: myOrg.province || "",
                        country: myOrg.country || "",
                        postal_code: myOrg.postal_code || "",
                        phone: myOrg.phone || "",
                        email: myOrg.email || ""
                    });
                } else {
                    console.error('Failed to fetch organization:', myOrgResult.reason);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchUser();
    }, [authUser, setStoreAvatar, setStoreNames]);

    const handleAvatarSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!authUser) {
            notifyToast({ message: "Please sign in again to update profile image.", variant: "error" });
            return;
        }

        if (!file.type.startsWith("image/")) {
            notifyToast({ message: "Please select an image file.", variant: "error" });
            return;
        }

        setUploadingAvatar(true);
        try {
            const processedBlob = await resizeImage(file);

            if (processedBlob.size > MAX_UPLOAD_BYTES) {
                throw new Error("Image is too large after processing. Please choose a smaller image.");
            }

            const formData = new FormData();
            formData.append("file", processedBlob, `avatar-${authUser.id}.jpg`);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", `users/${authUser.id}`);

            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            );

            if (!uploadResponse.ok) {
                const detail = await uploadResponse.text();
                throw new Error(`Cloudinary upload failed: ${detail}`);
            }

            const uploadResult = await uploadResponse.json();
            const photoUrl = uploadResult?.secure_url as string | undefined;

            if (!photoUrl) {
                throw new Error("Cloudinary did not return a secure URL.");
            }

            const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: photoUrl } });
            if (updateError) {
                throw updateError;
            }
            setCurrentProfileImg(photoUrl);
            setStoreAvatar(photoUrl);

            notifyToast({ message: "Profile image updated.", variant: "success" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to upload profile image.";
            notifyToast({ message, variant: "error" });
            console.error("Failed to upload profile image:", error);
        } finally {
            setUploadingAvatar(false);
        }
    };

    useEffect(() => {
        if (openModal && modalType === "personal") {
            setTempPersonal(personal);
        }
        if (openModal && modalType === "organization") {
            setTempOrganization(organization);
        }
    }, [openModal, modalType, personal, organization]);

    const handleSave = async () => {
        setIsSavingProfile(true);
        try {
            if (modalType === "personal") {
                const updatedUser = await meOrgAPI.patchMe({
                    first_name: tempPersonal.firstName,
                    last_name: tempPersonal.lastName,
                    email: tempPersonal.email,
                    phone: tempPersonal.phone,
                    position: tempPersonal.position,
                    facebook: tempPersonal.facebook,
                    twitter: tempPersonal.twitter,
                    github: tempPersonal.github,
                    reddit: tempPersonal.reddit,
                    country: tempPersonal.country,
                    state: tempPersonal.state,
                    pin: tempPersonal.pin,
                    zip: tempPersonal.zip,
                    note: tempPersonal.note,
                    tax_no: tempPersonal.taxNo
                });
                setPersonal({
                    firstName: updatedUser.first_name || "",
                    lastName: updatedUser.last_name || "",
                    email: updatedUser.email || "",
                    phone: updatedUser.phone || "",
                    position: updatedUser.position || "",
                    facebook: updatedUser.facebook || "",
                    twitter: updatedUser.twitter || "",
                    github: updatedUser.github || "",
                    reddit: updatedUser.reddit || "",
                    country: updatedUser.country || "",
                    state: updatedUser.state || "",
                    pin: updatedUser.pin || "",
                    zip: updatedUser.zip || "",
                    taxNo: updatedUser.tax_no || "",
                    note: updatedUser.note || ""
                });
                setStoreNames([updatedUser.first_name, updatedUser.last_name].filter(Boolean).join(' '));
                if (updatedUser.profile_picture) {
                    setCurrentProfileImg(updatedUser.profile_picture);
                    setStoreAvatar(updatedUser.profile_picture);
                }
            }
            if (modalType === "organization") {
                const updatedMyOrg = await meOrgAPI.patchOrg({
                    name: tempOrganization.name,
                    legal_name: tempOrganization.legal_name,
                    operating_name: tempOrganization.operating_name,
                    business_type: tempOrganization.business_type,
                    incorporation_date: tempOrganization.incorporation_date || undefined,
                    employee_count: tempOrganization.employee_count ? Number(tempOrganization.employee_count) : undefined,
                    type: tempOrganization.type,
                    business_number: tempOrganization.business_number,
                    payroll_account_number: tempOrganization.payroll_account_number,
                    remittance_frequency: tempOrganization.remittance_frequency,
                    tax_year_end: tempOrganization.tax_year_end || undefined,
                    wsib_number: tempOrganization.wsib_number,
                    eht_account: tempOrganization.eht_account,
                    street_address: tempOrganization.street_address,
                    city: tempOrganization.city,
                    province: tempOrganization.province,
                    country: tempOrganization.country,
                    postal_code: tempOrganization.postal_code,
                    phone: tempOrganization.phone,
                    email: tempOrganization.email,
                });
                setOrganization({
                    name: updatedMyOrg.name || "",
                    legal_name: updatedMyOrg.legal_name || "",
                    operating_name: updatedMyOrg.operating_name || "",
                    business_type: updatedMyOrg.business_type || "",
                    incorporation_date: updatedMyOrg.incorporation_date ? updatedMyOrg.incorporation_date.slice(0, 10) : "",
                    employee_count: updatedMyOrg.employee_count !== undefined && updatedMyOrg.employee_count !== null ? String(updatedMyOrg.employee_count) : "",
                    type: updatedMyOrg.type || "",
                    business_number: updatedMyOrg.business_number || "",
                    payroll_account_number: updatedMyOrg.payroll_account_number || "",
                    remittance_frequency: updatedMyOrg.remittance_frequency || "",
                    tax_year_end: updatedMyOrg.tax_year_end ? updatedMyOrg.tax_year_end.slice(0, 10) : "",
                    wsib_number: updatedMyOrg.wsib_number || "",
                    eht_account: updatedMyOrg.eht_account || "",
                    street_address: updatedMyOrg.street_address || "",
                    city: updatedMyOrg.city || "",
                    province: updatedMyOrg.province || "",
                    country: updatedMyOrg.country || "",
                    postal_code: updatedMyOrg.postal_code || "",
                    phone: updatedMyOrg.phone || "",
                    email: updatedMyOrg.email || ""
                });
            }
            setOpenModal(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const socialLinks = [
        { href: personal.facebook || "#", icon: "streamline-logos:facebook-logo-2-solid" },
        { href: personal.twitter || "#", icon: "streamline-logos:x-twitter-logo-solid" },
        { href: personal.github || "#", icon: "ion:logo-github" },
        { href: personal.reddit || "#", icon: "ion:logo-reddit" },
    ];

    return (
        <>
            <BreadcrumbComp title="User Profile" items={BCrumb} />
            <div className="flex flex-col gap-6">
                {loadingProfile && (
                    <CardBox className="p-4">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <LoadingSpinner size="md" />
                        </div>
                    </CardBox>
                )}
                <CardBox className="p-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl relative w-full break-words">
                        <div>
                            {loadingProfile ? (
                                <Skeleton className="h-20 w-20 rounded-full" />
                            ) : (
                                <div className="relative">
                                    <img src={currentProfileImg} alt="image" width={80} height={80} className="rounded-full object-cover h-20 w-20" />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarSelect}
                                    />
                                    <button
                                        type="button"
                                        className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-60"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingAvatar}
                                        title="Change avatar"
                                    >
                                        {uploadingAvatar ? (
                                            <LoadingSpinner size="sm" variant="dots" className="text-white" />
                                        ) : (
                                            <Icon icon="ic:round-photo-camera" width="16" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full">
                            <div className="flex flex-col sm:text-left text-center gap-1.5">
                                {loadingProfile ? (
                                    <Skeleton className="h-5 w-48" />
                                ) : (
                                    <h5 className="card-title">{personal.firstName || "Your"} {personal.lastName || "Name"}</h5>
                                )}
                                <div className="flex flex-wrap items-center gap-1 md:gap-3">
                                    {loadingProfile ? (
                                        <Skeleton className="h-4 w-28" />
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{personal.position || "Your position"}</p>
                                    )}
                                    <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                    {loadingProfile ? (
                                        <Skeleton className="h-4 w-32" />
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{personal.country || "Your country"}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {socialLinks.map((item, index) => (
                                    loadingProfile ? (
                                        <Skeleton key={index} className="h-11 w-11 rounded-full" />
                                    ) : (
                                        <a key={index} href={item.href} target="_blank" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full shadow-md border border-ld hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                            <Icon icon={item.icon} width="20" height="20" />
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBox>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <CardBox className="p-6 overflow-hidden">
                        <h5 className="card-title mb-6">Personal Information</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32 mb-6">
                            {loadingProfile ? (
                                <>
                                    <div><p className="text-xs text-gray-500">First Name</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                    <div><p className="text-xs text-gray-500">Last Name</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                    <div><p className="text-xs text-gray-500">Email</p><Skeleton className="mt-2 h-4 w-48" /></div>
                                    <div><p className="text-xs text-gray-500">Phone</p><Skeleton className="mt-2 h-4 w-36" /></div>
                                    <div><p className="text-xs text-gray-500">Position</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                    <div><p className="text-xs text-gray-500">country</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                    <div><p className="text-xs text-gray-500">Province / State</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                    <div><p className="text-xs text-gray-500">PIN Code</p><Skeleton className="mt-2 h-4 w-32" /></div>
                                    <div><p className="text-xs text-gray-500">Postal Code / ZIP</p><Skeleton className="mt-2 h-4 w-44" /></div>
                                    <div><p className="text-xs text-gray-500">Tax No.</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                </>
                            ) : (
                                <>
                                    <div><p className="text-xs text-gray-500">First Name</p><p>{personal.firstName || "Your first name"}</p></div>
                                    <div><p className="text-xs text-gray-500">Last Name</p><p>{personal.lastName || "Your last name"}</p></div>
                                    <div><p className="text-xs text-gray-500">Email</p><p>{personal.email || "you@example.com"}</p></div>
                                    <div><p className="text-xs text-gray-500">Phone</p><p>{personal.phone || "+1 (555) 123-4567"}</p></div>
                                    <div><p className="text-xs text-gray-500">Position</p><p>{personal.position || "Your position"}</p></div>
                                    <div><p className="text-xs text-gray-500">country</p><p>{personal.country || "Country"}</p></div>
                                    <div><p className="text-xs text-gray-500">Province / State</p><p>{personal.state || "Province or State"}</p></div>
                                    <div><p className="text-xs text-gray-500">Postal Code / ZIP</p><p>{personal.zip || "A1A 1A1 or 12345"}</p></div>
                                    <div><p className="text-xs text-gray-500">Tax ID No.</p><p>{personal.taxNo || "Tax ID number"}</p></div>
                                    <div><p className="text-xs text-gray-500">Note</p><p>{personal.note || "Add a note"}</p></div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => { setModalType("personal"); setOpenModal(true); }} color={"primary"} className="flex items-center gap-1.5 rounded-md" disabled={loadingProfile}>
                                <Icon icon="ic:outline-edit" width="18" height="18" /> Edit
                            </Button>
                        </div>
                    </CardBox>

                    <CardBox className="p-6 overflow-hidden">
                        <h5 className="card-title mb-6">My Organization</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32 mb-6">
                            {loadingProfile ? (
                                <>
                                    <div><p className="text-xs text-gray-500">Legal Name</p><Skeleton className="mt-2 h-4 w-48" /></div>
                                    <div><p className="text-xs text-gray-500">Business Type</p><Skeleton className="mt-2 h-4 w-40" /></div>
                                    <div><p className="text-xs text-gray-500">Business Number (BN)</p><Skeleton className="mt-2 h-4 w-44" /></div>
                                    <div><p className="text-xs text-gray-500">Payroll Account No.</p><Skeleton className="mt-2 h-4 w-44" /></div>
                                    <div><p className="text-xs text-gray-500">Remittance Frequency</p><Skeleton className="mt-2 h-4 w-36" /></div>
                                    <div><p className="text-xs text-gray-500">Tax Year End</p><Skeleton className="mt-2 h-4 w-32" /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">Address</p>
                                        <Skeleton className="mt-2 h-4 w-60" />
                                    </div>
                                    <div><p className="text-xs text-gray-500">Phone</p><Skeleton className="mt-2 h-4 w-36" /></div>
                                    <div><p className="text-xs text-gray-500">Country</p><Skeleton className="mt-2 h-4 w-32" /></div>
                                    <div><p className="text-xs text-gray-500">Employee Count</p><Skeleton className="mt-2 h-4 w-36" /></div>
                                </>
                            ) : (
                                <>
                                    <div><p className="text-xs text-gray-500">Name</p><p>{organization.name || "Organization name"}</p></div>
                                    <div><p className="text-xs text-gray-500">Business Type</p><p>{organization.business_type || "Corporation, partnership, etc."}</p></div>
                                    <div><p className="text-xs text-gray-500">Business Number (BN)</p><p>{organization.business_number || "123456789"}</p></div>
                                    <div><p className="text-xs text-gray-500">Payroll Account No.</p><p>{organization.payroll_account_number || "123456789RP0001"}</p></div>
                                    <div><p className="text-xs text-gray-500">Remittance Frequency</p><p>{organization.remittance_frequency || "Monthly"}</p></div>
                                    <div><p className="text-xs text-gray-500">Tax Year End</p><p>{organization.tax_year_end || "YYYY-MM-DD"}</p></div>
                                    <div>
                                        <p className="text-xs text-gray-500">Address</p>
                                        <p>
                                            {[
                                                organization.street_address || "Street address",
                                                organization.city || "City",
                                                organization.province || "Province or State",
                                                organization.postal_code || "A1A 1A1 or 12345",
                                            ].join(", ")}
                                        </p>
                                    </div>
                                    <div><p className="text-xs text-gray-500">Phone</p><p>{organization.phone || "+1 (555) 123-4567"}</p></div>
                                    <div><p className="text-xs text-gray-500">Country</p><p>{organization.country || "Canada"}</p></div>
                                    <div><p className="text-xs text-gray-500">Employee Count</p><p>{organization.employee_count || "Number of employees"}</p></div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => { setModalType("organization"); setOpenModal(true); }} color={"primary"} className="flex items-center gap-1.5 rounded-md" disabled={loadingProfile}>
                                <Icon icon="ic:outline-edit" width="18" height="18" /> Edit
                            </Button>
                        </div>
                    </CardBox>
                </div>
            </div>

            <UserProfileModal
                open={openModal}
                onOpenChange={setOpenModal}
                modalType={modalType}
                tempPersonal={tempPersonal}
                setTempPersonal={setTempPersonal}
                tempOrganization={tempOrganization}
                setTempOrganization={setTempOrganization}
                onSave={handleSave}
                isSaving={isSavingProfile}
            />
        </>
    );
};

export default UserProfile;
