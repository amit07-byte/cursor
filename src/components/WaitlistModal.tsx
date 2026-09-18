import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useWaitlist } from '../hooks/useWaitlist'

export default function WaitlistModal() {
  const { open, closeWaitlist } = useWaitlist()
  const [submitted, setSubmitted] = useState(false)
  const titleId = useId()
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWaitlist()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, closeWaitlist])

  function handleClose() {
    setSubmitted(false)
    closeWaitlist()
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (!open) return null

  return (
    <div
      className="waitlist-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="note waitlist-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <span className="pin pin--brand" style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }} />
        <span className="tape" />
        <button type="button" className="waitlist-dialog__close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <p className="section-kicker">Early access</p>
        <h2 className="waitlist-dialog__title" id={titleId}>
          Get the app
        </h2>
        <p className="waitlist-dialog__lede">
          Join the waitlist. We’ll email you when Pathly is ready to download.
        </p>

        {submitted ? (
          <p className="form-success" role="status">
            You’re on the list. Watch your inbox — we’ll be in touch soon.
          </p>
        ) : (
          <form className="waitlist-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="waitlist-name">Name</label>
              <input
                ref={nameRef}
                id="waitlist-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Rivera"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="waitlist-email">Email</label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="alex@email.com"
                required
              />
            </div>
            <button className="btn btn--brand" type="submit">
              Join the waitlist
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
