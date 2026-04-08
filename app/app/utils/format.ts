export const formatDateShort = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start || !end) return '-';
    return `${formatDateShort(start)} - ${formatDateShort(end)}`;
};

export const toNumberSafe = (value: unknown): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const formatMoney = (value: unknown) => {
    const num = toNumberSafe(value);
    if (!Number.isFinite(num)) return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(num);
};
