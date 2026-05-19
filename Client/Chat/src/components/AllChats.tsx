import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { chatApi, type ChatDto } from '../api/chatApi'

function AllChats() {
  const [chats, setChats] = useState<ChatDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadChats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await chatApi.getAllChats()
        if (isMounted) {
          setChats(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load chats')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadChats()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <div className="sidebar-head">
        <h3>Чаты</h3>
        <button type="button">Новый чат</button>
      </div>

      {loading ? <p>Loading chats...</p> : null}
      {error ? <p>{error}</p> : null}

      {!loading && !error ? (
        <ul className="chat-list">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link to={`/chat/${chat.id}`}>{chat.title}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default AllChats
