import { createAdminClient } from '@/lib/supabase/admin'
import WaitlistTable from '@/components/admin/WaitlistTable'

export default async function WaitlistPage() {
  const admin = createAdminClient()

  const { data: entries } = await admin
    .from('ppc_waitlist')
    .select('id, email, full_name, signed_up_at')
    .order('signed_up_at', { ascending: false })

  const waitlist = entries ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-tx-primary">PPC Plus Waitlist</h1>
          <p className="text-tx-muted text-sm mt-0.5">
            {waitlist.length} agent{waitlist.length !== 1 ? 's' : ''} waiting for the course to open
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-sm font-bold"
          style={{ background: '#6366f115', color: '#6366f1', border: '1px solid #6366f130' }}
        >
          {waitlist.length} on list
        </div>
      </div>

      {/* Info banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: '#6366f108', border: '1px solid #6366f125' }}
      >
        <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-tx-secondary text-sm leading-relaxed">
          When PPC Plus is ready to launch, use <span className="text-tx-primary font-medium">Copy all emails</span> to export the list,
          or build an email invite flow using the existing nudge system. Each person here has opted in and is expecting to hear from you.
        </p>
      </div>

      <WaitlistTable initialEntries={waitlist} />
    </div>
  )
}
