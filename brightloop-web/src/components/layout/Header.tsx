import { useLocation } from 'react-router-dom'
import { Search, Bell, ChevronDown } from 'lucide-react'

const pageDetails: Record<string, { title: string; caption: string }> = {
  '/dashboard': { title: 'Dashboard', caption: "Here's what's happening today." },
  '/products': { title: 'Products', caption: 'Manage your product catalog.' },
  '/plans': { title: 'Plans', caption: 'Manage pricing and plan options.' },
  '/customers': { title: 'Customers', caption: 'Keep customer relationships moving.' },
  '/subscriptions': { title: 'Subscriptions', caption: 'Manage recurring customer billing.' },
  '/invoices': { title: 'Invoices', caption: 'Review and manage customer invoices.' },
  '/payments': { title: 'Payments', caption: 'Track your incoming payments.' },
  '/analytics': { title: 'Analytics', caption: 'Understand your business performance.' },
  '/settings': { title: 'Settings', caption: 'Manage your workspace preferences.' },
}

function Header() {
  const { pathname } = useLocation()
  const page = pageDetails[pathname] ?? pageDetails['/dashboard']

  return (
    <header className="workspace-header">
      <div>
        <h2 className="workspace-header-title">{page.title}</h2>
        <p className="workspace-header-caption">{page.caption}</p>
      </div>

      <div className="workspace-header-actions">
        <label className="workspace-search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Search anything..." aria-label="Search" />
        </label>

        <button className="workspace-icon-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="workspace-notification-dot" aria-hidden="true" />
        </button>

        <button className="workspace-profile" aria-label="Admin User profile">
          <span className="workspace-avatar" aria-hidden="true">A</span>
          <span className="hidden sm:block text-left">
            <span className="workspace-profile-name block">Admin User</span>
            <span className="workspace-profile-role block">Administrator</span>
          </span>
          <ChevronDown size={15} className="hidden sm:block text-slate-400" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

export default Header
