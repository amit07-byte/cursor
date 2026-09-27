import GetAppButton from './GetAppButton'
import { useReveal } from '../hooks/useReveal'

export default function ClosingCTA() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section closing" id="get-started" ref={ref}>
      <div className={`container ${className}`}>
        <div className="closing-board">
          <p className="section-kicker">Your move</p>
          <h2 className="section-title">Open Pathly.</h2>
          <p className="section-lede">
            Post a campaign or join one. Start a real conversation — no agency, no cold DM.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <GetAppButton className="btn btn--brand btn--equal" />
          </div>
        </div>
      </div>
    </section>
  )
}
