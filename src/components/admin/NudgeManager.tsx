'use client'

import { useState, useEffect } from 'react'

interface Template {
  id: string
  name: string
  subject: string
  body: string
  updated_at: string
}

interface AtRiskUser {
  id: string
  email: string
  fullName: string
  inactiveDays: number | null
  completedLessons: number
  totalLessons: number
  pct: number
  lastNudge: { templateId: string; sentAt: string } | null
}

const TEMPLATE_ORDER = ['nudge-3day', 'nudge-4day', 'nudge-7day']

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function NudgeManager() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [atRiskUsers, setAtRiskUsers] = useState<AtRiskUser[]>([])
  const [selectedId, setSelectedId] = useState('nudge-3day')
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Per-user send state
  const [sendingUserId, setSendingUserId] = useState<string | null>(null)
  const [sentUserIds, setSentUserIds] = useState<Set<string>>(new Set())
  const [sendErrors, setSendErrors] = useState<Record<string, string>>({})

  async function load() {
    setLoading(true)
    try {
      const [templatesRes, usersRes] = await Promise.all([
        fetch('/api/admin/templates'),
        fetch('/api/admin/users'),
      ])
      if (!templatesRes.ok) throw new Error('Failed to load templates')
      const td = await templatesRes.json()
      const sortedTemplates = (td.templates ?? []).sort(
        (a: Template, b: Template) => TEMPLATE_ORDER.indexOf(a.id) - TEMPLATE_ORDER.indexOf(b.id)
      )
      setTemplates(sortedTemplates)

      // Set initial edit state to first template
      const first = sortedTemplates.find((t: Template) => t.id === selectedId) ?? sortedTemplates[0]
      if (first) {
        setEditSubject(first.subject)
        setEditBody(first.body)
      }

      if (usersRes.ok) {
        const ud = await usersRes.json()
        const atRisk = (ud.users ?? []).filter((u: AtRiskUser & { isAtRisk: boolean }) => u.isAtRisk)
        setAtRiskUsers(atRisk)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function selectTemplate(id: string) {
    const tpl = templates.find((t) => t.id === id)
    if (tpl) {
      setSelectedId(id)
      setEditSubject(tpl.subject)
      setEditBody(tpl.body)
      setSaveSuccess(false)
    }
  }

  async function saveTemplate() {
    setSaving(true)
    setSaveSuccess(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, subject: editSubject, body: editBody }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      setSaveSuccess(true)
      // Update local state
      setTemplates((prev) => prev.map((t) => t.id === selectedId
        ? { ...t, subject: editSubject, body: editBody }
        : t
      ))
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function sendToUser(user: AtRiskUser) {
    setSendingUserId(user.id)
    setSendErrors((prev) => { const n = { ...prev }; delete n[user.id]; return n })
    try {
      const res = await fetch('/api/admin/nudge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          templateId: selectedId,
          subject: editSubject,
          emailBody: editBody,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')
      setSentUserIds((prev) => new Set([...prev, user.id]))
    } catch (e) {
      setSendErrors((prev) => ({ ...prev, [user.id]: e instanceof Error ? e.message : 'Failed' }))
    } finally {
      setSendingUserId(null)
    }
  }

  const currentTemplate = templates.find((t) => t.id === selectedId)
  const isDirty = currentTemplate &&
    (editSubject !== currentTemplate.subject || editBody !== currentTemplate.body)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tx-primary">Email Templates</h1>
        <p className="text-tx-muted text-sm mt-0.5">
          Edit your nudge sequences. Changes take effect on the next send — previously sent emails are unchanged.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Template Editor */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2A3B' }}>
          {/* Template tabs */}
          <div className="flex" style={{ background: '#0D1320', borderBottom: '1px solid #1E2A3B' }}>
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => selectTemplate(tpl.id)}
                className="flex-1 py-3 px-4 text-xs font-semibold transition-colors relative"
                style={{
                  color: selectedId === tpl.id ? '#F97316' : '#6b7280',
                  background: selectedId === tpl.id ? '#F9731610' : 'transparent',
                  borderBottom: selectedId === tpl.id ? '2px solid #F97316' : '2px solid transparent',
                }}
              >
                {tpl.name}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4" style={{ background: '#131A2B' }}>
            {/* Email metadata */}
            <div
              className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-xs text-tx-muted"
              style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
            >
              <div>
                <span className="text-tx-muted">From: </span>
                <span className="text-tx-secondary">Barry Jenkins</span>
              </div>
              <div>
                <span className="text-tx-muted">Reply-To: </span>
                <span className="text-tx-secondary">kiwi@ylopo.com</span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-tx-muted block mb-1.5">Subject Line</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => { setEditSubject(e.target.value); setSaveSuccess(false) }}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-tx-primary outline-none"
                style={{ background: '#0B0F1A', border: '1px solid #1E2A3B' }}
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-xs font-semibold text-tx-muted block mb-1.5">Email Body</label>
              <textarea
                value={editBody}
                onChange={(e) => { setEditBody(e.target.value); setSaveSuccess(false) }}
                rows={16}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-tx-secondary outline-none resize-none leading-relaxed"
                style={{ background: '#0B0F1A', border: '1px solid #1E2A3B', fontFamily: 'inherit' }}
              />
            </div>

            {/* Last updated */}
            {currentTemplate && (
              <p className="text-tx-muted text-xs">
                Last updated: {formatRelative(currentTemplate.updated_at)}
              </p>
            )}

            {error && (
              <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#ef444410', color: '#ef4444', border: '1px solid #ef444425' }}>
                {error}
              </div>
            )}

            {/* Save button */}
            <button
              onClick={saveTemplate}
              disabled={saving || !isDirty}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: saveSuccess ? '#22c55e20' : '#F9731620',
                color: saveSuccess ? '#22c55e' : '#F97316',
                border: saveSuccess ? '1px solid #22c55e40' : '1px solid #F9731640',
              }}
            >
              {saving ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Saving…
                </>
              ) : saveSuccess ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Saved!
                </>
              ) : (
                'Save Template'
              )}
            </button>
          </div>
        </div>

        {/* At-risk users panel */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2A3B' }}>
          <div className="px-5 py-4" style={{ background: '#0D1320', borderBottom: '1px solid #1E2A3B' }}>
            <h2 className="text-tx-primary font-semibold text-sm">Send to At-Risk Users</h2>
            <p className="text-tx-muted text-xs mt-0.5">
              Users who started but haven't been active in 3+ days
            </p>
          </div>

          <div style={{ background: '#131A2B' }}>
            {atRiskUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: '#22c55e15' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-tx-secondary text-sm font-medium">No at-risk users right now</p>
                <p className="text-tx-muted text-xs mt-1">Everyone is on track or has graduated</p>
              </div>
            ) : (
              <div className="divide-y" style={{ divideColor: '#1E2A3B' }}>
                {atRiskUsers.map((user) => {
                  const isSent = sentUserIds.has(user.id)
                  const isSending = sendingUserId === user.id
                  const sendErr = sendErrors[user.id]
                  return (
                    <div key={user.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                            style={{ background: '#ef444430' }}
                          >
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-tx-primary text-sm font-medium truncate">{user.fullName}</p>
                            <p className="text-tx-muted text-xs truncate">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => sendToUser(user)}
                          disabled={isSending || isSent}
                          className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={isSent
                            ? { background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }
                            : { background: '#F9731615', color: '#F97316', border: '1px solid #F9731635' }
                          }
                        >
                          {isSending ? (
                            <>
                              <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                              </svg>
                              Sending
                            </>
                          ) : isSent ? (
                            <>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Sent
                            </>
                          ) : (
                            'Send →'
                          )}
                        </button>
                      </div>

                      {/* User stats */}
                      <div className="flex items-center gap-3 mt-2.5 ml-10">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded"
                          style={{ background: '#ef444415', color: '#ef4444' }}
                        >
                          {user.inactiveDays}d inactive
                        </span>
                        <span className="text-tx-muted text-xs">
                          {user.completedLessons}/{user.totalLessons} lessons ({user.pct}%)
                        </span>
                        {user.lastNudge && (
                          <span className="text-tx-muted text-xs">
                            Last nudge: {formatRelative(user.lastNudge.sentAt)}
                          </span>
                        )}
                      </div>

                      {sendErr && (
                        <p className="text-xs mt-2 ml-10" style={{ color: '#ef4444' }}>
                          {sendErr}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {atRiskUsers.length > 0 && (
            <div className="px-5 py-3" style={{ background: '#0D1320', borderTop: '1px solid #1E2A3B' }}>
              <p className="text-tx-muted text-xs">
                Using the <span className="text-tx-secondary font-medium">{currentTemplate?.name}</span> template.
                Switch tabs to change which email is sent.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage instructions */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#131A2B', border: '1px solid #1E2A3B' }}
      >
        <h3 className="text-tx-primary font-semibold text-sm mb-3">How nudges work</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-tx-muted">
          <div>
            <p className="font-semibold text-tx-secondary mb-1">3-Day Nudge</p>
            <p>Friendly check-in. Sent when a user hasn't been active for 3 days. Encouraging tone, low pressure.</p>
          </div>
          <div>
            <p className="font-semibold text-tx-secondary mb-1">4-Day Follow-Up</p>
            <p>Second touch. Raises the stakes by sharing what other agents are achieving. Momentum-focused.</p>
          </div>
          <div>
            <p className="font-semibold text-tx-secondary mb-1">7-Day Final Push</p>
            <p>Direct accountability message. Sets consequences of inaction. For users who haven't responded to earlier nudges.</p>
          </div>
        </div>
        <div className="mt-4 pt-4 text-xs text-tx-muted" style={{ borderTop: '1px solid #1E2A3B' }}>
          <p><span className="font-semibold text-tx-secondary">All emails</span> appear from Barry Jenkins with replies going to kiwi@ylopo.com. Configure your sending domain with <code className="text-tx-secondary bg-surface px-1 py-0.5 rounded text-xs">NUDGE_FROM_EMAIL</code> in Vercel environment variables.</p>
        </div>
      </div>
    </div>
  )
}
