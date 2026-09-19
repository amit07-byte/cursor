import BrandLogo from './BrandLogo'
import GetAppButton from './GetAppButton'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__row">
        <div className="footer__brand">
          <BrandLogo size={32} />
          <div className="footer__tagline">A neighborhood board for local campaigns.</div>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <a href="/#how-it-works">How it works</a>
          <a href="/#why-whatsapp">Why WhatsApp</a>
          <a href="/#faq">FAQ</a>
          <GetAppButton className="footer__get-app" />
        </nav>
      </div>
    </footer>
  )
}
