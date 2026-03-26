'use client'

import { useState } from 'react'

export default function WaitlistButton({ initialJoined }: { initialJoined: boolean }) {
  const [joined, setJoined] = useState(initialJoined)
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    if (joined || loading) return
    setLoading(true)
    try {
      await fetch('/api/waitlist', { method: 'POST' })
      setJoined(true)
    } finally {
      setLoading(false)
    }
  }

  if (joined) {
    return (
      <div
        className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold"
        style={{ background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e30' }}
      >
        ✓ You're on the waitlist
      </div>
    )
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ background: '#6366f1' }}
    >
      {loading ? 'Joining…' : 'Sign up for the wait list'}
    </button>
  )
}
