import { useCallback, useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Repeat,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react'

import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Plans', path: '/plans', icon: Layers },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
  { name: 'Invoices', path: '/invoices', icon: FileText },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawer, setDrawer] = useState({ path: location.pathname, open: false })
  const mobileOpen = drawer.path === location.pathname && drawer.open

  const setMobileOpen = useCallback((open: boolean) => {
    setDrawer({ path: location.pathname, open })
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen, setMobileOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `workspace-nav-link${isActive ? ' is-active' : ''}`

  const navigation = (
    <>
      <div className="workspace-brand">
        <div className="workspace-brand-mark">
          <Zap size={21} fill="currentColor" />
        </div>
        <h1 className="workspace-brand-name">Brightloop</h1>
      </div>

      <nav className="workspace-nav" aria-label="Main navigation">
        <p className="workspace-nav-label">WORKSPACE</p>
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={linkClass}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="workspace-sidebar-footer">
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={linkClass}
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={() => {
            setMobileOpen(false)
            navigate('/login')
          }}
          className="workspace-nav-link workspace-logout"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Log out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="workspace-mobile-toggle"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="workspace-mobile-overlay"
          aria-label="Close navigation menu"
        />
      )}

      <aside
        id="mobile-navigation"
        className={`workspace-sidebar workspace-sidebar-mobile${mobileOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="workspace-mobile-close"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
        {navigation}
      </aside>

      <aside
        className="workspace-sidebar workspace-sidebar-desktop"
        aria-label="Main navigation"
      >
        {navigation}
      </aside>
    </>
  )
}

export default Sidebar
