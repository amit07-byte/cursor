import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePathly } from '../../store/PathlyContext'

export default function ChatPage() {
  const { connectionId } = useParams()
  const {
    currentUser,
    db,
    getBusinessName,
    getCreatorLabel,
    sendMessage,
    markMessagesRead,
    blockUser,
    reportUser,
    isBlockedBetween,
  } = usePathly()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [status, setStatus] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const connection = db.connections.find((c) => c.id === connectionId)
  const campaign = connection
    ? db.campaigns.find((c) => c.id === connection.campaignId)
    : undefined

  useEffect(() => {
    if (connectionId) markMessagesRead(connectionId)
  }, [connectionId, db.messages.length, markMessagesRead])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [connectionId, db.messages.length])

  if (!currentUser || !connection || !campaign) {
    return (
      <div className="app-page">
        <div className="empty-state note">
          <h1>Conversation not found</h1>
          <Link className="btn btn--ghost" to="/app/inbox">
            Back to inbox
          </Link>
        </div>
      </div>
    )
  }

  const otherUserId =
    currentUser.id === connection.creatorId ? campaign.businessId : connection.creatorId
  const otherLabel =
    currentUser.id === connection.creatorId
      ? getBusinessName(campaign.businessId)
      : getCreatorLabel(connection.creatorId)
  const blocked = isBlockedBetween(connection.creatorId, campaign.businessId)

  const messages = db.messages
    .filter((m) => m.connectionId === connection.id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  function onSend(e: FormEvent) {
    e.preventDefault()
    setError('')
    setStatus('')
    const result = sendMessage(connection!.id, text)
    if (!result.ok) {
      setError(result.error ?? 'Could not send.')
      return
    }
    setText('')
  }

  function onBlock() {
    blockUser(otherUserId)
    setStatus('User blocked. Messaging is disabled for this conversation.')
  }

  function onReport(e: FormEvent) {
    e.preventDefault()
    const result = reportUser({
      reportedUserId: otherUserId,
      connectionId: connection!.id,
      reason: reportReason,
    })
    if (!result.ok) {
      setError(result.error ?? 'Could not report.')
      return
    }
    setReportOpen(false)
    setReportReason('')
    setStatus('Report submitted. An admin can review it in the admin panel.')
  }

  return (
    <div className="app-page chat-page">
      <Link className="back-link" to="/app/inbox">
        ← Inbox
      </Link>

      <header className="chat-header note">
        <div>
          <p className="meta-row">
            <strong>{otherLabel}</strong>
            <span>{campaign.niche}</span>
            <span>${campaign.budget}</span>
          </p>
          <h1>{campaign.goal}</h1>
          <p className="muted">
            Negotiate rate, deliverables, timeline, and payment on your own terms. Pathly does not
            process payments in MVP.
          </p>
        </div>
        <div className="chat-header__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setReportOpen((o) => !o)}>
            Report
          </button>
          <button type="button" className="btn btn--ghost" onClick={onBlock} disabled={blocked}>
            {blocked ? 'Blocked' : 'Block'}
          </button>
        </div>
      </header>

      {reportOpen && (
        <form className="note app-form report-panel" onSubmit={onReport}>
          <label htmlFor="report-reason">Why are you reporting this user?</label>
          <textarea
            id="report-reason"
            rows={3}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            required
          />
          <button className="btn btn--brand" type="submit">
            Submit report
          </button>
        </form>
      )}

      {status && (
        <p className="form-success" role="status">
          {status}
        </p>
      )}

      <div className="chat-thread note">
        {messages.length === 0 ? (
          <p className="muted chat-empty">No messages yet. Send the first note to start the deal.</p>
        ) : (
          messages.map((msg) => {
            const mine = msg.senderId === currentUser.id
            return (
              <div
                key={msg.id}
                className={`chat-bubble ${mine ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}
              >
                <p>{msg.text}</p>
                <time>{new Date(msg.timestamp).toLocaleString()}</time>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-composer note" onSubmit={onSend}>
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>
        <textarea
          id="chat-input"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={blocked ? 'Messaging blocked' : 'Write a message…'}
          disabled={blocked}
          required
        />
        <button className="btn btn--brand" type="submit" disabled={blocked}>
          Send
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
