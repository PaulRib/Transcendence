import { API_BASE_URL } from "../config/api";

export type FriendUser = {
    id: string;
    username: string;
    avatar_url: string | null;
    is_online: boolean;
};

export type Friendship = {
    id: string;
    status: string;
    created_at: string;
    requester_id: string;
    addressee_id: string;
    requester: FriendUser;
    addressee: FriendUser;
};

export type FriendRequest = {
    id: string;
    status: string;
    created_at: string;
    requester_id: string;
    addressee_id: string;
    requester: FriendUser;
};

export type FriendshipRecord = {
    id: string;
    status: string;
    created_at: string;
    requester_id: string;
    addressee_id: string;
};

export async function getFriends(): Promise<Friendship[]> {
    const response = await fetch(`${API_BASE_URL}/friends`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to load friends');
    }

    return response.json();
}

export async function getReceivedFriendRequests(): Promise<FriendRequest[]> {
    const response = await fetch(`${API_BASE_URL}/friends/requests`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to load friend requests');
    }

    return response.json();
}

export async function sendFriendRequest(targetUserId: string): Promise<FriendshipRecord> {
    const response = await fetch(`${API_BASE_URL}/friends/requests/${targetUserId}`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to send friend request');
    }

    return response.json();
}

export async function acceptFriendRequest(requestId: string): Promise<FriendshipRecord> {
    const response = await fetch(`${API_BASE_URL}/friends/requests/${requestId}/accept`, {
        method: 'PATCH',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to accept friend request');
    }

    return response.json();
}

export async function deleteFriendship(friendshipId: string): Promise<FriendshipRecord> {
    const response = await fetch(`${API_BASE_URL}/friends/${friendshipId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete friendship');
    }

    return response.json();
}