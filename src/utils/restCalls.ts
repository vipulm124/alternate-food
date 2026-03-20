import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export function get_token() {
    try {
        const sessionStr = localStorage.getItem('af-auth-token');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            return session?.access_token || null;
        }
    } catch (e) {
        console.error("Error parsing auth token", e);
    }
    return null;
}

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const token = get_token();
    const headers: Record<string, any> = { ...config?.headers };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get<T>(url, { ...config, headers });
    return response.data;
}

export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const token = get_token();
    const headers: Record<string, any> = { ...config?.headers };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post<T>(url, data, { ...config, headers });
    return response.data;
}