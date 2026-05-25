import { HTTPClient } from "./HTTPClient";
import { get_stored_user_id } from "../auth/localAuth";
import type { AllChatAPIResponse, ChatHistoryResponse, MessageType, ModelResponseType } from "./types";

const API_BASE_URL = "http://127.0.0.1:8000"
const httpClient = new HTTPClient(API_BASE_URL)

const get_user_id = (): string => {
    const user_id = get_stored_user_id();
    if (!user_id) {
        throw new Error("Пользователь не авторизован");
    }
    return user_id;
};

const user_header = (user_id: string) => ({ "User-Id": user_id });

export const chatApi = {
    getAllChats(): Promise<AllChatAPIResponse[]> {
        const user_id = get_user_id();
        return httpClient.request<undefined, AllChatAPIResponse[]>(
            "GET",
            `/users/${user_id}/chats`
        );
    },
    createChat(): Promise<string> {
        const user_id = get_user_id();
        return httpClient.request<undefined, string>(
            "POST",
            `/users/${user_id}/chats`
        );
    },
    deleteChat(chat_id: string): Promise<{ deleted: boolean }> {
        const user_id = get_user_id();
        return httpClient.request<undefined, { deleted: boolean }>(
            "DELETE",
            `/chats/${chat_id}`,
            user_header(user_id)
        );
    },
    getChat(chat_id: string): Promise<AllChatAPIResponse> {
        const user_id = get_user_id();
        return httpClient.request<undefined, AllChatAPIResponse>(
            "GET",
            `/chats/${chat_id}`,
            user_header(user_id)
        );
    },
    getChatHistory(chat_id: string): Promise<ChatHistoryResponse[]> {
        const user_id = get_user_id();
        return httpClient.request<undefined, ChatHistoryResponse[]>(
            "GET",
            `/chats/${chat_id}/messages`,
            user_header(user_id)
        );
    },
    sendMessage(chat_id: string, message: string): Promise<ModelResponseType> {
        const user_id = get_user_id();
        const body: MessageType = { message };
        return httpClient.request<MessageType, ModelResponseType>(
            "POST",
            `/chats/${chat_id}/messages`,
            user_header(user_id),
            body
        );
    }
};
