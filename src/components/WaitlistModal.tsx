import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useWaitlist } from '../hooks/useWaitlist'
import { submitWaitlist } from '../lib/waitlist'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function WaitlistModal() {
  const { open, closeWaitlist } = useWaitlist()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const titleId = useId()
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'loading') closeWaitlist()
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
  }, [open, closeWaitlist, status])

  function handleClose() {
    if (status === 'loading') return
    setStatus('idle')
    setErrorMessage('')
    closeWaitlist()
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const honey = String(data.get('company') || '').trim()

    if (honey) {
      setStatus('success')
      return
    }

    if (!name || !email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      await submitWaitlist({ name, email })
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
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
        <button
          type="button"
          className="waitlist-dialog__close"
          onClick={handleClose}
          aria-label="Close"
          disabled={status === 'loading'}
        >
          ×
        </button>
        <p className="section-kicker">Early access</p>
        <h2 className="waitlist-dialog__title" id={titleId}>
          Get the app
        </h2>
        <p className="waitlist-dialog__lede">
          Join the waitlist. We’ll email you when Pathly is ready to download.
        </p>

        {status === 'success' ? (
          <p className="form-success" role="status">
            You’re on the list. Watch your inbox — we’ll be in touch soon.
          </p>
        ) : (
          <form className="waitlist-form" onSubmit={onSubmit}>
            <div className="field waitlist-honey" aria-hidden="true">
              <label htmlFor="waitlist-company">Company</label>
              <input id="waitlist-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
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
                disabled={status === 'loading'}
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
                disabled={status === 'loading'}
              />
            </div>
            {status === 'error' ? (
              <p className="form-error" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <button className="btn btn--brand" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
