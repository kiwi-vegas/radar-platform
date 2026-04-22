'use client'

import { useState, useEffect, useMemo } from 'react'

interface AdminUser {
  id: string
  email: string
  fullName: string
  isAdmin: boolean
  joinedAt: string
  lastSignInAt: string | null
  lastActivityAt: string | null
  lastCourseActivityAt: string | null
  enrolledAt: string | null
  graduatedAt: string | null
  completedLessons: number
  totalLessons: number
  pct: number
  status: 'not-started' | 'in-progress' | 'graduated'
  inactiveDays: number | null
  isAtRisk: boolean
  lastNudge: { templateId: string; sentAt: string } | null
}

type FilterTab = 'all' | 'at-risk' | 'in-progress' | 'graduated' | 'not-started'
type SortKey = 'pct-desc' | 'pct-asc' | 'inactive-desc' | 'inactive-asc' | 'joined-newest' | 'joined-oldest'

interface NudgeModal {
  user: AdminUser
  templateId: string
  subject: string
  body: string
}

const TEMPLATE_NAMES: Record<string, string> = {
  'nudge-3day': '3-Day',
  'nudge-4day': '4-Day',
  'nudge-7day': '7-Day',
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusBadge({ user }: { user: AdminUser }) {
  if (user.status === 'graduated') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        Graduated
      </span>
    )
  }
  if (user.isAtRisk) {
    const days = user.inactiveDays ?? 0
    const label = days >= 7 ? '7d Stalled' : days >= 4 ? '4d Inactive' : '3d Inactive'
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        {label}
      </span>
    )
  }
  if (user.status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: '#7BC10915', color: '#7BC109', border: '1px solid #7BC10930' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        In Progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: '#6b728015', color: '#6b7280', border: '1px solid #6b728030' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Not Started
    </span>
  )
}

