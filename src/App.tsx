import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth, RequireRole } from './components/app/RequireAuth'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import AdminPage from './pages/app/AdminPage'
import AppLayout from './pages/app/AppLayout'
import BusinessDashboard from './pages/app/BusinessDashboard'
import CampaignDetailPage from './pages/app/CampaignDetailPage'
import ChatPage from './pages/app/ChatPage'
import CreatorFeedPage from './pages/app/CreatorFeedPage'
import HomeRedirect from './pages/app/HomeRedirect'
import InboxPage from './pages/app/InboxPage'
import PostCampaignPage from './pages/app/PostCampaignPage'
import { PathlyProvider } from './store/PathlyContext'
import './App.css'

export default function App() {
  return (
    <PathlyProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <OnboardingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<HomeRedirect />} />
            <Route
              path="business"
              element={
                <RequireRole role="business">
                  <BusinessDashboard />
                </RequireRole>
              }
            />
            <Route
              path="campaigns/new"
              element={
                <RequireRole role="business">
                  <PostCampaignPage />
                </RequireRole>
              }
            />
            <Route
              path="feed"
              element={
                <RequireRole role="creator">
                  <CreatorFeedPage />
                </RequireRole>
              }
            />
            <Route
              path="campaigns/:campaignId"
              element={
                <RequireRole role="creator">
                  <CampaignDetailPage />
                </RequireRole>
              }
            />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="chat/:connectionId" element={<ChatPage />} />
            <Route
              path="admin"
              element={
                <RequireRole role="admin">
                  <AdminPage />
                </RequireRole>
              }
            />
          </Route>
          <Route path="/signup/business" element={<Navigate to="/auth" replace />} />
          <Route path="/signup/creator" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </PathlyProvider>
  )
}
