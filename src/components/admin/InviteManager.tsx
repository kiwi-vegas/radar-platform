'use client'

import { useState, useEffect, useCallback } from 'react'

interface Invite {
  id: string
  email: string
  invitedAt: string
  acceptedAt: string | null
  nudgeCount: number
  lastNudgeAt: string | null
  status: 'accepted' | 'pending'
}

interface Stats {
  total: number
  accepted: number
  pending: number
}

const DEFAULT_SUBJECT = "You're invited — RADAR training is now open for you"
const DEFAULT_BODY = `Hey there,

Barry Jenkins here.

I wanted to personally reach out and invite you to the RADAR training program.

This is the exact system my team uses to identify serious sellers before they hit the market — and it's been a game changer for the agents who've gone through it.

We're not talking about theory or generic scripts. This is a step-by-step playbook for finding motivated sellers, starting real conversations, and converting them into listings.

The agents I've seen go through RADAR don't just pick up a few extra deals. They build consistent, predictable income.

I'd love to see you get the same results.

Click below to create your free account and get started today. The whole program is self-paced, so you can move through it on your schedule.

And if you have any questions at all — just hit reply. I personally read every response.

Looking forward to seeing you inside.

— Barry`

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function InviteManager() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, accepted: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  const [emails, setEmails] = useState('')
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [body, setBody] = useState(DEFAULT_BODY)
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResults, setSendResults] = useState<{ sent: string[]; skipped: string[]; errors: string[] } | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted'>('all')

  const loadInvites = useCallback(async () => {
    const res = await fetch('/api/admin/invites')
    if (res.ok) {
      const data = await res.json()
      setInvites(data.invites)
      setStats(data.stats)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadInvites() }, [loadInvites])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    // Parse: split on newlines, commas, or semicolons; strip whitespace; dedupe
    const seen = new Set<string>()
    const parsed = emails.split(/[\n,;]+/).map((s) => s.trim().toLowerCase()).filter((s) => {
      if (!s.includes('@') || seen.has(s)) return false
      seen.add(s)
      return true
    })
    if (!parsed.length) return

    setSending(true)
    setSendResults(null)

    const results = { sent: [] as string[], skipped: [] as string[], errors: [] as string[] }

    for (const addr of parsed) {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addr, subject, body }),
      })
      const data = await res.json()
      if (res.ok) results.sent.push(addr)
      else if (res.status === 409) results.skipped.push(addr)
      else results.errors.push(`${addr}: ${data.error || 'failed'}`)
    }

    setSendResults(results)
    if (results.sent.length > 0) {
      setEmails('')
      await loadInvites()
    }
    setSending(false)
  }

  const filtered = invites.filter((i) => filter === 'all' || i.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tx-primary">Invites</h1>
        <p className="text-tx-muted text-sm mt-0.5">
          Send course invitations and track signups. Pending invites get auto-nudged at 1 day, 4 days, and 1 week.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Invited', value: stats.total, color: '#6366f1' },
          { label: 'Accepted', value: stats.accepted, color: '#7BC109' },
          { label: 'Pending', value: stats.pending, color: '#f97316' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}
          >
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-tx-muted text-sm mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Invite form */}
      <div className="rounded-xl p-6" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
        <h2 className="text-sm font-semibold text-tx-primary mb-4">Send an Invite</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs text-tx-muted mb-1.5">
              Email addresses <span className="text-tx-muted font-normal">(one per line, or comma-separated)</span>
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder={`agent@example.com\nanother@example.com`}
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-tx-primary placeholder:text-tx-muted focus:outline-none resize-y"
              style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs text-tx-muted hover:text-tx-secondary transition-colors"
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: showPreview ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {showPreview ? 'Hide' : 'Preview & edit'} invite email
          </button>

          {showPreview && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs text-tx-muted mb-1.5">Subject line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-tx-primary focus:outline-none"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
                />
              </div>
              <div>
                <label className="block text-xs text-tx-muted mb-1.5">Email body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl text-sm text-tx-primary focus:outline-none font-mono resize-y"
                  style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
                />
              </div>
            </div>
          )}

          {sendResults && (
            <div className="space-y-2">
              {sendResults.sent.length > 0 && (
                <div className="p-3 rounded-xl text-sm" style={{ background: '#7BC10915', color: '#7BC109', border: '1px solid #7BC10930' }}>
                  ✓ {sendResults.sent.length} invite{sendResults.sent.length > 1 ? 's' : ''} sent. Auto-nudges scheduled if they don't sign up.
                </div>
              )}
              {sendResults.skipped.length > 0 && (
                <div className="p-3 rounded-xl text-sm text-tx-secondary" style={{ background: '#1E2A3B40', border: '1px solid #1E2A3B' }}>
                  Skipped ({sendResults.skipped.length} already have a pending invite): {sendResults.skipped.join(', ')}
                </div>
              )}
              {sendResults.errors.length > 0 && (
                <div className="p-3 rounded-xl text-red-400 text-sm" style={{ background: '#ef444415', border: '1px solid #ef444430' }}>
                  {sendResults.errors.join(' · ')}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: '#7BC109' }}
          >
            {sending ? 'Sending…' : 'Send Invites'}
          </button>
        </form>
      </div>

      {/* Invite list */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}>
        <div className="flex items-center gap-1 p-4" style={{ borderBottom: '1px solid #1E2A3B' }}>
          {(['all', 'pending', 'accepted'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize"
              style={
                filter === f
                  ? { background: '#7BC10922', color: '#7BC109', border: '1px solid #7BC10944' }
                  : { color: '#6B7280', border: '1px solid transparent' }
              }
            >
              {f}{' '}
              ({f === 'all' ? stats.total : f === 'pending' ? stats.pending : stats.accepted})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-tx-muted text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-tx-muted text-sm">
            {filter === 'all' ? 'No invites sent yet.' : `No ${filter} invites.`}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1E2A3B' }}>
                <th className="text-left px-4 py-3 text-xs font-medium text-tx-muted">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-tx-muted">Invited</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-tx-muted">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-tx-muted">Follow-ups sent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-tx-muted">Last follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invite, i) => (
                <tr
                  key={invite.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #1E2A3B' : undefined }}
                >
                  <td className="px-4 py-3 text-sm text-tx-primary">{invite.email}</td>
                  <td className="px-4 py-3 text-sm text-tx-secondary">{formatDate(invite.invitedAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={
                        invite.status === 'accepted'
                          ? { background: '#7BC10920', color: '#7BC109', border: '1px solid #7BC10940' }
                          : { background: '#f9731620', color: '#f97316', border: '1px solid #f9731640' }
                      }
                    >
                      {invite.status === 'accepted' ? 'Signed up' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-tx-secondary">{invite.nudgeCount} / 3</td>
                  <td className="px-4 py-3 text-sm text-tx-muted">
                    {invite.lastNudgeAt ? formatDate(invite.lastNudgeAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
