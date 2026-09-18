import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand-link" to="/" aria-label="Pathly home">
          <BrandLogo size={40} />
        </Link>
        <ul className="nav__links">
          <li>
            <a href="/#how-it-works">How it works</a>
          </li>
          <li>
            <a href="/#businesses">Businesses</a>
          </li>
          <li>
            <a href="/#creators">Creators</a>
          </li>
          <li>
            <a href="/#why-whatsapp">Why WhatsApp</a>
          </li>
          <li>
            <a href="/#faq">FAQ</a>
          </li>
        </ul>
        <div className="nav__cta">
          <Link className="btn btn--ghost" to="/signup/business">
            I’m a business
          </Link>
          <Link className="btn btn--ghost" to="/signup/creator">
            I’m a creator
          </Link>
        </div>
      </div>
    </header>
  )
}
