'use client'

import { useState } from 'react'

interface WaitlistEntry {
  id: string
  email: string
  full_name: string | null
  signed_up_at: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function WaitlistTable({ initialEntries }: { initialEntries: WaitlistEntry[] }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>(initialEntries)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const filtered = entries.filter((e) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      e.email.toLowerCase().includes(q) ||
      (e.full_name ?? '').toLowerCase().includes(q)
    )
  })

  function copyEmails() {
    const emails = filtered.map((e) => e.email).join(', ')
    navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-3 items-center justify-between">
        <div className="relative w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="12" height="12"
            viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
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
        <button
          onClick={copyEmails}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={copied
            ? { background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }
            : { background: '#131A2B', color: '#6b7280', border: '1px solid #1E2A3B' }
          }
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy all emails ({filtered.length})
            </>
          )}
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-tx-muted text-sm">
          {entries.length === 0 ? 'No one on the waitlist yet.' : 'No results match your search.'}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1E2A3B' }}>
          <div
            className="grid text-xs font-semibold text-tx-muted px-5 py-3"
            style={{ gridTemplateColumns: '2fr 2fr 1fr', background: '#0D1320', borderBottom: '1px solid #1E2A3B' }}
          >
            <div>Name</div>
            <div>Email</div>
            <div>Signed Up</div>
          </div>
          <div className="divide-y" style={{ divideColor: '#1E2A3B' }}>
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="grid px-5 py-3.5 items-center hover:bg-surface-card transition-colors"
                style={{ gridTemplateColumns: '2fr 2fr 1fr' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ background: '#6366f130' }}
                  >
                    {(entry.full_name ?? entry.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-tx-primary text-sm font-medium">
                    {entry.full_name ?? '—'}
                  </span>
                </div>
                <span className="text-tx-secondary text-sm">{entry.email}</span>
                <div>
                  <p className="text-tx-secondary text-xs">{formatDate(entry.signed_up_at)}</p>
                  <p className="text-tx-muted text-xs">{formatRelative(entry.signed_up_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
