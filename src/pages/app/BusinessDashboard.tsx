import { Link } from 'react-router-dom'
import { usePathly } from '../../store/PathlyContext'

export default function BusinessDashboard() {
  const { currentUser, db, getCreatorLabel, updateCampaignStatus } = usePathly()
  if (!currentUser) return null

  const campaigns = db.campaigns
    .filter((c) => c.businessId === currentUser.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="app-page">
      <header className="app-page__header">
        <div>
          <p className="auth-kicker">Business</p>
          <h1>Your campaigns</h1>
          <p className="app-page__lede">
            Post what you need. When a creator joins, chat opens automatically.
          </p>
        </div>
        <Link className="btn btn--brand" to="/app/campaigns/new">
          Post campaign
        </Link>
      </header>

      {campaigns.length === 0 ? (
        <div className="empty-state note">
          <h2>No campaigns yet</h2>
          <p>Post your first campaign to start getting creator joins.</p>
          <Link className="btn btn--brand" to="/app/campaigns/new">
            Create campaign
          </Link>
        </div>
      ) : (
        <div className="stack-list">
          {campaigns.map((campaign) => {
            const joins = db.connections.filter((c) => c.campaignId === campaign.id)
            return (
              <article key={campaign.id} className="note list-card">
                <div className="list-card__top">
                  <div>
                    <p className="meta-row">
                      <span className={`status-pill status-pill--${campaign.status}`}>
                        {campaign.status}
                      </span>
                      <span>{campaign.niche}</span>
                      <span>{campaign.deliverableType}</span>
                      <span>${campaign.budget}</span>
                    </p>
                    <h2>{campaign.goal}</h2>
                    <p className="muted">{campaign.description}</p>
                  </div>
                  {campaign.status === 'active' && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => updateCampaignStatus(campaign.id, 'closed')}
                    >
                      Close
                    </button>
                  )}
                </div>
                <div className="join-row">
                  <strong>{joins.length} join{joins.length === 1 ? '' : 's'}</strong>
                  {joins.length === 0 ? (
                    <span className="muted">Waiting for creators…</span>
                  ) : (
                    <ul className="chip-list">
                      {joins.map((join) => (
                        <li key={join.id}>
                          <Link to={`/app/chat/${join.id}`}>
                            {getCreatorLabel(join.creatorId)} · Open chat
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
