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

export async function getMyProfile(): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Profile request failed');
    }
    return response.json();
}

export async function getUserByUsername(username: string): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/users/by-username/${username}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('User not found');
    }

    return response.json();
}

export async function updateMyProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Profile update request failed');
    }

    return response.json();
}

export async function uploadMyAvatar(token: string, file: File): Promise<AuthUser> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Avatar upload request failed');
    }

    return response.json();
}

export async function updateMyPassword(token: string, payload: UpdatePasswordPayload): Promise<UpdatePasswordResponse> {
export async function updateMyPassword(payload: UpdatePasswordPayload): Promise<UpdatePasswordResponse> {
    const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if(!response.ok) {
        throw new Error('Password update request failed');
    }

    return response.json();
}
