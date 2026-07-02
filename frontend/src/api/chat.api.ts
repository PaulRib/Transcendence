import { API_BASE_URL } from "../config/api";
import type { FriendUser } from "./friends.api";

export type ChatMessage = {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    sender: FriendUser;
    receiver: FriendUser;
};

export type SendMessagePayload = {
    content: string;
};

export async function getConversation(userId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${userId}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to load conversation');
    }

    return response.json();
}

export async function sendMessage(receiverId: string, payload: SendMessagePayload): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${receiverId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
}