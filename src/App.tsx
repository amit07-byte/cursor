import { Navigate, Route, Routes } from 'react-router-dom'
import LearningPathPage from './pages/LearningPathPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LearningPathPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
