import GetAppButton from './GetAppButton'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-brand">
      <div className="hero__board">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="hero__logo-row" aria-hidden="true">
              <img className="hero__logo" src="/pathly-mark.png" alt="" width={80} height={64} decoding="async" />
            </p>
            <h1 className="hero__brand" id="hero-brand">
              Pathly
            </h1>
            <p className="hero__headline">Post the work. Start the chat.</p>
            <p className="hero__lede">
              Businesses post campaigns. Creators join the ones that fit. Negotiate rate, deliverables,
              and timeline in-app — on your own terms.
            </p>
            <div className="btn-row">
              <GetAppButton className="btn btn--brand btn--equal" />
              <Link className="btn btn--ghost btn--equal" to="/auth">
                Sign in
              </Link>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <article className="note note--tilt-left campaign-card" style={{ marginLeft: '5%' }}>
              <span className="tape" />
              <span className="pin pin--brand" style={{ top: '-8px', left: '42%' }} />
              <div className="campaign-card__meta">
                <span>Food & drink</span>
                <span>Instagram</span>
              </div>
              <h2 className="campaign-card__title">Reel + store visit</h2>
              <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
                Morning rush vibe, 30–45 sec. Budget listed up front.
              </p>
              <span className="campaign-card__offer">$150 budget</span>
            </article>

            <article className="note note--tilt-right applicant-chip">
              <span className="pin pin--alt" style={{ top: '-7px', right: '16%' }} />
              <div className="applicant-chip__row">
                <div className="applicant-chip__avatar">JL</div>
                <div>
                  <p className="applicant-chip__name">Jordan Lee</p>
                  <p className="applicant-chip__stats">5k–15k · food · joined</p>
                </div>
              </div>
            </article>

            <div className="whatsapp-handoff">
              <div className="whatsapp-handoff__bar">
                <span className="whatsapp-handoff__dot" />
                In-app chat
              </div>
              <div className="whatsapp-handoff__bubble">
                Hi Harbor — I’d love to shoot Saturday morning. My rate for a 40s reel is $150. Does that
                work?
              </div>
              <div className="whatsapp-handoff__meta">Join → chat · no agency middleman</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
