import { Link, Outlet } from 'react-router-dom'

function Root() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Mina Agent</h1>
        <nav className="topnav">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/chats">Chats</Link>
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}

export default Root
