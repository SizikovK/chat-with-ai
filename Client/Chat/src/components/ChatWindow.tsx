function ChatWindow() {
  return (
    <div>
      <div className="messages">
        <p><strong>You:</strong> Привет</p>
        <p><strong>Assistant:</strong> Привет! Это временный интерфейс без API.</p>
      </div>
      <form className="input-row" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Type message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default ChatWindow
