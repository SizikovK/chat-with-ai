import AllChats from '../components/AllChats'
import ChatWindow from '../components/ChatWindow'

export default function Chat() {
  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <AllChats />
      </aside>
      <section className="chat-main">
        <ChatWindow />
      </section>
    </div>
  )
}
