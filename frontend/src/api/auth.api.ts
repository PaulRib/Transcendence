import { API_BASE_URL } from "../config/api";

export type AuthUser = {
    id: string;
    username: string;
    avatar_url: string | null;
};

export type LoginResponse = {
    user: AuthUser;
    access_token: string;
};

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    identifier: string;
    password: string;
};

export async function registerUser(payload: RegisterPayload): Promise<AuthUser>{
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok){
        const errorBody = await response.json();

        const errorMessage = Array.isArray(errorBody.message)
            ? errorBody.message.join('\n')
            : errorBody.message || 'Register request failed';

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok){
        const errorBody = await response.json();

        const errorMessage = Array.isArray(errorBody.message)
            ? errorBody.message.join('\n')
            : errorBody.message || 'Login request failed';

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Current user request failed');
    }

    return response.json();
}
