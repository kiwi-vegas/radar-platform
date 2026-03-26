'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <>
      {searchParams.get('error') && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Authentication failed. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-tx-secondary mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-brand-orange transition-colors text-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-tx-secondary mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 text-tx-primary placeholder:text-tx-muted focus:outline-none focus:border-brand-orange transition-colors text-sm"
            placeholder="••••••••"
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
          className="w-full bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-colors text-sm"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="white"/>
                <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
                <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-tx-primary">RADAR</span>
          </div>
          <p className="text-tx-secondary text-sm">Training Platform</p>
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-tx-primary mb-1">Welcome back</h1>
          <p className="text-tx-secondary text-sm mb-6">Sign in to continue your training</p>

          <Suspense fallback={<div className="h-40 animate-pulse bg-surface rounded-xl" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-tx-muted text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-brand-orange hover:text-brand-orange-light transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
