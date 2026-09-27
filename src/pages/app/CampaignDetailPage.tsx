import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePathly } from '../../store/PathlyContext'

export default function CampaignDetailPage() {
  const { campaignId } = useParams()
  const navigate = useNavigate()
  const { db, currentUser, getBusinessName, joinCampaign } = usePathly()
  const [error, setError] = useState('')

  const campaign = db.campaigns.find((c) => c.id === campaignId)
  if (!campaign) {
    return (
      <div className="app-page">
        <div className="empty-state note">
          <h1>Campaign not found</h1>
          <Link className="btn btn--ghost" to="/app/feed">
            Back to feed
          </Link>
        </div>
      </div>
    )
  }

  const existing = db.connections.find(
    (c) => c.campaignId === campaign.id && c.creatorId === currentUser?.id,
  )

  function onJoin() {
    setError('')
    const result = joinCampaign(campaign!.id)
    if (!result.ok || !('connection' in result)) {
      setError(result.error ?? 'Could not join.')
      return
    }
    navigate(`/app/chat/${result.connection.id}`)
  }

  return (
    <div className="app-page">
      <Link className="back-link" to="/app/feed">
        ← Back to feed
      </Link>
      <article className="note detail-card">
        <p className="meta-row">
          <span>{getBusinessName(campaign.businessId)}</span>
          <span className={`status-pill status-pill--${campaign.status}`}>{campaign.status}</span>
        </p>
        <h1>{campaign.goal}</h1>
        <p className="app-page__lede">{campaign.description}</p>
        <dl className="detail-grid">
          <div>
            <dt>Niche</dt>
            <dd>{campaign.niche}</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{campaign.preferredPlatform}</dd>
          </div>
          <div>
            <dt>Deliverable</dt>
            <dd>{campaign.deliverableType}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>${campaign.budget}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{campaign.deadline}</dd>
          </div>
        </dl>

        {currentUser?.role === 'creator' && campaign.status === 'active' && (
          <div className="detail-actions">
            {existing ? (
              <Link className="btn btn--brand" to={`/app/chat/${existing.id}`}>
                Open chat
              </Link>
            ) : (
              <button type="button" className="btn btn--brand" onClick={onJoin}>
                Join campaign
              </button>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </article>
    </div>
  )
}
