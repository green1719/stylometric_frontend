import { Navigate, Route, Routes } from 'react-router-dom'
import { AppNavbar } from './components/AppNavbar'
import { RequestOverlay } from './components/RequestOverlay'
import { AddSamplePage } from './pages/AddSamplePage'
import { FeedPage } from './pages/FeedPage'
import { GridPage } from './pages/GridPage'
import { LoginPage } from './pages/LoginPage'
import { SamplePage } from './pages/SamplePage'

export default function App() {
  return <main className="app-shell"><Routes><Route path="/grid" element={<GridPage />} /><Route path="/feed/:id?" element={<FeedPage />} /><Route path="/sample/:id" element={<SamplePage />} /><Route path="/add" element={<AddSamplePage />} /><Route path="/login" element={<LoginPage />} /><Route path="*" element={<Navigate to="/grid" replace />} /></Routes><AppNavbar /><RequestOverlay /></main>
}
