import AllChats from "../components/AllChats";
import ChatWindow from "../components/ChatWindow";

function Chat() {
    return (
        <div className="chat-layout">
            <section className="chat-sidebar">
                <AllChats/>
            </section>
            <section className="chat-main">
                <ChatWindow/>
            </section>
        </div>
    )
}

export default Chat