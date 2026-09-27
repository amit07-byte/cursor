import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { FOLLOWER_RANGES, NICHES, PLATFORMS } from '../lib/constants'
import { usePathly } from '../store/PathlyContext'
import type { FollowerRange, Niche, Platform } from '../types'

export default function OnboardingPage() {
  const {
    currentUser,
    businessProfile,
    creatorProfile,
    setRole,
    saveBusinessProfile,
    saveCreatorProfile,
  } = usePathly()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState<Niche>('Food & drink')
  const [logoUrl, setLogoUrl] = useState('')

  const [handle, setHandle] = useState('')
  const [niche, setNiche] = useState<Niche>('Lifestyle')
  const [platform, setPlatform] = useState<Platform>('Instagram')
  const [followerRange, setFollowerRange] = useState<FollowerRange>('1k–5k')
  const [portfolioLink, setPortfolioLink] = useState('')
  const [startingRate, setStartingRate] = useState('100')

  if (!currentUser) return <Navigate to="/auth" replace />

  if (currentUser.role === 'admin') return <Navigate to="/app/admin" replace />
  if (currentUser.role === 'business' && businessProfile) return <Navigate to="/app" replace />
  if (currentUser.role === 'creator' && creatorProfile) return <Navigate to="/app" replace />

  function pickRole(role: 'business' | 'creator') {
    setError('')
    const result = setRole(role)
    if (!result.ok) setError(result.error ?? 'Could not set role.')
  }

  function onBusinessSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const result = saveBusinessProfile({
      businessName,
      industry,
      logoUrl: logoUrl.trim() || undefined,
    })
    if (!result.ok) {
      setError(result.error ?? 'Could not save profile.')
      return
    }
    navigate('/app')
  }

  function onCreatorSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const result = saveCreatorProfile({
      handle,
      niche,
      platform,
      followerRange,
      portfolioLink,
      startingRate: Number(startingRate) || 0,
    })
    if (!result.ok) {
      setError(result.error ?? 'Could not save profile.')
      return
    }
    navigate('/app')
  }

  return (
    <div className="auth-page">
      <header className="auth-top">
        <Link to="/" className="brand-link" aria-label="Pathly home">
          <BrandLogo size={36} />
        </Link>
      </header>
      <main className="auth-main">
        <div className="note auth-card auth-card--wide">
          <span className="pin pin--brand" style={{ top: '-7px', left: '46%' }} />
          <p className="auth-kicker">Onboarding</p>
          <h1>Set up your Pathly profile</h1>
          <p className="auth-lede">Hi {currentUser.name}. Pick a side, then fill in the basics.</p>

          {!currentUser.role && (
            <div className="role-grid">
              <button type="button" className="role-card" onClick={() => pickRole('business')}>
                <strong>I’m a Business</strong>
                <span>Post campaigns and chat with creators who join.</span>
              </button>
              <button type="button" className="role-card" onClick={() => pickRole('creator')}>
                <strong>I’m a Creator</strong>
                <span>Browse open campaigns, join, and negotiate in chat.</span>
              </button>
            </div>
          )}

          {currentUser.role === 'business' && !businessProfile && (
            <form className="app-form" onSubmit={onBusinessSubmit}>
              <div className="field">
                <label htmlFor="biz-name">Business name</label>
                <input
                  id="biz-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Harbor Roasters"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="biz-industry">Industry / niche</label>
                <select
                  id="biz-industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Niche)}
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="biz-logo">Logo URL (optional)</label>
                <input
                  id="biz-logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn--brand" type="submit">
                Save business profile
              </button>
            </form>
          )}

          {currentUser.role === 'creator' && !creatorProfile && (
            <form className="app-form" onSubmit={onCreatorSubmit}>
              <div className="field">
                <label htmlFor="cr-handle">Name / handle</label>
                <input
                  id="cr-handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@jordan.eats"
                  required
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="cr-niche">Niche</label>
                  <select
                    id="cr-niche"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value as Niche)}
                  >
                    {NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="cr-platform">Primary platform</label>
                  <select
                    id="cr-platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="cr-followers">Follower range</label>
                  <select
                    id="cr-followers"
                    value={followerRange}
                    onChange={(e) => setFollowerRange(e.target.value as FollowerRange)}
                  >
                    {FOLLOWER_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="cr-rate">Starting rate ($)</label>
                  <input
                    id="cr-rate"
                    type="number"
                    min={0}
                    value={startingRate}
                    onChange={(e) => setStartingRate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="cr-portfolio">Portfolio link</label>
                <input
                  id="cr-portfolio"
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://instagram.com/you"
                  required
                />
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="btn btn--brand" type="submit">
                Save creator profile
              </button>
            </form>
          )}

          {error && !currentUser.role && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
