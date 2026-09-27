import { usePathly } from '../../store/PathlyContext'

export default function AdminPage() {
  const {
    db,
    getBusinessName,
    getCreatorLabel,
    adminRemoveUser,
    adminCloseCampaign,
    resetDemoData,
  } = usePathly()

  const users = db.users
    .filter((u) => u.role !== 'admin')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="app-page">
      <header className="app-page__header">
        <div>
          <p className="auth-kicker">Admin</p>
          <h1>Trust & safety</h1>
          <p className="app-page__lede">
            View users and campaigns, close spam, remove bad actors, and review reports.
          </p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => resetDemoData()}>
          Reset demo data
        </button>
      </header>

      <section className="admin-section">
        <h2>Users ({users.length})</h2>
        <div className="stack-list">
          {users.map((user) => (
            <article key={user.id} className="note list-card">
              <div className="list-card__top">
                <div>
                  <p className="meta-row">
                    <span className="status-pill">{user.role ?? 'no role'}</span>
                    {user.isSeeded && <span className="muted">seeded</span>}
                    {user.isRemoved && <span className="status-pill">removed</span>}
                  </p>
                  <h3>
                    {user.name}{' '}
                    <span className="muted">
                      {user.role === 'business'
                        ? getBusinessName(user.id)
                        : user.role === 'creator'
                          ? getCreatorLabel(user.id)
                          : ''}
                    </span>
                  </h3>
                  <p className="muted">{user.email}</p>
                </div>
                {!user.isRemoved && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => adminRemoveUser(user.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Campaigns ({db.campaigns.length})</h2>
        <div className="stack-list">
          {db.campaigns.map((campaign) => (
            <article key={campaign.id} className="note list-card">
              <div className="list-card__top">
                <div>
                  <p className="meta-row">
                    <span className={`status-pill status-pill--${campaign.status}`}>
                      {campaign.status}
                    </span>
                    <span>{getBusinessName(campaign.businessId)}</span>
                    <span>${campaign.budget}</span>
                  </p>
                  <h3>{campaign.goal}</h3>
                </div>
                {campaign.status === 'active' && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => adminCloseCampaign(campaign.id)}
                  >
                    Close
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Reports ({db.reports.length})</h2>
        {db.reports.length === 0 ? (
          <p className="muted">No reports yet.</p>
        ) : (
          <div className="stack-list">
            {db.reports.map((report) => {
              const reporter = db.users.find((u) => u.id === report.reporterId)
              const reported = db.users.find((u) => u.id === report.reportedUserId)
              return (
                <article key={report.id} className="note list-card">
                  <p className="meta-row">
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                  </p>
                  <h3>
                    {reporter?.name ?? 'User'} reported {reported?.name ?? 'User'}
                  </h3>
                  <p>{report.reason}</p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
