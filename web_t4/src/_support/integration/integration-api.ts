import { apiFetch } from 'src/core/apihttp';

interface InvoicePaymentsCsvParams {
    startDate: string;
    endDate: string;
}

const parseErrorDetail = async (response: Response): Promise<string> => {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
        const jsonBody = await response.json().catch(() => null);
        if (typeof jsonBody?.detail === 'string') {
            return jsonBody.detail;
        }
        return JSON.stringify(jsonBody ?? {});
    }
    return response.text().catch(() => '');
};

export const integrationAPI = {
    async downloadInvoicePaymentsCsv(params: InvoicePaymentsCsvParams): Promise<Blob> {
        const queryParams = new URLSearchParams({
            start_date: params.startDate,
            end_date: params.endDate,
        });

        const response = await apiFetch(`/invoice_payments_csv?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                Accept: 'text/csv,application/json',
            },
        });

        if (!response.ok) {
            const errorDetail = (await parseErrorDetail(response)).trim();
            const message = errorDetail
                ? `Download failed with status ${response.status}: ${errorDetail}`
                : `Download failed with status ${response.status}`;
            throw new Error(message);
        }

        return response.blob();
    },
};
