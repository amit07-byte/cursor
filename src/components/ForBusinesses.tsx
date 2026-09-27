import GetAppButton from './GetAppButton'
import { useReveal } from '../hooks/useReveal'

export default function ForBusinesses() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="businesses" ref={ref}>
      <div className={`container audience-grid ${className}`}>
        <div>
          <p className="section-kicker">For businesses</p>
          <h2 className="section-title">Post a campaign. Chat with creators who join.</h2>
          <p className="section-lede">
            Find creators for promotional content without an agency retainer or cold DMs. Describe what you
            need, get joins, and negotiate in Pathly chat.
          </p>
          <ul className="feature-list">
            <li>Campaign in minutes: goal, niche, deliverable, budget, and deadline.</li>
            <li>Email alert when a creator joins — then open the thread.</li>
            <li>Talk rate and deliverables directly. No forced payment flow.</li>
            <li>Close or leave campaigns active from your dashboard.</li>
          </ul>
          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <GetAppButton className="btn btn--brand">Start as a business</GetAppButton>
          </div>
        </div>

        <aside className="note note--tilt-right sample-campaign" aria-label="Example campaign">
          <span className="pin pin--alt" style={{ top: '-6px', left: '48%' }} />
          <p className="section-kicker" style={{ marginBottom: '0.25rem' }}>
            What a campaign looks like
          </p>
          <h3 className="campaign-card__title" style={{ fontSize: '2rem' }}>
            Weekend photo set
          </h3>
          <dl>
            <div>
              <dt>Niche</dt>
              <dd>Beauty</dd>
            </div>
            <div>
              <dt>Deliverable</dt>
              <dd>Static post + Stories mention</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>$180</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Active · joins open chat</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
