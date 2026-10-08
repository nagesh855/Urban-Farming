import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/hooks.js'
import Layout from './components/Layout.jsx'
import OpeningTransition from './components/OpeningTransition.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CommunityPage from './pages/CommunityPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MarketplacePage from './pages/MarketplacePage.jsx'
import PlotPage from './pages/PlotPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { AboutPage, ContactPage } from './pages/InfoPages.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'
import WeatherCalendarPage from './pages/WeatherCalendarPage.jsx'

function ProtectedAdminRoute() {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) return <p className="page-status" role="status">Checking admin access…</p>
  if (user?.role !== 'admin') {
    return <Navigate to="/login?admin=1" replace state={{ from: location }} />
  }

  return <AdminPage />
}

function ProtectedProfileRoute() {
  const { user, authLoading } = useAuth()
  const location = useLocation()
  if (authLoading) return <p className="page-status" role="status">Checking your account…</p>
  if (!user || user.role !== 'user') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <ProfilePage />
}

function App() {
  const location = useLocation()
  const [runOpeningTransition] = useState(() => location.pathname === '/')

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plots" element={<PlotPage />} />
          <Route path="/plots/:plotId" element={<PlotPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:productId" element={<MarketplacePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:postId" element={<CommunityPage />} />
          <Route path="/weather-calendar" element={<WeatherCalendarPage />} />
          <Route path="/admin" element={<ProtectedAdminRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedProfileRoute />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <OpeningTransition active={runOpeningTransition} />
    </>
  )
}

export default App
