import GetAppButton from './GetAppButton'
import { useReveal } from '../hooks/useReveal'

export default function ClosingCTA() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section closing" id="get-started" ref={ref}>
      <div className={`container ${className}`}>
        <div className="closing-board">
          <p className="section-kicker">Your move</p>
          <h2 className="section-title">Get the app.</h2>
          <p className="section-lede">
            Join the waitlist with your name and email. We’ll let you know when Pathly is ready.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <GetAppButton className="btn btn--brand btn--equal" />
          </div>
        </div>
      </div>
    </section>
  )
}
