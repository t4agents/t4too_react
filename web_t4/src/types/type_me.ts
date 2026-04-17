export interface InterfaceUser {
    id?: string;
    user_id?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    position?: string;
    profile_picture?: string;
    facebook?: string;
    twitter?: string;
    github?: string;
    reddit?: string;
    current_biz_id?: string;
    biz_id?: string;
    tenant_id?: string;
    ten_id?: string;
    country?: string;
    state?: string;
    pin?: string;
    zip?: string;
    tax_no?: string;
    created_at?: string;
    updated_at?: string;
    note?: string;
}

export type PersonalState = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    facebook: string;
    twitter: string;
    github: string;
    reddit: string;
    country: string;
    state: string;
    pin: string;
    zip: string;
    taxNo: string;
    note: string;
};

export const EMPTY_PERSONAL: PersonalState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    facebook: "",
    twitter: "",
    github: "",
    reddit: "",
    country: "",
    state: "",
    pin: "",
    zip: "",
    taxNo: "",
    note: "",
};

export function mapUserToPersonal(user?: Partial<InterfaceUser> | null): PersonalState {
    return {
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        position: user?.position || "",
        facebook: user?.facebook || "",
        twitter: user?.twitter || "",
        github: user?.github || "",
        reddit: user?.reddit || "",
        country: user?.country || "",
        state: user?.state || "",
        pin: user?.pin || "",
        zip: user?.zip || "",
        taxNo: user?.tax_no || "",
        note: user?.note || "",
    };
}

export function mapPersonalToUserPatch(personal: PersonalState): Partial<InterfaceUser> {
    return {
        first_name: personal.firstName,
        last_name: personal.lastName,
        email: personal.email,
        phone: personal.phone,
        position: personal.position,
        facebook: personal.facebook,
        twitter: personal.twitter,
        github: personal.github,
        reddit: personal.reddit,
        country: personal.country,
        state: personal.state,
        pin: personal.pin,
        zip: personal.zip,
        tax_no: personal.taxNo,
        note: personal.note,
    };
}
