
import { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Database,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react'

function Settings() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@brightloop.com',
    company: 'Brightloop Technologies',
    phone: '+91 98765 43210',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    payments: true,
    renewals: true,
    invoices: false,
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'Odoo Integration', icon: Database },
  ]

  const handleSave = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-7 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account, preferences and system configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 h-fit">
          <p className="text-xs font-semibold text-slate-400 uppercase px-3 py-3">
            Preferences
          </p>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition ${
                  activeTab === tab.name
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            )
          })}
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          {activeTab === 'Profile' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">
                Update your personal and company information.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{profile.name}</p>
                  <p className="text-sm text-slate-500">System Administrator</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', key: 'name' as const },
                  { label: 'Email Address', key: 'email' as const },
                  { label: 'Company Name', key: 'company' as const },
                  { label: 'Phone Number', key: 'phone' as const },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      value={profile[field.key]}
                      onChange={(e) =>
                        setProfile({ ...profile, [field.key]: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">
                Choose which updates you want to receive.
              </p>

              <div className="space-y-5">
                {[
                  { key: 'email' as const, title: 'Email Notifications', description: 'Receive important account updates by email.' },
                  { key: 'payments' as const, title: 'Payment Updates', description: 'Get notified when a payment succeeds or fails.' },
                  { key: 'renewals' as const, title: 'Subscription Renewals', description: 'Receive reminders about upcoming renewals.' },
                  { key: 'invoices' as const, title: 'Invoice Notifications', description: 'Receive updates when invoices are generated.' },
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[item.key]}
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key],
                        })
                      }
                      className={`w-12 h-6 rounded-full p-1 transition shrink-0 ${
                        notifications[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full transition ${
                          notifications[item.key] ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security Settings</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">
                Manage your password and account security.
              </p>

              <div className="space-y-5 max-w-lg">
                {[
                  { key: 'currentPassword' as const, label: 'Current Password' },
                  { key: 'newPassword' as const, label: 'New Password' },
                  { key: 'confirmPassword' as const, label: 'Confirm New Password' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={security[field.key]}
                        onChange={(e) =>
                          setSecurity({ ...security, [field.key]: e.target.value })
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3 text-slate-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-slate-500">
                  Password changes require backend authentication and are not active in this demo.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Odoo Integration' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Odoo Integration</h2>
              <p className="text-sm text-slate-500 mt-1 mb-7">
                Configure the connection between Brightloop and your Odoo instance.
              </p>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-7">
                <Database className="text-amber-600" size={22} />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Connection not configured</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Backend connection details are required to connect Odoo.
                  </p>
                </div>
              </div>

              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Odoo Server URL</label>
                  <input
                    placeholder="https://your-company.odoo.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Odoo Database</label>
                  <input
                    placeholder="Enter database name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Integration Status</label>
                  <div className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500">
                    Not connected
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  API credentials must be stored securely on the backend, never in this React app.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-10 pt-6 border-t border-slate-100">
            <div className="text-sm text-emerald-600">
              {saved && (
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} /> Demo changes saved locally.
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <Save size={17} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
