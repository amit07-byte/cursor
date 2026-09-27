import { Link } from 'react-router-dom'
import { usePathly } from '../../store/PathlyContext'

export default function InboxPage() {
  const { currentUser, db, getBusinessName, getCreatorLabel, isBlockedBetween } = usePathly()
  if (!currentUser) return null

  const connections = db.connections
    .filter((conn) => {
      const campaign = db.campaigns.find((c) => c.id === conn.campaignId)
      if (!campaign) return false
      if (currentUser.role === 'creator') return conn.creatorId === currentUser.id
      if (currentUser.role === 'business') return campaign.businessId === currentUser.id
      return false
    })
    .map((conn) => {
      const campaign = db.campaigns.find((c) => c.id === conn.campaignId)!
      const messages = db.messages
        .filter((m) => m.connectionId === conn.id)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      const last = messages[0]
      const unread = messages.filter(
        (m) => m.senderId !== currentUser.id && !m.readBy.includes(currentUser.id),
      ).length
      const otherLabel =
        currentUser.role === 'creator'
          ? getBusinessName(campaign.businessId)
          : getCreatorLabel(conn.creatorId)
      const blocked = isBlockedBetween(conn.creatorId, campaign.businessId)
      return { conn, campaign, last, unread, otherLabel, blocked }
    })
    .sort((a, b) => {
      const at = a.last?.timestamp ?? a.conn.createdAt
      const bt = b.last?.timestamp ?? b.conn.createdAt
      return bt.localeCompare(at)
    })

  return (
    <div className="app-page">
      <header className="app-page__header">
        <div>
          <p className="auth-kicker">Inbox</p>
          <h1>Conversations</h1>
          <p className="app-page__lede">
            Plain in-app chat after a creator joins a campaign. Negotiate rate, deliverables, and
            timeline here.
          </p>
        </div>
      </header>

      {connections.length === 0 ? (
        <div className="empty-state note">
          <h2>No conversations yet</h2>
          <p>
            {currentUser.role === 'creator'
              ? 'Join a campaign from the feed to start chatting.'
              : 'When a creator joins one of your campaigns, the thread appears here.'}
          </p>
        </div>
      ) : (
        <ul className="inbox-list">
          {connections.map(({ conn, campaign, last, unread, otherLabel, blocked }) => (
            <li key={conn.id}>
              <Link className="inbox-item note" to={`/app/chat/${conn.id}`}>
                <div>
                  <p className="meta-row">
                    <strong>{otherLabel}</strong>
                    {blocked && <span className="status-pill">blocked</span>}
                    {unread > 0 && <span className="notif-badge">{unread}</span>}
                  </p>
                  <p className="inbox-item__goal">{campaign.goal}</p>
                  <p className="muted clamp-1">
                    {last ? last.text : 'Connected — say hello to get the deal started.'}
                  </p>
                </div>
                <span className="muted inbox-item__time">
                  {new Date(last?.timestamp ?? conn.createdAt).toLocaleString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
