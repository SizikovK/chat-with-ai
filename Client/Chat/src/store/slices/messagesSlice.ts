import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatHistoryResponse } from "../../api/types";

type MessagesState = {
    items: ChatHistoryResponse[];
    loading: boolean;
    sending: boolean;
    error: string | null;
};

const initialState: MessagesState = {
    items: [],
    loading: false,
    sending: false,
    error: null
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<ChatHistoryResponse[]>) {
            state.items = action.payload;
        },
        addMessage(state, action: PayloadAction<ChatHistoryResponse>) {
            state.items.push(action.payload);
        },
        clearMessages(state) {
            state.items = [];
        },
        setMessagesLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setMessagesSending(state, action: PayloadAction<boolean>) {
            state.sending = action.payload;
        },
        setMessagesError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        }
    }
});

export const { setMessages, addMessage, clearMessages, setMessagesLoading, setMessagesSending, setMessagesError } = messagesSlice.actions;
export default messagesSlice.reducer;
