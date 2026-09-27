import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import { usePathly } from '../../store/PathlyContext'

export default function AppLayout() {
  const {
    currentUser,
    businessProfile,
    creatorProfile,
    signOut,
    unreadNotificationCount,
    markNotificationsRead,
    db,
  } = usePathly()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  if (!currentUser) return null

  const notifications = db.notifications
    .filter((n) => n.userId === currentUser.id)
    .slice(0, 12)

  const roleLabel =
    currentUser.role === 'business'
      ? businessProfile?.businessName ?? 'Business'
      : currentUser.role === 'creator'
        ? creatorProfile?.handle ?? 'Creator'
        : 'Admin'

  function onSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="container app-topbar__inner">
          <Link to="/app" className="brand-link" aria-label="Pathly app home">
            <BrandLogo size={34} />
          </Link>

          <nav className="app-nav" aria-label="App">
            {currentUser.role === 'business' && (
              <>
                <NavLink to="/app/business">Campaigns</NavLink>
                <NavLink to="/app/campaigns/new">Post</NavLink>
                <NavLink to="/app/inbox">Inbox</NavLink>
              </>
            )}
            {currentUser.role === 'creator' && (
              <>
                <NavLink to="/app/feed">Feed</NavLink>
                <NavLink to="/app/inbox">Inbox</NavLink>
              </>
            )}
            {currentUser.role === 'admin' && <NavLink to="/app/admin">Admin</NavLink>}
          </nav>

          <div className="app-topbar__actions">
            <div className="notif-wrap">
              <button
                type="button"
                className="notif-btn"
                aria-label="Notifications"
                onClick={() => {
                  setNotifOpen((o) => !o)
                  markNotificationsRead()
                }}
              >
                Alerts
                {unreadNotificationCount > 0 && (
                  <span className="notif-badge">{unreadNotificationCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="notif-panel" role="dialog" aria-label="Notifications">
                  <header>
                    <strong>Notifications</strong>
                    <span className="muted">Email simulated locally for MVP</span>
                  </header>
                  {notifications.length === 0 ? (
                    <p className="muted">No notifications yet.</p>
                  ) : (
                    <ul>
                      {notifications.map((n) => (
                        <li key={n.id}>
                          {n.href ? (
                            <Link to={n.href} onClick={() => setNotifOpen(false)}>
                              <strong>{n.title}</strong>
                              <span>{n.body}</span>
                            </Link>
                          ) : (
                            <>
                              <strong>{n.title}</strong>
                              <span>{n.body}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <span className="app-user-chip">{roleLabel}</span>
            <button type="button" className="btn btn--ghost app-signout" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
