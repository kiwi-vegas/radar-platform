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
  if (user.graduatedAt) {
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
        style={{ background: '#F9731615', color: '#F97316', border: '1px solid #F9731630' }}>
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
  const color = graduated ? '#22c55e' : pct > 60 ? '#F97316' : pct > 0 ? '#F97316' : '#1E2A3B'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1E2A3B', minWidth: '60px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-9 text-right" style={{ color: graduated ? '#22c55e' : '#F97316' }}>
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
  const [nudgeModal, setNudgeModal] = useState<NudgeModal | null>(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendSuccess, setSendSuccess] = useState(false)

  // Default templates (used in modal before fetching)
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; subject: string; body: string }>>([])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [usersRes, templatesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/templates'),
      ])
      if (!usersRes.ok) throw new Error('Failed to load users')
      const ud = await usersRes.json()
      setUsers(ud.users ?? [])

      if (templatesRes.ok) {
        const td = await templatesRes.json()
        setTemplates(td.templates ?? [])
      }
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

  function openNudgeModal(user: AdminUser) {
    // Auto-select template based on inactivity
    const days = user.inactiveDays ?? 0
    let defaultTemplateId = 'nudge-3day'
    if (days >= 7) defaultTemplateId = 'nudge-7day'
    else if (days >= 4) defaultTemplateId = 'nudge-4day'

    const tpl = templates.find((t) => t.id === defaultTemplateId) ?? templates[0]
    if (!tpl) {
      // Fallback if templates not loaded
      setNudgeModal({
        user,
        templateId: defaultTemplateId,
        subject: 'Quick check-in 👋',
        body: 'Loading template...',
      })
      return
    }
    setNudgeModal({ user, templateId: tpl.id, subject: tpl.subject, body: tpl.body })
    setSendError(null)
    setSendSuccess(false)
  }

  function switchTemplate(templateId: string) {
    if (!nudgeModal) return
    const tpl = templates.find((t) => t.id === templateId)
    if (tpl) {
      setNudgeModal({ ...nudgeModal, templateId, subject: tpl.subject, body: tpl.body })
    }
  }

  async function sendNudge() {
    if (!nudgeModal) return
    setSending(true)
    setSendError(null)
    setSendSuccess(false)

    try {
      const res = await fetch('/api/admin/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: nudgeModal.user.id,
          templateId: nudgeModal.templateId,
          subject: nudgeModal.subject,
          emailBody: nudgeModal.body,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSendSuccess(true)
      // Refresh user list to show nudge badge
      setTimeout(() => {
        setNudgeModal(null)
        load()
      }, 1500)
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
          <svg className="animate-spin mx-auto mb-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
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
          <button onClick={load} className="text-sm text-brand-orange hover:opacity-80 transition-opacity">
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
          { label: 'Total Users', value: counts.total, color: '#F97316', bg: '#F9731610' },
          { label: 'At Risk', value: counts.atRisk, color: '#ef4444', bg: '#ef444410', pulse: counts.atRisk > 0 },
          { label: 'In Progress', value: counts.inProgress, color: '#F97316', bg: '#F9731610' },
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
                background: filter === key ? '#F9731620' : '#131A2B',
                color: filter === key ? '#F97316' : '#6b7280',
                border: filter === key ? '1px solid #F9731640' : '1px solid #1E2A3B',
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
          <div className="divide-y" style={{ divideColor: '#1E2A3B' }}>
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
                    style={{ background: user.isAtRisk ? '#ef444430' : user.status === 'graduated' ? '#22c55e30' : '#F9731630' }}
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
                      <span className="text-xs font-medium" style={{ color: '#F97316' }}>
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
                  {user.status !== 'graduated' && (
                    <button
                      onClick={() => openNudgeModal(user)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90 whitespace-nowrap"
                      style={{ background: '#F9731620', color: '#F97316', border: '1px solid #F9731640' }}
                    >
                      Send Nudge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nudge Modal */}
      {nudgeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !sending) setNudgeModal(null) }}
        >
          <div
            className="w-full max-w-xl rounded-2xl p-6 shadow-2xl animate-slide-up"
            style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-tx-primary font-bold text-lg">Send Nudge Email</h2>
                <p className="text-tx-muted text-sm mt-0.5">
                  To: <span className="text-tx-secondary font-medium">{nudgeModal.user.fullName}</span>
                  <span className="text-tx-muted ml-1">({nudgeModal.user.email})</span>
                </p>
              </div>
              <button
                onClick={() => setNudgeModal(null)}
                disabled={sending}
                className="text-tx-muted hover:text-tx-secondary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Template selector */}
            <div className="flex gap-1.5 mb-4">
              {templates.map((tpl) => {
                const isSelected = nudgeModal.templateId === tpl.id
                const days = nudgeModal.user.inactiveDays ?? 0
                const isRecommended =
                  (tpl.id === 'nudge-7day' && days >= 7) ||
                  (tpl.id === 'nudge-4day' && days >= 4 && days < 7) ||
                  (tpl.id === 'nudge-3day' && days < 4)
                return (
                  <button
                    key={tpl.id}
                    onClick={() => switchTemplate(tpl.id)}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all relative"
                    style={{
                      background: isSelected ? '#F9731625' : '#0B0F1A',
                      color: isSelected ? '#F97316' : '#6b7280',
                      border: isSelected ? '1px solid #F9731650' : '1px solid #1E2A3B',
                    }}
                  >
                    {tpl.name}
                    {isRecommended && (
                      <span
                        className="absolute -top-1.5 -right-1.5 text-xs w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: '#F97316', fontSize: '8px', color: 'white' }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="text-xs font-semibold text-tx-muted mb-1.5 block">Subject</label>
              <input
                type="text"
                value={nudgeModal.subject}
                onChange={(e) => setNudgeModal({ ...nudgeModal, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm text-tx-primary bg-surface outline-none"
                style={{ border: '1px solid #1E2A3B' }}
              />
            </div>

            {/* Body */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-tx-muted mb-1.5 block">Message</label>
              <textarea
                value={nudgeModal.body}
                onChange={(e) => setNudgeModal({ ...nudgeModal, body: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 rounded-lg text-sm text-tx-secondary bg-surface outline-none resize-none leading-relaxed"
                style={{ border: '1px solid #1E2A3B', fontFamily: 'inherit' }}
              />
            </div>

            {/* From / reply-to info */}
            <div
              className="flex items-center gap-4 px-3 py-2 rounded-lg mb-4 text-xs text-tx-muted"
              style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
            >
              <span><span className="text-tx-muted">From:</span> <span className="text-tx-secondary">Barry Jenkins</span></span>
              <span><span className="text-tx-muted">Reply-To:</span> <span className="text-tx-secondary">kiwi@ylopo.com</span></span>
            </div>

            {/* Error / success */}
            {sendError && (
              <div
                className="mb-4 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#ef444410', border: '1px solid #ef444430', color: '#ef4444' }}
              >
                {sendError}
              </div>
            )}
            {sendSuccess && (
              <div
                className="mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                style={{ background: '#22c55e10', border: '1px solid #22c55e30', color: '#22c55e' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Email sent to {nudgeModal.user.email}!
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setNudgeModal(null)}
                disabled={sending}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-tx-secondary hover:text-tx-primary transition-colors disabled:opacity-50"
                style={{ border: '1px solid #1E2A3B' }}
              >
                Cancel
              </button>
              <button
                onClick={sendNudge}
                disabled={sending || sendSuccess}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#F97316' }}
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
                    Send Email
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
