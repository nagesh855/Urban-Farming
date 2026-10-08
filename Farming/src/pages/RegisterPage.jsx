import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (form.name.trim().length < 2) return setError('Please enter a name with at least 2 characters.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.')
    if (form.password.length < 8) return setError('Choose a password with at least 8 characters.')
    if (form.password !== form.confirmPassword) return setError('The passwords do not match.')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Registration failed. Please try again.')
      navigate('/login', { replace: true, state: { registeredEmail: form.email.trim() } })
    } catch (requestError) {
      setError(requestError.message || 'Could not reach the registration service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content auth-page">
      <BackButton />
      <section className="auth-card">
        <p className="eyebrow">Join the neighborhood</p><h1>Create your account</h1>
        <p>Your account is securely saved in the Urban Farming database.</p>
        <form className="stacked-form" onSubmit={submit} noValidate>
          <label htmlFor="register-name">Name</label><input id="register-name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} />
          <label htmlFor="register-email">Email</label><input id="register-email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <label htmlFor="register-password">Password</label><input id="register-password" type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} />
          <label htmlFor="register-confirm">Confirm password</label><input id="register-confirm" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required minLength={8} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}

export default RegisterPage
