import GetAppButton from './GetAppButton'
import { useReveal } from '../hooks/useReveal'

export default function ForBusinesses() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section" id="businesses" ref={ref}>
      <div className={`container audience-grid ${className}`}>
        <div>
          <p className="section-kicker">For businesses</p>
          <h2 className="section-title">Post a campaign. Choose who you message.</h2>
          <p className="section-lede">
            Content without an agency retainer or cold DMs. You set the brief, see real applicants, and tap
            into WhatsApp only when someone looks right.
          </p>
          <ul className="feature-list">
            <li>Campaign in a few minutes: category, deliverable, and offer (cash, product, or both).</li>
            <li>Applicants arrive with follower count, niche, and past work — not blind pitches.</li>
            <li>You choose who to message. Nothing is automatic.</li>
            <li>A simple dashboard tracks what’s live, what’s closed, and who you’ve worked with.</li>
          </ul>
          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <GetAppButton className="btn btn--brand" />
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
              <dt>Category</dt>
              <dd>Salon · Williamsburg</dd>
            </div>
            <div>
              <dt>Deliverable</dt>
              <dd>6 stills for Instagram + Stories mention</dd>
            </div>
            <div>
              <dt>Offer</dt>
              <dd>$180 or cut + color + $60</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>4 applicants · you pick who to WhatsApp</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
