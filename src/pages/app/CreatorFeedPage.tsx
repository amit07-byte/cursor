import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DELIVERABLE_TYPES, NICHES, PLATFORMS } from '../../lib/constants'
import { usePathly } from '../../store/PathlyContext'
import type { DeliverableType, Niche, Platform } from '../../types'

export default function CreatorFeedPage() {
  const { db, getBusinessName, currentUser } = usePathly()
  const [niche, setNiche] = useState<Niche | 'All'>('All')
  const [deliverable, setDeliverable] = useState<DeliverableType | 'All'>('All')
  const [platform, setPlatform] = useState<Platform | 'All'>('All')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')

  const campaigns = useMemo(() => {
    const min = minBudget === '' ? null : Number(minBudget)
    const max = maxBudget === '' ? null : Number(maxBudget)
    return db.campaigns
      .filter((c) => c.status === 'active')
      .filter((c) => {
        const business = db.users.find((u) => u.id === c.businessId)
        return business && !business.isRemoved
      })
      .filter((c) => niche === 'All' || c.niche === niche)
      .filter((c) => deliverable === 'All' || c.deliverableType === deliverable)
      .filter((c) => platform === 'All' || c.preferredPlatform === platform)
      .filter((c) => (min === null || Number.isNaN(min) ? true : c.budget >= min))
      .filter((c) => (max === null || Number.isNaN(max) ? true : c.budget <= max))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [db, niche, deliverable, platform, minBudget, maxBudget])

  // Silence unused for currentUser until join status badges — use for joined set
  const joinedIds = new Set(
    db.connections
      .filter((c) => c.creatorId === currentUser?.id)
      .map((c) => c.campaignId),
  )

  return (
    <div className="app-page">
      <header className="app-page__header">
        <div>
          <p className="auth-kicker">Creator</p>
          <h1>Open campaigns</h1>
          <p className="app-page__lede">
            Filter by niche, deliverable, and budget. Join to open chat with the business.
          </p>
        </div>
      </header>

      <div className="filters note">
        <div className="field">
          <label htmlFor="f-niche">Niche</label>
          <select
            id="f-niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value as Niche | 'All')}
          >
            <option value="All">All</option>
            {NICHES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-platform">Platform</label>
          <select
            id="f-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform | 'All')}
          >
            <option value="All">All</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-deliverable">Deliverable</label>
          <select
            id="f-deliverable"
            value={deliverable}
            onChange={(e) => setDeliverable(e.target.value as DeliverableType | 'All')}
          >
            <option value="All">All</option>
            {DELIVERABLE_TYPES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-min">Min budget</label>
          <input
            id="f-min"
            type="number"
            min={0}
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="field">
          <label htmlFor="f-max">Max budget</label>
          <input
            id="f-max"
            type="number"
            min={0}
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="1000"
          />
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="empty-state note">
          <h2>No matching campaigns</h2>
          <p>Try clearing filters or check back soon.</p>
        </div>
      ) : (
        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="note campaign-tile">
              <p className="meta-row">
                <span>{getBusinessName(campaign.businessId)}</span>
                <span>{campaign.niche}</span>
              </p>
              <h2>{campaign.goal}</h2>
              <p className="muted clamp-2">{campaign.description}</p>
              <p className="meta-row">
                <span>{campaign.deliverableType}</span>
                <span className="offer-tag">${campaign.budget}</span>
                <span>Due {campaign.deadline}</span>
              </p>
              <div className="tile-actions">
                <Link className="btn btn--ghost" to={`/app/campaigns/${campaign.id}`}>
                  Details
                </Link>
                {joinedIds.has(campaign.id) ? (
                  <span className="joined-tag">Joined</span>
                ) : (
                  <Link className="btn btn--brand" to={`/app/campaigns/${campaign.id}`}>
                    Join
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
