import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/hooks.js'

function LogoutPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    signOut()
    navigate('/', { replace: true })
  }, [signOut, navigate])
  return <p className="page-status" role="status">Signing you out…</p>
}

export default LogoutPage
