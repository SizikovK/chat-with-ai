import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { chatApi } from "../api/chatApi";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeChatFromList, setChats, setChatsError, setChatsLoading } from "../store/slices/chatsSlice";

export default function AllChats() {
    const dispatch = useAppDispatch();
    const chats = useAppSelector((state) => state.chats.items);
    const loading = useAppSelector((state) => state.chats.loading);
    const error = useAppSelector((state) => state.chats.error);
    const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let active = true;

        const loadChats = async () => {
            try {
                dispatch(setChatsLoading(true));
                dispatch(setChatsError(null));
                const data = await chatApi.getAllChats();
                if (active) {
                    dispatch(setChats(data));
                }
            } catch (err) {
                if (active) {
                    dispatch(setChatsError(err instanceof Error ? err.message : "Failed to load chats"));
                }
            } finally {
                if (active) {
                    dispatch(setChatsLoading(false));
                }
            }
        };

        void loadChats();
        return () => {
            active = false;
        };
    }, [dispatch]);

    const onDeleteChat = async (chat_id: string) => {
        if (deletingChatId) return;
        const shouldDelete = window.confirm("Удалить этот чат?");
        if (!shouldDelete) return;

        try {
            setDeletingChatId(chat_id);
            dispatch(setChatsError(null));
            const result = await chatApi.deleteChat(chat_id);
            if (result.deleted) {
                if (location.pathname === `/chats/${chat_id}`) {
                    navigate("/chats");
                }
                dispatch(removeChatFromList(chat_id));
            }
        } catch (err) {
            dispatch(setChatsError(err instanceof Error ? err.message : "Failed to delete chat"));
        } finally {
            setDeletingChatId(null);
        }
    };

    return (
        <div className="all-chats">
            <div className="sidebar-head">
                <h3>Чаты</h3>
                <button type="button" onClick={() => navigate("/chats")}>
                    <FaPlus size={10}/>
                </button>
            </div>

            {error ? <p>{error}</p> : null}

            {!loading && !error ? (
                <ul className="chat-list">
                    {chats.map((chat) => (
                        <li key={chat.id} className="chat-list-item">
                            <div className="chat-item-card">
                                <Link to={`/chats/${chat.id}`}>{chat.title}</Link>
                                <button type="button"
                                    onClick={() => void onDeleteChat(chat.id)}
                                    disabled={deletingChatId === chat.id}
                                >
                                    {deletingChatId === chat.id ? ("...") : (<MdDeleteForever size={20} />)}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
