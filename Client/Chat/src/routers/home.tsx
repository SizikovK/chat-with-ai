import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="home-card">
      <h2>AI Chat</h2>
      <p>Простой чат с ассистентом и историей диалогов.</p>
      <div className="home-actions">
        <Link to="/chats">Открыть чаты</Link>
        <Link to="/login">Вход</Link>
      </div>
    </section>
  )
}