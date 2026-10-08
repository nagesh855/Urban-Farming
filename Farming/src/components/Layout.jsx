import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart, useAuth } from '../context/hooks.js'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Plots', to: '/plots' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Community', to: '/community' },
  { label: 'Weather', to: '/weather-calendar' },
  { label: 'Admin', to: '/admin' },
]

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { itemCount } = useCart()
  const { user } = useAuth()
  const isHome = location.pathname === '/'
  const isPlotsPage = location.pathname === '/plots' || location.pathname.startsWith('/plots/')
  const isMarketplacePage = location.pathname === '/marketplace' || location.pathname.startsWith('/marketplace/')
  const isCommunityPage = location.pathname === '/community' || location.pathname.startsWith('/community/')
  const isCartPage = location.pathname === '/cart'
  const isAdminPage = location.pathname === '/admin'
    || location.pathname.startsWith('/admin/')
    || (location.pathname === '/login' && new URLSearchParams(location.search).get('admin') === '1')

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <div className={`app-shell${isHome ? '' : ' app-shell--page'}${isPlotsPage ? ' app-shell--plots' : ''}${isMarketplacePage ? ' app-shell--marketplace' : ''}${isCommunityPage ? ' app-shell--community' : ''}${isAdminPage ? ' app-shell--admin' : ''}${isCartPage ? ' app-shell--cart' : ''}`}>
        <header className={`topbar${isHome ? '' : ' topbar--page'}`}>
          <Link className="brand-wrap" to="/" aria-label="urbanFarming home" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 26V15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M16 18C8 18 6 13 6 8c6 0 10 2 10 10Z" fill="currentColor" />
                <path d="M16 14c0-6 4-9 10-9 0 6-2 11-10 11" fill="currentColor" />
                <path d="M11 26h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="brand-copy">
              <span className="brand-name">urban<span>Farming</span></span>
              <span className="brand-subtitle">Grow good things together</span>
            </span>
          </Link>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>

          {menuOpen && <button className="menu-backdrop" type="button" aria-label="Close navigation menu" onClick={closeMenu} />}
          <nav id="main-navigation" className={`nav-menu${menuOpen ? ' nav-menu--open' : ''}`} aria-label="Main navigation">
            {navigation.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
            <NavLink className="nav-link nav-cart-link" to="/cart" onClick={closeMenu}>
              Cart <span className="cart-count">{itemCount}</span>
            </NavLink>
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                <Link className="nav-account" to={user.role === 'admin' ? '/admin' : '/profile'} onClick={closeMenu}>
                  {user.name || user.email}
                </Link>
                <button className="nav-signout" type="button" onClick={() => { navigate('/logout'); closeMenu() }}>Sign out</button>
              </>
            ) : (
              <Link className="primary-btn nav-cta" to="/register" onClick={closeMenu}>
                Get Started <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <Link className="footer-tagline" to="/">Live a Little Greener</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </footer>
      </div>
    </>
  )
}

export default Layout
