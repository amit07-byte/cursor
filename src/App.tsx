import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import WaitlistModal from './components/WaitlistModal'
import { WaitlistProvider } from './hooks/useWaitlist'
import './App.css'

export default function App() {
  return (
    <WaitlistProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup/business" element={<SignupPage role="business" />} />
        <Route path="/signup/creator" element={<SignupPage role="creator" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WaitlistModal />
    </WaitlistProvider>
  )
}
