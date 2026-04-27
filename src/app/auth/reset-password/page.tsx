'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState<boolean | null>(null)
  const [success, setSuccess] = useState(false)

  // Verify the user landed here with an active reset session (from the email link)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(!!data.session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="white"/>
                <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
                <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-tx-primary">Radar</span>
          </div>
          <p className="text-tx-secondary text-sm">Training Platform</p>
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-tx-primary mb-1">Set a new password</h1>
          <p className="text-tx-secondary text-sm mb-6">
            Enter and confirm a new password for your account.
          </p>

          {sessionReady === null ? (
            <div className="h-40 animate-pulse bg-surface rounded-xl" />
          ) : !sessionReady ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25">
                <p className="text-red-400 text-sm font-medium mb-1">Reset link expired or invalid</p>
                <p className="text-tx-secondary text-xs leading-relaxed">
                  This password reset link is no longer valid. Please request a new one.
                </p>
              </div>
              <Link
                href="/auth/forgot-password"
                className="block text-center w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold rounded-xl py-3 transition-colors text-sm"
              >
                Request new reset link
              </Link>
            </div>
          ) : success ? (
            <div className="p-4 rounded-xl bg-brand-green/10 border border-brand-green/25 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7BC109" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <p className="text-tx-primary text-sm font-medium">Password updated</p>
                <p className="text-tx-secondary text-xs">Redirecting to your dashboard…</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tx-secondary mb-1.5">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                  className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-brand-green transition-colors text-sm"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tx-secondary mb-1.5">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-brand-green transition-colors text-sm"
                  placeholder="Re-enter password"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-colors text-sm"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
