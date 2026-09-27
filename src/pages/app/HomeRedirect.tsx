import { Navigate } from 'react-router-dom'
import { usePathly } from '../../store/PathlyContext'

export default function HomeRedirect() {
  const { currentUser } = usePathly()
  if (!currentUser?.role) return <Navigate to="/onboarding" replace />
  if (currentUser.role === 'admin') return <Navigate to="/app/admin" replace />
  if (currentUser.role === 'business') return <Navigate to="/app/business" replace />
  return <Navigate to="/app/feed" replace />
}
