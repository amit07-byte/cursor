import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__row">
        <div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', letterSpacing: '0.05em' }}>
            Pathly
          </strong>
          <div>A neighborhood board for local campaigns.</div>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <a href="/#how-it-works">How it works</a>
          <a href="/#why-whatsapp">Why WhatsApp</a>
          <a href="/#waitlist">Waitlist</a>
          <Link to="/signup/business">Businesses</Link>
          <Link to="/signup/creator">Creators</Link>
        </nav>
      </div>
    </footer>
  )
}
