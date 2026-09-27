import { useReveal } from '../hooks/useReveal'

export default function WhyWhatsApp() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section whatsapp-section" id="why-chat" ref={ref}>
      <div className={`container ${className}`}>
        <div className="whatsapp-panel">
          <div>
            <div className="whatsapp-badge">
              <span className="whatsapp-badge__icon" aria-hidden="true" />
              Why in-app chat
            </div>
            <h2 className="section-title" style={{ maxWidth: '18ch' }}>
              Connection first. Payments later.
            </h2>
            <p className="section-lede" style={{ marginBottom: '0.5rem' }}>
              MVP chat is plain messaging — no AI drafts, no escrow. We validate that a join → chat handoff
              is enough friction reduction to get deals started.
            </p>
            <div className="split-points">
              <article>
                <h3>Join opens the thread</h3>
                <p>
                  When a creator joins a campaign, Pathly creates a connection and drops both sides into the
                  same conversation. No cold DM, no agency intro.
                </p>
              </article>
              <article>
                <h3>Negotiate on your terms</h3>
                <p>
                  Rate, deliverables, timeline, and payment stay between you. Pathly doesn’t process money
                  in v1 — on purpose.
                </p>
              </article>
            </div>
          </div>

          <div className="chat-mock" aria-hidden="true">
            <div className="chat-mock__msg chat-mock__msg--in">
              Hi Jordan — loved your cafe reel last week. Saturday 10am still good for the Harbor shoot?
            </div>
            <div className="chat-mock__msg chat-mock__msg--out">
              Yes! My rate for a 40s reel is $150. I can send a draft cut by Sunday night.
            </div>
            <div className="chat-mock__locked">
              Campaign on Pathly: Reel + store visit · $150 budget · Food & drink
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
