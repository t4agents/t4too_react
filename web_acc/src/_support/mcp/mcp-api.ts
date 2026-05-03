import { apiFetch } from 'src/core/apihttp';

type MCPApiResult = {
    status: number;
    data: unknown;
};

async function parseApiResponse(response: Response): Promise<MCPApiResult> {
    const rawText = await response.text();
    let data: unknown;

    try {
        data = rawText ? JSON.parse(rawText) : {};
    } catch {
        data = { raw: rawText };
    }

    return {
        status: response.status,
        data,
    };
}

export const mcpAPI = {
    async health(): Promise<MCPApiResult> {
        const response = await apiFetch('/mcp_callback/acc/health');
        return parseApiResponse(response);
    },

    async diagnose(): Promise<MCPApiResult> {
        const agentsApiBaseUrl = import.meta.env.VITE_AGENTS_API_URL;
        const response = await fetch(`${agentsApiBaseUrl}/diagnose_mcp`);
        return parseApiResponse(response);
    },

    async runTool(tool: string, args: unknown): Promise<MCPApiResult> {
        const response = await apiFetch('/mcp_callback/acc/run_tool', {
            method: 'POST',
            body: JSON.stringify({ tool, arguments: args }),
        });
        return parseApiResponse(response);
    },

    async chat(message: string): Promise<MCPApiResult> {
        const response = await apiFetch('/mcp_callback/acc/chat', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
        return parseApiResponse(response);
    },
};
