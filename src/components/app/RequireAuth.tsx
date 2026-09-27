import { Navigate, useLocation } from 'react-router-dom'
import { usePathly } from '../../store/PathlyContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser, businessProfile, creatorProfile } = usePathly()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  const needsProfile =
    currentUser.role === 'business'
      ? !businessProfile
      : currentUser.role === 'creator'
        ? !creatorProfile
        : false

  if ((!currentUser.role || needsProfile) && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (
    currentUser.role &&
    !needsProfile &&
    currentUser.role !== 'admin' &&
    location.pathname === '/onboarding'
  ) {
    return <Navigate to="/app" replace />
  }

  return children
}

export function RequireRole({
  role,
  children,
}: {
  role: 'business' | 'creator' | 'admin'
  children: React.ReactNode
}) {
  const { currentUser } = usePathly()
  if (!currentUser) return <Navigate to="/auth" replace />
  if (currentUser.role !== role) return <Navigate to="/app" replace />
  return children
}