function ProgressBar({ pct, graduated }: { pct: number; graduated: boolean }) {
  const color = graduated ? '#22c55e' : pct > 60 ? '#7BC109' : pct > 0 ? '#7BC109' : '#1E2A3B'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1E2A3B', minWidth: '60px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-9 text-right" style={{ color: graduated ? '#22c55e' : '#7BC109' }}>
        {pct}%
      </span>
    </div>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [sort, setSort] = useState<SortKey>('inactive-desc')
  const [search, setSearch] = useState('')
  const [congratsModal, setCongratsModal] = useState<NudgeModal | null>(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/users')
      const ud = await res.json()
      if (!res.ok) throw new Error(ud.error || 'Failed to load users')
      setUsers(ud.users ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Counts
  const counts = useMemo(() => {
    const atRisk = users.filter((u) => u.isAtRisk).length
    const inProgress = users.filter((u) => u.status === 'in-progress' && !u.isAtRisk).length
    const graduated = users.filter((u) => u.status === 'graduated').length
    const notStarted = users.filter((u) => u.status === 'not-started').length
    return { total: users.length, atRisk, inProgress, graduated, notStarted }
  }, [users])

  // Filtered + sorted users
  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      if (search) {
        const q = search.toLowerCase()
        if (!u.fullName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      }
      switch (filter) {
        case 'at-risk': return u.isAtRisk
        case 'in-progress': return u.status === 'in-progress' && !u.isAtRisk
        case 'graduated': return u.status === 'graduated'
        case 'not-started': return u.status === 'not-started'
        default: return true
      }
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'pct-desc': return b.pct - a.pct
        case 'pct-asc': return a.pct - b.pct
        case 'inactive-desc': return (b.inactiveDays ?? 0) - (a.inactiveDays ?? 0)
        case 'inactive-asc': return (a.inactiveDays ?? 0) - (b.inactiveDays ?? 0)
        case 'joined-newest': return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        case 'joined-oldest': return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
        default: return 0
      }
    })

    return list
  }, [users, filter, search, sort])

  function openCongratsModal(user: AdminUser) {
    const firstName = user.fullName.split(' ')[0]
    setCongratsModal({
      user,
      templateId: 'congrats',
      subject: `Congratulations on completing Radar, ${firstName}! 🎓`,
      body: `Hey ${firstName},\n\nYou did it! You've officially completed the Radar training and earned your certification.\n\nThis is a big deal — most agents never take the time to systematize their approach to seller leads. You now have the mindset, the scripts, and the framework to work Radar leads with confidence.\n\nNow it's time to put it into action. Your next Radar lead is waiting.\n\nProud of you,\nBarry`,
    })
    setSendError(null)
    setSendSuccess(false)
  }

  async function sendCongrats() {
    if (!congratsModal) return
    setSending(true)
    setSendError(null)
    setSendSuccess(false)
    try {
      const res = await fetch('/api/admin/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: congratsModal.user.id,
          templateId: congratsModal.templateId,
          subject: congratsModal.subject,
          emailBody: congratsModal.body,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSendSuccess(true)
      setTimeout(() => { setCongratsModal(null); load() }, 1500)
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const TAB_LABELS: Record<FilterTab, string> = {
    all: `All (${counts.total})`,
    'at-risk': `🔴 At Risk (${counts.atRisk})`,
    'in-progress': `In Progress (${counts.inProgress})`,
    graduated: `🟢 Graduated (${counts.graduated})`,
    'not-started': `Not Started (${counts.notStarted})`,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <svg className="animate-spin mx-auto mb-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7BC109" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <p className="text-tx-muted text-sm">Loading users…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-red-400 mb-3">{error}</p>
          <button onClick={load} className="text-sm text-brand-green hover:opacity-80 transition-opacity">
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page title + refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tx-primary">User Progress</h1>
          <p className="text-tx-muted text-sm mt-0.5">Track and re-engage your agents</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-tx-muted hover:text-tx-secondary transition-colors px-3 py-2 rounded-lg hover:bg-surface-card border border-transparent hover:border-surface-border"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: counts.total, color: '#7BC109', bg: '#7BC10910' },
          { label: 'At Risk', value: counts.atRisk, color: '#ef4444', bg: '#ef444410', pulse: counts.atRisk > 0 },
          { label: 'In Progress', value: counts.inProgress, color: '#7BC109', bg: '#7BC10910' },
          { label: 'Graduated', value: counts.graduated, color: '#22c55e', bg: '#22c55e10' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 border"
            style={{ background: stat.bg, borderColor: `${stat.color}25` }}
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              {stat.pulse && stat.value > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              )}
            </div>
            <div className="text-tx-muted text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* At-risk banner */}
      {counts.atRisk > 0 && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: '#ef444408', border: '1px solid #ef444425' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#ef444420' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
              {counts.atRisk} agent{counts.atRisk > 1 ? 's' : ''} need attention
            </p>
            <p className="text-tx-muted text-xs">Started the course but haven't been active in 3+ days</p>
          </div>
          <button
            onClick={() => setFilter('at-risk')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            style={{ background: '#ef444420', color: '#ef4444' }}
          >
            View all →
          </button>
        </div>
      )}

      {/* Filters + search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {(Object.entries(TAB_LABELS) as [FilterTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: filter === key ? '#7BC10920' : '#131A2B',
                color: filter === key ? '#7BC109' : '#6b7280',
                border: filter === key ? '1px solid #7BC10940' : '1px solid #1E2A3B',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 rounded-lg text-xs bg-surface-card text-tx-primary placeholder:text-tx-muted outline-none"
              style={{ border: '1px solid #1E2A3B' }}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-1.5 rounded-lg text-xs bg-surface-card text-tx-secondary outline-none"
            style={{ border: '1px solid #1E2A3B' }}
          >
            <option value="inactive-desc">Most inactive first</option>
            <option value="inactive-asc">Recently active first</option>
            <option value="pct-desc">Most progress first</option>
            <option value="pct-asc">Least progress first</option>
            <option value="joined-newest">Newest members</option>
            <option value="joined-oldest">Oldest members</option>
          </select>
        </div>
      </div>

      {/* User table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-tx-muted text-sm">
          No users match this filter.
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2A3B' }}>
          {/* Table header */}
          <div
            className="grid text-xs font-semibold text-tx-muted px-5 py-3"
            style={{ gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr 1.2fr auto', background: '#0D1320', borderBottom: '1px solid #1E2A3B' }}
          >
            <div>User</div>
            <div>Joined / Last Active</div>
            <div>Progress</div>
            <div>Status</div>
            <div>Last Nudge</div>
            <div></div>
          </div>

          {/* Rows */}
          <div className="divide-y" style={{ borderColor: '#1E2A3B' }}>
            {filtered.map((user) => (
              <div
                key={user.id}
                className="grid px-5 py-4 items-center hover:bg-surface-card transition-colors"
                style={{
                  gridTemplateColumns: '2fr 1.5fr 1.2fr 1.5fr 1.2fr auto',
                  borderTop: user.isAtRisk ? '1px solid #ef444418' : undefined,
                  background: user.isAtRisk ? '#ef444405' : undefined,
                }}
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ background: user.isAtRisk ? '#ef444430' : user.status === 'graduated' ? '#22c55e30' : '#7BC10930' }}
                  >
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-tx-primary text-sm font-medium truncate">{user.fullName}</p>
                    <p className="text-tx-muted text-xs truncate">{user.email}</p>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <p className="text-tx-secondary text-xs">{formatDate(user.joinedAt)}</p>
                  <p className="text-tx-muted text-xs mt-0.5">
                    Active: {formatRelative(user.lastCourseActivityAt ?? user.lastSignInAt)}
                    {user.inactiveDays !== null && user.inactiveDays >= 3 && (
                      <span className="ml-1 font-semibold" style={{ color: '#ef4444' }}>
                        ({user.inactiveDays}d)
                      </span>
                    )}
                  </p>
                </div>

                {/* Progress */}
                <div className="pr-4">
                  <ProgressBar pct={user.pct} graduated={!!user.graduatedAt} />
                  <p className="text-tx-muted text-xs mt-1">{user.completedLessons}/{user.totalLessons} lessons</p>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge user={user} />
                </div>

                {/* Last nudge */}
                <div>
                  {user.lastNudge ? (
                    <div>
                      <span className="text-xs font-medium" style={{ color: '#7BC109' }}>
                        {TEMPLATE_NAMES[user.lastNudge.templateId] ?? user.lastNudge.templateId}
                      </span>
                      <p className="text-tx-muted text-xs mt-0.5">{formatRelative(user.lastNudge.sentAt)}</p>
                    </div>
                  ) : (
                    <span className="text-tx-muted text-xs">None sent</span>
                  )}
                </div>

                {/* Actions */}
                <div>
                  {user.status === 'graduated' ? (
                    <button
                      onClick={() => openCongratsModal(user)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 whitespace-nowrap"
                      style={{ background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }}
                    >
                      Send Congrats 🎓
                    </button>
                  ) : user.status === 'in-progress' ? (
                    <span className="text-xs px-2 py-1 rounded-md" style={{ color: '#4b5563', background: '#7BC10908', border: '1px solid #7BC10918' }}>
                      Auto-nudge on
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Congrats Modal */}
      {congratsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-tx-primary">Send Congratulations</div>
                <div className="text-sm text-tx-secondary mt-0.5">to {congratsModal.user.fullName} ({congratsModal.user.email})</div>
              </div>
              <button
                onClick={() => setCongratsModal(null)}
                className="text-tx-muted hover:text-tx-primary transition-colors mt-0.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* From/Reply-To */}
            <div className="text-xs text-tx-muted rounded-lg px-3 py-2" style={{ background: '#0D1320', border: '1px solid #1E2A3B' }}>
              From: Barry Jenkins &lt;barry@yloposend.com&gt; · Reply-To: kiwi@ylopo.com
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-tx-secondary">Subject</label>
              <input
                type="text"
                value={congratsModal.subject}
                onChange={(e) => setCongratsModal({ ...congratsModal, subject: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-tx-primary bg-transparent outline-none focus:ring-1 focus:ring-brand-green/50"
                style={{ border: '1px solid #1E2A3B' }}
              />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-tx-secondary">Message</label>
              <textarea
                value={congratsModal.body}
                onChange={(e) => setCongratsModal({ ...congratsModal, body: e.target.value })}
                rows={9}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-tx-primary bg-transparent outline-none focus:ring-1 focus:ring-brand-green/50 resize-none"
                style={{ border: '1px solid #1E2A3B' }}
              />
            </div>

            {/* Error */}
            {sendError && (
              <div className="text-xs text-red-400 rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {sendError}
              </div>
            )}

            {/* Success */}
            {sendSuccess && (
              <div
                className="text-xs font-medium rounded-lg px-3 py-2 flex items-center gap-2"
                style={{ background: 'rgba(123,193,9,0.12)', border: '1px solid rgba(123,193,9,0.3)', color: '#7BC109' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Congrats email sent to {congratsModal.user.email}!
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCongratsModal(null)}
                disabled={sending}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-tx-secondary hover:text-tx-primary transition-colors disabled:opacity-50"
                style={{ border: '1px solid #1E2A3B' }}
              >
                Cancel
              </button>
              <button
                onClick={sendCongrats}
                disabled={sending || sendSuccess}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#7BC109' }}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Sending…
                  </>
                ) : sendSuccess ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Sent!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Congrats 🎓
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
