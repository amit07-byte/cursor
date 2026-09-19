import { useReveal } from '../hooks/useReveal'

export default function WhyWhatsApp() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section whatsapp-section" id="why-whatsapp" ref={ref}>
      <div className={`container ${className}`}>
        <div className="whatsapp-panel">
          <div>
            <div className="whatsapp-badge">
              <span className="whatsapp-badge__icon" aria-hidden="true" />
              Why WhatsApp
            </div>
            <h2 className="section-title" style={{ maxWidth: '18ch' }}>
              We remove a step. We don’t skip one.
            </h2>
            <p className="section-lede" style={{ marginBottom: '0.5rem' }}>
              Pathly handles discovery and qualification. WhatsApp handles the conversation — the same way
              it would if a friend introduced you. No new inbox to check.
            </p>
            <div className="split-points">
              <article>
                <h3>Locked in before chat</h3>
                <p>
                  Deliverable and payout are agreed on Pathly first. WhatsApp is for timing, references, and
                  getting the work done — not renegotiating the deal in DMs.
                </p>
              </article>
              <article>
                <h3>A feature, not a shortcut</h3>
                <p>
                  Both sides already live on WhatsApp. Pathly’s job is the match. After that, we get out of
                  the way on purpose.
                </p>
              </article>
            </div>
          </div>

          <div className="chat-mock" aria-hidden="true">
            <div className="chat-mock__msg chat-mock__msg--in">
              Hi Jordan — loved your cafe reel last week. Saturday 10am still good for the Harbor shoot?
            </div>
            <div className="chat-mock__msg chat-mock__msg--out">
              Yes! I’ll bring the brief we locked on Pathly. See you then.
            </div>
            <div className="chat-mock__locked">
              Agreed on Pathly: Reel + store visit · $120 + drinks
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
