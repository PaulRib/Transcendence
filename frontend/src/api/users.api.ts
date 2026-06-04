import { API_BASE_URL } from "../config/api";
import type { AuthUser } from "./auth.api";

export type UpdateProfilePayload = {
    username?: string;
    avatar_url?: string | null;
};

export type UpdatePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export type UpdatePasswordResponse = {
    message: string;
};

export async function getMyProfile(token: string): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Profile request failed');
    }
    return response.json();
}

export async function updateMyProfile(token: string, payload: UpdateProfilePayload): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Profile update request failed');
    }

    return response.json();
}

export async function updateMyPassword(token: string, payload: UpdatePasswordPayload): Promise<UpdatePasswordResponse> {
    const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if(!response.ok) {
        throw new Error('Password update request failed');
    }

    return response.json();
}
