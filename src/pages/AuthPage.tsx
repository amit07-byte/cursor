import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { usePathly } from '../store/PathlyContext'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const { currentUser, signIn, signUp, signInWithGoogleDemo, demoPassword, adminEmail } =
    usePathly()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/app'

  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')

  if (currentUser) {
    return <Navigate to={from === '/auth' ? '/app' : from} replace />
  }

  function finishOk() {
    navigate('/onboarding')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (mode === 'signin') {
      const result = signIn(email, password)
      if (!result.ok) {
        setError(result.error ?? 'Could not sign in.')
        return
      }
      navigate(from.startsWith('/app') || from === '/onboarding' ? from : '/app')
      return
    }
    const result = signUp({ email, password, name, acceptedTerms })
    if (!result.ok) {
      setError(result.error ?? 'Could not sign up.')
      return
    }
    finishOk()
  }

  function onGoogle() {
    setError('')
    const result = signInWithGoogleDemo()
    if (!result.ok) {
      setError(result.error ?? 'Google sign-in failed.')
      return
    }
    finishOk()
  }

  return (
    <div className="auth-page">
      <header className="auth-top">
        <Link to="/" className="brand-link" aria-label="Pathly home">
          <BrandLogo size={36} />
        </Link>
      </header>
      <main className="auth-main">
        <div className="note auth-card">
          <span className="pin pin--brand" style={{ top: '-7px', left: '48%' }} />
          <p className="auth-kicker">{mode === 'signup' ? 'Create account' : 'Welcome back'}</p>
          <h1>{mode === 'signup' ? 'Join Pathly' : 'Sign in to Pathly'}</h1>
          <p className="auth-lede">
            Businesses post campaigns. Creators join and chat in-app. Deals close on your own terms.
          </p>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={mode === 'signup' ? 'is-active' : ''}
              onClick={() => {
                setMode('signup')
                setError('')
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              className={mode === 'signin' ? 'is-active' : ''}
              onClick={() => {
                setMode('signin')
                setError('')
              }}
            >
              Sign in
            </button>
          </div>

          <button type="button" className="btn btn--ghost auth-google" onClick={onGoogle}>
            Continue with Google (demo)
          </button>

          <div className="auth-divider">
            <span>or email</span>
          </div>

          <form className="app-form" onSubmit={onSubmit}>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="auth-name">Name</label>
                <input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maya Chen"
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@brand.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
            {mode === 'signup' && (
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>
                  I accept the Pathly Terms. No payments or escrow on the platform — negotiate and pay
                  off-platform at your own risk.
                </span>
              </label>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn--brand" type="submit">
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <aside className="auth-demo">
            <strong>Demo accounts</strong>
            <p>
              Admin: {adminEmail} / {demoPassword}
            </p>
            <p>Seeded creator: jordan@pathly.demo / {demoPassword}</p>
            <p>Seeded business: maya@harbor.demo / {demoPassword}</p>
          </aside>
        </div>
      </main>
    </div>
  )
}
