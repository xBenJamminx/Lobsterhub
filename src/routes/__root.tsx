import { createRootRoute, Outlet, Link, HeadContent, Scripts } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LobsterHub - Workflow Marketplace for Lobster' },
      { name: 'description', content: 'Discover and share Lobster workflows. Browse community-created automation pipelines for Clawdbot.' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="app-shell">
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
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
