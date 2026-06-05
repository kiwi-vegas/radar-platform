'use client'

import { useState, useEffect, useCallback } from 'react'

interface AdminMember {
  id: string
  fullName: string
  email: string
  lastSignInAt: string | null
  status: 'active' | 'pending'
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TeamPage() {
  const [admins, setAdmins] = useState<AdminMember[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [granting, setGranting] = useState(false)
  const [grantError, setGrantError] = useState<string | null>(null)
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null)
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null)
  const [revoking, setRevoking] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/team')
    if (res.ok) {
      const data = await res.json()
      setAdmins(data.admins)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const active = admins.filter((a) => a.status === 'active')
  const pending = admins.filter((a) => a.status === 'pending')

  async function grantAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setGranting(true)
    setGrantError(null)
    setGrantSuccess(null)

    const res = await fetch('/api/admin/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setGrantSuccess(`Admin access granted to ${data.email}`)
      setEmail('')
      await load()
    } else {
      setGrantError(data.error)
    }
    setGranting(false)
  }

  async function revokeAdmin(userId: string) {
    setRevoking(true)
    const res = await fetch('/api/admin/team', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    const data = await res.json()
    if (res.ok) {
      await load()
    } else {
      alert(data.error)
    }
    setRevokeConfirm(null)
    setRevoking(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tx-primary">Admin Team</h1>
        <p className="text-tx-muted text-sm mt-0.5">
          Manage who has access to the admin panel.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
          <div className="text-2xl font-bold" style={{ color: '#7BC109' }}>{active.length}</div>
          <div className="text-tx-muted text-sm mt-0.5">Active admins</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
          <div className="text-2xl font-bold" style={{ color: '#f97316' }}>{pending.length}</div>
          <div className="text-tx-muted text-sm mt-0.5">Pending (never signed in)</div>
        </div>
      </div>

      {/* Grant admin form */}
      <div className="rounded-xl p-6" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
        <h2 className="text-sm font-semibold text-tx-primary mb-4">Grant Admin Access</h2>
        <form onSubmit={grantAdmin} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ylopo.com"
            required
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none"
            style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
          />
          <button
            type="submit"
            disabled={granting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: '#7BC109' }}
          >
            {granting ? 'Granting…' : 'Grant Access'}
          </button>
        </form>
        {grantError && (
          <p className="mt-3 text-sm text-red-400">{grantError}</p>
        )}
        {grantSuccess && (
          <p className="mt-3 text-sm" style={{ color: '#7BC109' }}>{grantSuccess}</p>
        )}
        <p className="mt-3 text-xs text-tx-muted">
          The person must have already created an account at{' '}
          <span className="text-tx-secondary">/auth/signup</span> before you can grant them access.
        </p>
      </div>

      {/* Admin list */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
        {loading ? (
          <div className="p-8 text-center text-tx-muted text-sm">Loading…</div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-tx-muted text-sm">No admins found.</div>
        ) : (
          <>
            <div className="px-5 py-3 text-xs font-semibold text-tx-muted grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', background: '#0D1320', borderBottom: '1px solid #1E2A3B' }}>
              <div>Name</div>
              <div>Email</div>
              <div>Last Sign In</div>
              <div></div>
            </div>
            <div className="divide-y" style={{ borderColor: '#1E2A3B' }}>
              {admins.map((member) => (
                <div
                  key={member.id}
                  className="grid px-5 py-4 items-center"
                  style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: member.status === 'active' ? '#7BC10930' : '#f9731630' }}
                    >
                      {member.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-tx-primary">{member.fullName}</span>
                  </div>
                  <span className="text-sm text-tx-secondary">{member.email}</span>
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={
                        member.status === 'active'
                          ? { background: '#7BC10920', color: '#7BC109', border: '1px solid #7BC10940' }
                          : { background: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: member.status === 'active' ? '#7BC109' : '#f97316' }}
                      />
                      {member.status === 'active' ? `Active · ${formatDate(member.lastSignInAt)}` : 'Pending — never signed in'}
                    </span>
                  </div>
                  <div>
                    {revokeConfirm === member.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-tx-muted">Revoke?</span>
                        <button
                          onClick={() => revokeAdmin(member.id)}
                          disabled={revoking}
                          className="text-xs font-semibold px-2 py-0.5 rounded disabled:opacity-50"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                        >
                          {revoking ? '…' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setRevokeConfirm(null)}
                          className="text-xs px-2 py-0.5 rounded text-tx-muted"
                          style={{ border: '1px solid #1E2A3B' }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevokeConfirm(member.id)}
                        className="text-xs text-tx-muted hover:text-red-400 transition-colors"
                        title="Revoke admin access"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
