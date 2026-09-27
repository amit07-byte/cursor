import BrandLogo from './BrandLogo'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__row">
        <div className="footer__brand">
          <BrandLogo size={32} />
          <div className="footer__tagline">An open marketplace for brand campaigns and creators.</div>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <a href="/#how-it-works">How it works</a>
          <a href="/#why-chat">Why chat</a>
          <a href="/#faq">FAQ</a>
          <Link className="footer__get-app" to="/auth">
            Open Pathly
          </Link>
        </nav>
      </div>
    </footer>
  )
}
