import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { useAuth } from '../context/hooks.js'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { signIn } = useAuth()
  const adminLogin = params.get('admin') === '1'
  const [email, setEmail] = useState(location.state?.registeredEmail || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const success = location.state?.registeredEmail ? 'Account created. Sign in to continue.' : ''
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.')
    if (!password) return setError('Enter your password.')
    setLoading(true)
    try {
      const response = await fetch(adminLogin ? '/api/auth/admin/login' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Sign in failed. Check your details and try again.')
      signIn(result.token, result.user)
      navigate(adminLogin ? '/admin' : location.state?.from?.pathname || '/', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Could not reach the sign-in service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content auth-page">
      <BackButton fallback="/" />
      <section className="auth-card">
        <p className="eyebrow">{adminLogin ? 'Protected area' : 'Welcome back'}</p><h1>{adminLogin ? 'Admin sign in' : 'Sign in'}</h1>
        {adminLogin && <p>Admin access is verified by the server. Configure ADMIN_EMAIL and ADMIN_PASSWORD in the backend environment.</p>}
        <form className="stacked-form" onSubmit={submit} noValidate>
          <label htmlFor="login-email">Email</label><input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {success && <p className="form-success" role="status">{success}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {!adminLogin && <p className="auth-switch">New to the garden? <Link to="/register">Create an account</Link></p>}
      </section>
    </main>
  )
}

export default LoginPage
