import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

const nearby = [
  { name: 'Harbor Roasters', dist: '0.4 mi', offer: '$120 + drinks' },
  { name: 'Bloom Studio', dist: '0.9 mi', offer: 'Product + $90' },
  { name: 'Northside Books', dist: '1.2 mi', offer: '$75 cash' },
]

export default function ForCreators() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="creators" ref={ref}>
      <div className={`container audience-grid ${className}`} style={{ direction: 'rtl' }}>
        <div style={{ direction: 'ltr' }}>
          <p className="section-kicker">For creators</p>
          <h2 className="section-title">Real briefs nearby. No cold outreach.</h2>
          <p className="section-lede">
            Open campaigns sorted by distance, offer shown before you apply. Once a business picks you, the
            thread opens on WhatsApp — you’re never waiting on yet another app notification.
          </p>
          <ul className="feature-list">
            <li>Discovery is local: distance first, not a global feed.</li>
            <li>Clear deliverable and payout before you shoot anything.</li>
            <li>Apply to what fits your niche — skip the strangers in your DMs.</li>
            <li>An Applied list tracks awaiting reply, on WhatsApp, and completed.</li>
          </ul>
          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Link className="btn" to="/signup/creator">
              Browse campaigns near you
            </Link>
          </div>
        </div>

        <aside className="note note--tilt-left" style={{ direction: 'ltr' }} aria-label="Nearby campaigns">
          <span className="pin" style={{ top: '-6px', left: '36%' }} />
          <p className="section-kicker" style={{ marginBottom: '0.5rem' }}>
            Near you
          </p>
          <h3 className="campaign-card__title" style={{ fontSize: '1.85rem', marginBottom: '0.85rem' }}>
            Open campaigns
          </h3>
          <div className="discovery-stack">
            {nearby.map((item) => (
              <div className="discovery-item" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.dist}</span>
                </div>
                <div className="discovery-item__offer">{item.offer}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
