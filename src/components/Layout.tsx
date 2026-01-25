import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">🦞</span>
        <span>LobsterHub</span>
      </Link>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Browse</Link>
        <Link to="/submit" className="nav-link">Submit</Link>
        <a href="https://docs.clawd.bot/tools/lobster" target="_blank" rel="noopener noreferrer" className="nav-link">
          Docs
        </a>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Built for{' '}
        <a href="https://clawd.bot" target="_blank" rel="noopener noreferrer">
          Clawdbot
        </a>
        {' '}• Powered by{' '}
        <a href="https://clawdhub.com" target="_blank" rel="noopener noreferrer">
          ClawdHub
        </a>
      </p>
    </footer>
  )
}
