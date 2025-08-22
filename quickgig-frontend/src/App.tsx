import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User } from './types'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import GigDetails from './pages/GigDetails'
import PostGig from './pages/PostGig'
import Applications from './pages/Applications'
import Payments from './pages/Payments'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import { Toaster } from './components/ui/toaster'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('quickgig-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem('quickgig-user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('quickgig-user')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white/30"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-transparent">
        {!user ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/gig/:id" element={<GigDetails user={user} />} />
              <Route path="/post-gig" element={<PostGig user={user} />} />
              <Route path="/applications" element={<Applications user={user} />} />
              <Route path="/payments" element={<Payments user={user} />} />
              <Route path="/profile" element={<Profile user={user} onUpdate={setUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        )}
        <Toaster />
      </div>
    </Router>
  )
}

export default App
