import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirectTo=/admin')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  return (
    <div className="min-h-screen" style={{ background: '#0B0F1A' }}>
      {/* Admin header */}
      <header style={{ background: '#0D1320', borderBottom: '1px solid #1E2A3B' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="white"/>
                  <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
                </svg>
              </div>
              <span className="font-bold text-tx-primary tracking-tight text-sm">RADAR</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
                style={{ background: '#F9731622', color: '#F97316', border: '1px solid #F9731644' }}
              >
                Admin
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-sm text-tx-secondary hover:text-tx-primary hover:bg-surface-card transition-colors"
              >
                Users
              </Link>
              <Link
                href="/admin/nudges"
                className="px-3 py-1.5 rounded-lg text-sm text-tx-secondary hover:text-tx-primary hover:bg-surface-card transition-colors"
              >
                Email Templates
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-tx-muted text-xs hidden sm:block">
              {profile.full_name ?? user.email}
            </span>
            <Link
              href="/dashboard"
              className="text-xs text-tx-muted hover:text-tx-secondary transition-colors"
            >
              ← Student view
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
