import { Link, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { useAuth } from '../context/hooks.js'

function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  return (
    <main className="page-content">
      <BackButton />
      <section className="info-panel">
        <p className="eyebrow">Your garden account</p>
        <h1>Welcome, {user.name}</h1>
        <p>Signed in as <strong>{user.email}</strong>.</p>
        <button className="secondary-btn" type="button" onClick={() => navigate('/logout')}>Sign out</button>
        <Link className="text-link" to="/marketplace">Explore local produce →</Link>
      </section>
    </main>
  )
}

export default ProfilePage
