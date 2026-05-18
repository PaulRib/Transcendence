import { API_BASE_URL } from "../config/api";

export type HealthResponse = {
    status: string;
};

export async function getBackendHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
        throw new Error('Backend health request failed');
    }

    return response.json();
}