
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (
      email.trim().toLowerCase() === 'admin@brightloop.com' &&
      password === 'admin123'
    ) {
      localStorage.setItem('brightloop_logged_in', 'true')
      navigate('/dashboard')
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center">
      <div className="auth-shell grid lg:grid-cols-2">

        {/* Left branding section */}
        <div className="auth-brand hidden lg:flex flex-col justify-between p-10 xl:p-12 text-white">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Zap size={25} />
            </div>
            <span className="text-2xl font-bold">Brightloop</span>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Subscription management made simple
            </p>

            <h1 className="mt-5 text-4xl xl:text-5xl font-bold leading-tight">
              Manage smarter.
              <br />
              Grow faster.
            </h1>

            <p className="mt-6 max-w-md leading-7 text-blue-100">
              One powerful platform to manage customers, subscriptions,
              recurring billing and business performance.
            </p>

            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <ShieldCheck size={28} className="text-blue-200 shrink-0" />
              <div>
                <p className="font-semibold">Your business, under control</p>
                <p className="text-sm text-blue-200">
                  A unified subscription workspace
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-200">
            © 2026 Brightloop. All rights reserved.
          </p>
        </div>

        {/* Login form section */}
        <div className="auth-content flex items-center justify-center p-5 sm:p-10 lg:p-12 xl:p-16">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-600 p-3 text-white">
                <Zap size={23} />
                <span className="text-xl font-bold">Brightloop</span>
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Welcome back
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your details to access your subscription dashboard.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Mail size={19} className="text-slate-400 shrink-0" />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setError('Password recovery will be available after backend integration.')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <Lock size={19} className="text-slate-400 shrink-0" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
                  {error}
                </p>
              )}

              {/* Remember me */}
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                />
                Remember me
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99]"
              >
                Sign in
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Registration link */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:underline"
              >
                Create account
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-700">
                Demo Credentials
              </p>
              <p className="mt-2 text-slate-500">
                Email: admin@brightloop.com
              </p>
              <p className="text-slate-500">
                Password: admin123
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Secure access to your Brightloop workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
