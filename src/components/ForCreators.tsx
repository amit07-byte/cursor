import GetAppButton from './GetAppButton'
import { useReveal } from '../hooks/useReveal'

const open = [
  { name: 'Harbor Roasters', niche: 'Food & drink', offer: '$150' },
  { name: 'Northside Fitness', niche: 'Fitness', offer: '$120' },
  { name: 'Bloom Studio', niche: 'Beauty', offer: '$180' },
]

export default function ForCreators() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="creators" ref={ref}>
      <div className={`container audience-grid ${className}`} style={{ direction: 'rtl' }}>
        <div style={{ direction: 'ltr' }}>
          <p className="section-kicker">For creators</p>
          <h2 className="section-title">Paid brand work without cold DMs.</h2>
          <p className="section-lede">
            Browse open campaigns that match your niche and platform. Join the ones that fit, then negotiate
            in chat — no agent required.
          </p>
          <ul className="feature-list">
            <li>Filter by niche, platform, deliverable type, and budget range.</li>
            <li>Budget and brief shown before you join.</li>
            <li>One tap Join opens chat with the business.</li>
            <li>Set your starting rate on your profile so businesses know your floor.</li>
          </ul>
          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <GetAppButton className="btn btn--brand">Start as a creator</GetAppButton>
          </div>
        </div>

        <aside className="note note--tilt-left" style={{ direction: 'ltr' }} aria-label="Open campaigns">
          <span className="pin" style={{ top: '-6px', left: '36%' }} />
          <p className="section-kicker" style={{ marginBottom: '0.5rem' }}>
            Open now
          </p>
          <h3 className="campaign-card__title" style={{ fontSize: '1.85rem', marginBottom: '0.85rem' }}>
            Campaign feed
          </h3>
          <div className="discovery-stack">
            {open.map((item) => (
              <div className="discovery-item" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.niche}</span>
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
