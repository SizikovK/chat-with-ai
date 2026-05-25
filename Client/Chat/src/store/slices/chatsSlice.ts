import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AllChatAPIResponse } from "../../api/types";

type ChatsState = {
    items: AllChatAPIResponse[];
    loading: boolean;
    error: string | null;
};

const initialState: ChatsState = {
    items: [],
    loading: true,
    error: null
};

const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setChats(state, action: PayloadAction<AllChatAPIResponse[]>) {
            state.items = action.payload;
        },
        setChatsLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setChatsError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        removeChatFromList(state, action: PayloadAction<string>) {
            state.items = state.items.filter((chat) => chat.id !== action.payload);
        },
        clearChats(state) {
            state.items = [];
            state.loading = false;
            state.error = null;
        }
    }
});

export const { setChats, setChatsLoading, setChatsError, removeChatFromList, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
