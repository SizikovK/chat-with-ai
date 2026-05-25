import { useEffect, useState } from "react";
import { chatApi } from "../api/chatApi";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { IoSend, IoCopyOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearMessages, setMessages, setMessagesError, setMessagesLoading, setMessagesSending } from "../store/slices/messagesSlice";
import { setChats } from "../store/slices/chatsSlice";

export default function ChatWindow() {
    const dispatch = useAppDispatch();
    const { chatId } = useParams();
    const navigate = useNavigate();
    const messages = useAppSelector((state) => state.messages.items);
    const loading = useAppSelector((state) => state.messages.loading);
    const sending = useAppSelector((state) => state.messages.sending);
    const error = useAppSelector((state) => state.messages.error);
    const [input, setInput] = useState("");
    const [pendingUserText, setPendingUserText] = useState("");
    const [pendingAILoad, setPendingAILoad] = useState(false);

    useEffect(() => {
        let active = true;
        const load = async () => {
            if (sending) return;
            if (!chatId) {
                dispatch(clearMessages());
                return;
            }
            try {
                dispatch(setMessagesLoading(true));
                dispatch(setMessagesError(null));
                const data = await chatApi.getChatHistory(chatId);
                if (active) dispatch(setMessages(data));
            } catch (err) {
                if (active) dispatch(setMessagesError(err instanceof Error ? err.message : "Failed to load messages"));
            } finally {
                if (active) dispatch(setMessagesLoading(false));
            }
        };
        
        void load();
        return () => {
            active = false;
        };
    }, [chatId, dispatch, sending]);

    const onComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    const sorted_messages = messages.slice().sort((a, b) => a.message_index - b.message_index);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        dispatch(setMessagesError(null));
        setInput("");
        setPendingUserText(text);
        setPendingAILoad(true);

        try {
            dispatch(setMessagesSending(true));
            let currentChatId = chatId;
            if (!currentChatId) {
                currentChatId = await chatApi.createChat();
                navigate(`/chats/${currentChatId}`);
                try {
                    dispatch(setChats(await chatApi.getAllChats()));
                } catch {
                    // список чатов обновим позже, редирект не блокируем
                }
            }
            await chatApi.sendMessage(currentChatId, text);
            const history = await chatApi.getChatHistory(currentChatId);
            dispatch(setMessages(history));
            setPendingUserText("");
            setPendingAILoad(false);
        } catch (err) {
            dispatch(setMessagesError(err instanceof Error ? err.message : "Failed to send message"));
            setPendingAILoad(false);
        } finally {
            dispatch(setMessagesSending(false));
        }
    };

    const copyTextToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Текст успешно скопирован в буфер обмена!');
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    return (
        <div className={`chat-window ${chatId ? "chat-window--active" : "chat-window--new"}`}>
            <div className={`messages ${chatId || sorted_messages.length > 0 ? "" : "messages--hidden"}`}>
                {error ? <p>{error}</p> : null}

                {!loading && !error ? sorted_messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.role === "user" ? "message-row--user" : "message-row--assistant"}`}>
                        <div className="message-bubble">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        <button type="button" onClick={() => void copyTextToClipboard(msg.content)} className="message-copy-button">
                            <IoCopyOutline size={20}/>
                        </button>
                    </div>
                )) : null}

                {pendingUserText ? (
                    <div className="message-row message-row--user">
                        <div className="message-bubble">
                            <ReactMarkdown>{pendingUserText}</ReactMarkdown>
                        </div>
                    </div>
                ) : null}

                {pendingAILoad ? (
                    <div className="message-row message-row--assistant">
                        <div className="message-bubble">
                            <p>Думаю...</p>
                        </div>
                    </div>
                ) : null}
            </div>

            {!chatId ? (<h2 className="chat-start-title">С чего начнем?</h2>) : null}

            <form className="input-row" onSubmit={onSubmit}>
                <textarea
                    placeholder="Ну типа сюда писать надо..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onComposerKeyDown}
                    disabled={sending}
                    rows={1}
                />
                <button type="submit" disabled={!input.trim() || sending}>
                    <IoSend size={18} />
                </button>
            </form>
        </div>
    );
}
