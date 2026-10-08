import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './AppContextValue.js'
import { starterPosts } from '../data/community.js'
import { products } from '../data/marketplace.js'

const CART_KEY = 'urbanfarming-cart'
const POSTS_KEY = 'urbanfarming-community-posts'
const ADMIN_KEY = 'urbanfarming-admin-records'
const TOKEN_KEY = 'urbanfarming-token'

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => readStored(CART_KEY, []))
  const [posts, setPosts] = useState(() => readStored(POSTS_KEY, starterPosts))
  const [adminRecords, setAdminRecords] = useState(() => readStored(ADMIN_KEY, null))
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem(POSTS_KEY, JSON.stringify(posts)), [posts])
  useEffect(() => {
    if (adminRecords) localStorage.setItem(ADMIN_KEY, JSON.stringify(adminRecords))
  }, [adminRecords])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Your session is no longer valid.')
        setUser(data.user)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setAuthLoading(false))
  }, [])

  const addToCart = useCallback((productId) => {
    const product = products.find(({ id }) => id === productId)
    if (!product) return
    setCart((current) => {
      const existing = current.find((item) => item.id === productId)
      return existing
        ? current.map((item) => item.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item)
        : [...current, { id: productId, quantity: 1 }]
    })
  }, [])

  const setCartQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setCart((current) => current.filter(({ id }) => id !== productId))
      return
    }
    const product = products.find(({ id }) => id === productId)
    setCart((current) => current.map((item) => item.id === productId
      ? { ...item, quantity: Math.min(quantity, product?.stock ?? quantity) }
      : item))
  }, [])

  const signIn = useCallback((token, profile) => {
    localStorage.setItem(TOKEN_KEY, token)
    setUser(profile)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])
  const clearCart = useCallback(() => setCart([]), [])
  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), [])

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartValue = useMemo(() => ({
    cart, itemCount, addToCart, setCartQuantity, clearCart,
  }), [cart, itemCount, addToCart, setCartQuantity, clearCart])
  const authValue = useMemo(() => ({
    user, authLoading, signIn, signOut,
    token: getToken,
  }), [user, authLoading, signIn, signOut, getToken])
  const communityValue = useMemo(() => ({ posts, setPosts }), [posts])
  const adminValue = useMemo(() => ({ adminRecords, setAdminRecords }), [adminRecords])

  return (
    <AppContext.Provider value={{ cart: cartValue, auth: authValue, community: communityValue, admin: adminValue }}>
      {children}
    </AppContext.Provider>
  )
}
