
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap,
  Eye,
  EyeOff,
  UserPlus,
  User,
  Mail,
  Building2,
  Lock,
  ShieldCheck,
} from 'lucide-react'

function Register() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Demo registration only. Real accounts require backend integration.
    localStorage.setItem(
      'brightloop_demo_user',
      JSON.stringify({
        name: form.name,
        email: form.email,
        company: form.company,
      })
    )

    navigate('/login')
  }

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center">
      <div className="auth-shell grid lg:grid-cols-2">

        {/* Left branding section */}
        <div className="auth-brand hidden lg:flex flex-col justify-between p-10 xl:p-12 text-white">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3">
              <Zap size={25} />
            </div>
            <span className="text-2xl font-bold">Brightloop</span>
          </div>

          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Subscription management made simple
            </p>

            <h1 className="mt-5 text-4xl xl:text-5xl font-bold leading-tight">
              Start managing subscriptions smarter.
            </h1>

            <p className="mt-6 text-blue-100 text-base xl:text-lg leading-8">
              Bring customers, subscriptions, billing and payments together
              in one powerful workspace.
            </p>

            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <ShieldCheck size={28} className="text-blue-200 shrink-0" />
              <div>
                <p className="font-semibold">Built for growing businesses</p>
                <p className="text-sm text-blue-200">
                  Everything in one unified workspace
                </p>
              </div>
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            © 2026 Brightloop. All rights reserved.
          </p>
        </div>

        {/* Registration form section */}
        <div className="auth-content flex items-center justify-center p-5 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">

            <div className="mb-7 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-600 p-3 text-white">
                <Zap size={23} />
                <span className="text-xl font-bold">Brightloop</span>
              </div>
            </div>

            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <UserPlus size={24} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Get started today
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                Create your account
              </h2>

              <p className="text-slate-500 mt-2 text-sm leading-6">
                Get started with your Brightloop workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <User size={18} className="text-slate-400 shrink-0" />

                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    placeholder="Enter your full name"
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Mail size={18} className="text-slate-400 shrink-0" />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    placeholder="you@company.com"
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Building2 size={18} className="text-slate-400 shrink-0" />

                  <input
                    id="company"
                    type="text"
                    required
                    autoComplete="organization"
                    value={form.company}
                    placeholder="Your company name"
                    onChange={(e) => updateField('company', e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Lock size={18} className="text-slate-400 shrink-0" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    placeholder="At least 6 characters"
                    onChange={(e) => updateField('password', e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Lock size={18} className="text-slate-400 shrink-0" />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    placeholder="Re-enter your password"
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none text-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p role="alert" className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition text-white rounded-xl py-3.5 font-semibold shadow-lg shadow-blue-600/20"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-7">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-slate-400">
              By creating an account, you can access your Brightloop workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
