import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-brand">
      <div className="hero__board">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 className="hero__brand" id="hero-brand">
              Pathly
            </h1>
            <p className="hero__headline">Post the work. Get matched. Move to WhatsApp.</p>
            <p className="hero__lede">
              Businesses post campaigns, nearby creators apply, and deals move to WhatsApp — Pathly makes
              the match, then gets out of the way.
            </p>
            <div className="btn-row" role="group" aria-label="Choose your path">
              <Link className="btn btn--ghost btn--equal" to="/signup/business">
                I’m a business
              </Link>
              <Link className="btn btn--ghost btn--equal" to="/signup/creator">
                I’m a creator
              </Link>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <article className="note note--tilt-left campaign-card" style={{ marginLeft: '4%' }}>
              <span className="pin" style={{ top: '-7px', left: '42%' }} />
              <div className="campaign-card__meta">
                <span>0.4 mi</span>
                <span>Cafe</span>
              </div>
              <h2 className="campaign-card__title">Reel + store visit</h2>
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                Morning rush vibe, 30–45 sec. Product + cash.
              </p>
              <span className="campaign-card__offer">$120 + free drinks</span>
            </article>

            <article className="note note--tilt-right applicant-chip">
              <span className="pin pin--alt" style={{ top: '-6px', right: '18%' }} />
              <div className="applicant-chip__row">
                <div className="applicant-chip__avatar">JL</div>
                <div>
                  <p className="applicant-chip__name">Jordan Lee</p>
                  <p className="applicant-chip__stats">12.4k · food · 3 collabs</p>
                </div>
              </div>
            </article>

            <div className="whatsapp-handoff">
              <div className="whatsapp-handoff__bar">
                <span className="whatsapp-handoff__dot" />
                Message on WhatsApp
              </div>
              <div className="whatsapp-handoff__bubble">
                You’re matched with Harbor Roasters. Deliverable and offer are set — say hi when you’re free.
              </div>
              <div className="whatsapp-handoff__meta">Handoff · no new inbox</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
