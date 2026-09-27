import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DELIVERABLE_TYPES, NICHES, PLATFORMS } from '../../lib/constants'
import { usePathly } from '../../store/PathlyContext'
import type { DeliverableType, Niche, Platform } from '../../types'

export default function PostCampaignPage() {
  const { createCampaign } = usePathly()
  const navigate = useNavigate()
  const [goal, setGoal] = useState('')
  const [niche, setNiche] = useState<Niche>('Food & drink')
  const [preferredPlatform, setPreferredPlatform] = useState<Platform>('Instagram')
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('Reel / short video')
  const [budget, setBudget] = useState('150')
  const [deadline, setDeadline] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const result = createCampaign({
      goal,
      niche,
      preferredPlatform,
      deliverableType,
      budget: Number(budget) || 0,
      deadline,
      description,
    })
    if (!result.ok || !('campaign' in result)) {
      setError(result.error ?? 'Could not create campaign.')
      return
    }
    navigate('/app/business')
  }

  return (
    <div className="app-page">
      <header className="app-page__header">
        <div>
          <p className="auth-kicker">Business</p>
          <h1>Post a campaign</h1>
          <p className="app-page__lede">
            Describe the work. Creators browse the open feed and join if it’s a fit.
          </p>
        </div>
        <Link className="btn btn--ghost" to="/app/business">
          Cancel
        </Link>
      </header>

      <form className="note app-form form-panel" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="camp-goal">Campaign goal</label>
          <input
            id="camp-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Drive weekend foot traffic for cold brew launch"
            required
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="camp-niche">Target niche</label>
            <select
              id="camp-niche"
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
            <label htmlFor="camp-platform">Preferred platform</label>
            <select
              id="camp-platform"
              value={preferredPlatform}
              onChange={(e) => setPreferredPlatform(e.target.value as Platform)}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="camp-deliverable">Deliverable type</label>
          <select
            id="camp-deliverable"
            value={deliverableType}
            onChange={(e) => setDeliverableType(e.target.value as DeliverableType)}
          >
            {DELIVERABLE_TYPES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="camp-budget">Budget ($)</label>
            <input
              id="camp-budget"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="camp-deadline">Deadline</label>
            <input
              id="camp-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="camp-desc">Short description</label>
          <textarea
            id="camp-desc"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should the creator make, where, and any must-haves…"
            required
          />
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn--brand" type="submit">
          Publish campaign
        </button>
      </form>
    </div>
  )
}
