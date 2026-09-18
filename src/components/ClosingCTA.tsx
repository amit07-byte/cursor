import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

export default function ClosingCTA() {
  const { ref, className } = useReveal<HTMLElement>()

  return (
    <section className="section closing" id="get-started" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">Your move</p>
        <h2 className="section-title">Pick a path.</h2>
        <p className="section-lede">
          Businesses post campaigns. Creators browse nearby. Same page, two doors — equal weight.
        </p>
        <div className="btn-row">
          <Link className="btn btn--ghost btn--equal" to="/signup/business">
            I’m a business
          </Link>
          <Link className="btn btn--ghost btn--equal" to="/signup/creator">
            I’m a creator
          </Link>
        </div>
      </div>
    </section>
  )
}
