import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

export default function ClosingCTA() {
  const { ref, className } = useReveal<HTMLElement>()
  const [submitted, setSubmitted] = useState(false)

  function onWaitlist(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="section closing" id="waitlist" ref={ref}>
      <div className={`container ${className}`}>
        <p className="section-kicker">Your move</p>
        <h2 className="section-title">Pick a path. Or join the waitlist.</h2>
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

        <div className="note waitlist">
          <span className="pin pin--alt" style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
          <h3 className="waitlist__title">Not in a live city yet?</h3>
          <p className="waitlist__lede">
            Leave your email, city, and whether you’re a business or creator. We’ll open the door when
            coverage reaches you.
          </p>
          {submitted ? (
            <p className="waitlist__success" role="status">
              You’re on the list. We’ll be in touch when Pathly lands in your area.
            </p>
          ) : (
            <form className="waitlist__form" onSubmit={onWaitlist}>
              <div className="field">
                <label htmlFor="waitlist-email">Email</label>
                <input id="waitlist-email" name="email" type="email" placeholder="you@email.com" required />
              </div>
              <div className="waitlist__row">
                <div className="field">
                  <label htmlFor="waitlist-city">City</label>
                  <input id="waitlist-city" name="city" type="text" placeholder="Austin, TX" required />
                </div>
                <div className="field">
                  <label htmlFor="waitlist-role">Role</label>
                  <select id="waitlist-role" name="role" required defaultValue="">
                    <option value="" disabled>
                      Select…
                    </option>
                    <option value="business">Business</option>
                    <option value="creator">Creator</option>
                  </select>
                </div>
              </div>
              <button className="btn btn--forest" type="submit">
                Join the waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
