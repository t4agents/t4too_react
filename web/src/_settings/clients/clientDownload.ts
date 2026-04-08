import type { InterfaceBE } from 'src/types/type_be';

const headers = [
    'Client Name',
    'City',
    'Province',
    'Phone',
    'Email',
    'Employee Count',
];

export const downloadClientsCsv = (rows: InterfaceBE[]) => {
    if (!rows.length) return;
    const dataRows = rows.map((row) => [
        row.name,
        row.city,
        row.province,
        row.phone,
        row.email,
        row.employee_count,
    ]);
    const csv = [headers, ...dataRows]
        .map((line) => line.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clients.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
