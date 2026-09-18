import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup/business" element={<SignupPage role="business" />} />
      <Route path="/signup/creator" element={<SignupPage role="creator" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
