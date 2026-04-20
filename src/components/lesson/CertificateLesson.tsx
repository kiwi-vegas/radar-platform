'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Lesson, CertificateContent } from '@/lib/types'

interface CertificateLessonProps {
  lesson: Lesson
  isCompleted: boolean
  showCompleted: boolean
  onComplete: () => void
  completing: boolean
  courseSlug: string
}

export default function CertificateLesson({
  lesson,
  showCompleted,
  onComplete,
  completing,
}: CertificateLessonProps) {
  const content = lesson.content as CertificateContent
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Fetch student name
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const name =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          null
        setUserName(name)
      }
    })
  }, [])

  // Fire confetti on mount (burst ~5s then stops)
  useEffect(() => {
    let cancelled = false
    import('canvas-confetti').then((mod) => {
      if (cancelled) return
      const confetti = mod.default

      const colors = ['#7BC109', '#c8a96e', '#ffffff', '#FFD700', '#FFF7ED']

      // Initial center burst
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors })

      // Side cannons at 600ms
      const t1 = setTimeout(() => {
        if (cancelled) return
        confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors })
        confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors })
      }, 600)

      // Final light shower at 2.5s
      const t2 = setTimeout(() => {
        if (cancelled) return
        confetti({ particleCount: 60, spread: 100, origin: { y: 0.4 }, colors, gravity: 0.6 })
      }, 2500)

      return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2) }
    })
    return () => { cancelled = true }
  }, [])

  // ─── LinkedIn share ─────────────────────────────────────────────────────────
  function handleLinkedIn() {
    const url = encodeURIComponent('https://www.ylopo.com')
    const summary = encodeURIComponent(
      `I just completed the RaiDAR: Getting More Sellers training program by Ylopo. Covered Mindset, Tactical strategies, and Scripting for Success — ready to identify, engage, and convert seller leads.`
    )
    const title = encodeURIComponent('RaiDAR Certified — Getting More Sellers')
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`,
      '_blank'
    )
  }

  // ─── Print certificate (formal) ─────────────────────────────────────────────
  function handleDownloadCertificate() {
    const win = window.open('', '_blank')
    if (!win) return
    const name = userName || 'Graduate'
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RaiDAR Certificate — ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Nunito:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8f4ef; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Nunito', sans-serif; padding: 40px 20px; }
    .page { width: 800px; background: #fff; padding: 60px; }
    .outer-border { border: 3px double #c8a96e; padding: 48px; position: relative; }
    .corner { position: absolute; width: 32px; height: 32px; border-color: #7BC109; border-style: solid; }
    .corner-tl { top: 8px; left: 8px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 8px; left: 8px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }
    .badge { text-align: center; margin-bottom: 8px; }
    .cert-label { text-align: center; font-size: 11px; font-weight: 600; letter-spacing: 5px; text-transform: uppercase; color: #7BC109; margin-bottom: 24px; }
    .divider { display: flex; align-items: center; gap: 16px; margin: 20px 0; }
    .divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, #c8a96e, transparent); }
    .divider-diamond { width: 6px; height: 6px; background: #7BC109; transform: rotate(45deg); }
    .certifies { text-align: center; font-family: 'Playfair Display', serif; font-style: italic; font-size: 16px; color: #666; margin-bottom: 16px; }
    .student-name { text-align: center; font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: #1a1a1a; line-height: 1.1; margin-bottom: 16px; }
    .completed-text { text-align: center; font-size: 14px; color: #666; margin-bottom: 8px; }
    .course-name { text-align: center; font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
    .modules { text-align: center; font-size: 12px; color: #7BC109; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; margin-bottom: 8px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e0d0; }
    .footer-left, .footer-right { font-size: 12px; color: #888; }
    .footer-value { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
    .footer-right { text-align: right; }
    @media print { body { background: white; padding: 0; } .page { padding: 0; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="outer-border">
      <div class="corner corner-tl"></div><div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div><div class="corner corner-br"></div>
      <div class="badge">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" fill="#FFF7ED" stroke="#7BC109" stroke-width="1.5"/>
          <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#7BC109"/>
        </svg>
      </div>
      <p class="cert-label">Certificate of Completion</p>
      <div class="divider"><div class="divider-line"></div><div class="divider-diamond"></div><div class="divider-line"></div></div>
      <p class="certifies">This certifies that</p>
      <h1 class="student-name">${name}</h1>
      <p class="completed-text">has successfully completed the full training program</p>
      <div class="divider"><div class="divider-line"></div><div class="divider-diamond"></div><div class="divider-line"></div></div>
      <p class="course-name">${content.courseName}: ${content.courseSubtitle}</p>
      <p style="text-align:center;font-size:13px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:20px;">Training Program</p>
      <p class="modules">${content.modules.join('  ·  ')}</p>
      <div class="footer">
        <div class="footer-left"><div class="footer-value">${completionDate}</div>Date of Completion</div>
        <div class="footer-right"><div class="footer-value">${content.instructorName}</div>${content.instructorTitle}</div>
      </div>
    </div>
  </div>
  <script>window.onload = () => { window.print() }<\/script>
</body></html>`)
    win.document.close()
  }

  // ─── Social card (shareable 1:1) ─────────────────────────────────────────────
  function handleDownloadSocialCard() {
    const win = window.open('', '_blank')
    if (!win) return
    const name = userName || 'Graduate'
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RaiDAR Certified — ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700;800;900&family=Nunito:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .card { width: 1080px; height: 1080px; position: relative; background: #0B0F1A; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(123,193,9,0.18) 0%, transparent 70%); pointer-events: none; }
    .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(123,193,9,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(123,193,9,0.04) 1px, transparent 1px); background-size: 60px 60px; }
    .corner-accent { position: absolute; width: 80px; height: 80px; border-color: rgba(123,193,9,0.5); border-style: solid; }
    .ca-tl { top: 48px; left: 48px; border-width: 3px 0 0 3px; }
    .ca-tr { top: 48px; right: 48px; border-width: 3px 3px 0 0; }
    .ca-bl { bottom: 48px; left: 48px; border-width: 0 0 3px 3px; }
    .ca-br { bottom: 48px; right: 48px; border-width: 0 3px 3px 0; }
    .content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 80px; }
    .ylopo-badge { font-size: 13px; font-weight: 700; letter-spacing: 6px; text-transform: uppercase; color: rgba(123,193,9,0.7); margin-bottom: 48px; }
    .medal { margin-bottom: 40px; }
    .certified-label { font-family: 'Raleway', sans-serif; font-size: 22px; letter-spacing: 10px; color: rgba(123,193,9,0.9); margin-bottom: 16px; text-transform: uppercase; }
    .program-name { font-family: 'Raleway', sans-serif; font-size: 96px; line-height: 1; color: #fff; letter-spacing: 4px; margin-bottom: 8px; text-shadow: 0 0 60px rgba(123,193,9,0.4); }
    .program-sub { font-size: 18px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 56px; }
    .divider { display: flex; align-items: center; gap: 20px; width: 560px; margin-bottom: 48px; }
    .div-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(200,169,110,0.6), transparent); }
    .div-diamond { width: 8px; height: 8px; background: #7BC109; transform: rotate(45deg); flex-shrink: 0; }
    .agent-label { font-size: 14px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 16px; }
    .agent-name { font-family: 'Playfair Display', serif; font-size: 64px; font-weight: 700; color: #fff; line-height: 1.1; margin-bottom: 48px; }
    .tagline { font-size: 17px; color: rgba(255,255,255,0.5); letter-spacing: 1px; margin-bottom: 8px; }
    .date-line { font-size: 14px; color: rgba(123,193,9,0.6); letter-spacing: 2px; text-transform: uppercase; }
    .bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: linear-gradient(to right, transparent, #7BC109, #7BC109, transparent); z-index: 3; }
    @media print { body { background: #0B0F1A; } @page { size: 1080px 1080px; margin: 0; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="grid"></div><div class="glow"></div>
    <div class="corner-accent ca-tl"></div><div class="corner-accent ca-tr"></div>
    <div class="corner-accent ca-bl"></div><div class="corner-accent ca-br"></div>
    <div class="content">
      <p class="ylopo-badge">✦ &nbsp; Ylopo Training &nbsp; ✦</p>
      <div class="medal">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" fill="rgba(123,193,9,0.1)" stroke="rgba(123,193,9,0.6)" stroke-width="2"/>
          <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(123,193,9,0.3)" stroke-width="1" stroke-dasharray="4 4"/>
          <path d="M50 22L55.88 38.94L73.78 39.1L59.94 49.06L64.94 66L50 56.2L35.06 66L40.06 49.06L26.22 39.1L44.12 38.94Z" fill="#7BC109"/>
        </svg>
      </div>
      <p class="certified-label">officially certified</p>
      <h1 class="program-name">RaiDAR</h1>
      <p class="program-sub">Seller Conversion Program</p>
      <div class="divider"><div class="div-line"></div><div class="div-diamond"></div><div class="div-line"></div></div>
      <p class="agent-label">awarded to</p>
      <h2 class="agent-name">${name}</h2>
      <p class="tagline">Ready to identify, engage, and convert seller leads.</p>
      <p class="date-line">${completionDate}</p>
    </div>
    <div class="bottom-bar"></div>
  </div>
  <script>window.onload = () => { window.print() }<\/script>
</body></html>`)
    win.document.close()
  }

  // ─── Completed state ─────────────────────────────────────────────────────────
  if (showCompleted) {
    return (
      <div className="py-2 space-y-8 animate-fade-in">

        {/* Hero */}
        <div className="text-center space-y-4">
          {/* Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute w-36 h-36 rounded-full animate-ping opacity-10" style={{ background: '#7BC109' }} />
            <div className="absolute w-28 h-28 rounded-full opacity-15" style={{ background: '#7BC109' }} />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7BC109, #508200)', boxShadow: '0 0 50px rgba(123,193,9,0.6)' }}
            >
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <path d="M24 6L28.91 18.09L42 19.27L32.5 28.09L35.27 41L24 34.5L12.73 41L15.5 28.09L6 19.27L19.09 18.09Z" fill="white"/>
              </svg>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: '#7BC109' }}>
              ✦ &nbsp; RaiDAR Certified &nbsp; ✦
            </p>
            {userName ? (
              <>
                <h2 className="text-4xl font-bold text-white leading-tight">Congratulations,</h2>
                <h2 className="text-4xl font-bold leading-tight mt-1" style={{ color: '#7BC109', fontFamily: 'Georgia, serif' }}>
                  {userName}.
                </h2>
              </>
            ) : (
              <h2 className="text-3xl font-bold text-white leading-tight">
                Congratulations, you have graduated.
              </h2>
            )}
            <p className="text-tx-secondary mt-4 text-sm max-w-md mx-auto leading-relaxed">
              You&apos;ve officially completed the RaiDAR Seller Conversion Program.
              You are ready to work leads, build relationships, and convert sellers.
            </p>
          </div>
        </div>

        {/* Certificate card — on-screen version */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-tx-muted mb-3 text-center">
            Your Certificate
          </p>
          <div
            className="relative rounded-2xl overflow-hidden mx-auto"
            style={{
              background: '#0D1320',
              border: '1.5px solid #c8a96e44',
              boxShadow: '0 0 60px rgba(200,169,110,0.08), inset 0 0 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Outer ornamental border */}
            <div className="m-3 rounded-xl border" style={{ borderColor: '#c8a96e22', padding: '2rem 2rem 1.5rem' }}>

              {/* Corner flourishes */}
              {(['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'] as const).map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 ${cls} m-4`} style={{ borderColor: '#c8a96e88' }} />
              ))}

              {/* Badge */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(123,193,9,0.1)', border: '1.5px solid rgba(123,193,9,0.5)', boxShadow: '0 0 24px rgba(123,193,9,0.2)' }}
                >
                  <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                    <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#7BC109"/>
                  </svg>
                </div>
              </div>

              {/* Header label */}
              <p className="text-center text-xs font-bold tracking-[0.4em] uppercase mb-4" style={{ color: '#c8a96e' }}>
                Certificate of Completion
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e55)' }} />
                <div className="w-1 h-1 rotate-45 flex-shrink-0" style={{ background: '#7BC109' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8a96e55)' }} />
              </div>

              {/* Certifies text */}
              <p className="text-center text-xs italic mb-3" style={{ color: '#94a3b8', fontFamily: 'Georgia, serif' }}>
                This certifies that
              </p>

              {/* Name */}
              <h3
                className="text-center font-bold mb-1 leading-tight"
                style={{
                  fontSize: userName && userName.length > 20 ? '1.6rem' : '2rem',
                  color: '#ffffff',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  textShadow: '0 0 30px rgba(123,193,9,0.2)',
                }}
              >
                {userName || 'Graduate'}
              </h3>

              <p className="text-center text-xs mb-4" style={{ color: '#64748b' }}>
                has successfully completed the full training program
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e55)' }} />
                <div className="w-1 h-1 rotate-45 flex-shrink-0" style={{ background: '#7BC109' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8a96e55)' }} />
              </div>

              {/* Course name */}
              <p className="text-center font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem' }}>
                {content.courseName}: {content.courseSubtitle}
              </p>
              <p className="text-center text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#7BC109' }}>
                {content.modules.join('  ·  ')}
              </p>

              {/* Footer */}
              <div className="flex justify-between items-end pt-4" style={{ borderTop: '1px solid #1E2A3B' }}>
                <div>
                  <p className="text-xs font-semibold text-white">{completionDate}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>Date of Completion</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">{content.instructorName}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{content.instructorTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share prompt */}
        <div
          className="rounded-2xl border px-5 py-4 text-center"
          style={{ background: 'rgba(123,193,9,0.05)', borderColor: 'rgba(123,193,9,0.2)' }}
        >
          <p className="text-sm font-semibold text-white mb-1">Post this. You earned it.</p>
          <p className="text-xs text-tx-muted leading-relaxed">
            Download your share card and post it to LinkedIn or your team chat.
            Send it to your team leader — this is your proof of graduation and your green light to start working RaiDAR leads.
          </p>
        </div>

        {/* Next steps */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-tx-muted mb-3">What happens next</p>
          {[
            { n: '1', title: 'Share with your team leader', desc: 'Send your card or certificate. This is your official sign-off that you have completed training.' },
            { n: '2', title: 'Get assigned to RaiDAR leads', desc: 'Your team leader will plug you into the RaiDAR pipeline. These are real homeowners — treat every call like the training.' },
            { n: '3', title: 'Apply everything you learned', desc: 'Always Be Consulting. Disarm. Get curious. Normalize not-ready. The scripts are in your head — trust them.' },
          ].map((step) => (
            <div key={step.n} className="flex gap-4 px-4 py-4 rounded-xl border bg-surface-card" style={{ borderColor: '#1E2A3B' }}>
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#7BC109' }}>
                {step.n}
              </div>
              <div>
                <p className="text-sm font-semibold text-tx-primary">{step.title}</p>
                <p className="text-xs text-tx-muted mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {/* Primary — download share card */}
          <button
            onClick={handleDownloadSocialCard}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7BC109, #508200)', boxShadow: '0 4px 24px rgba(123,193,9,0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Download &amp; Share Your Card
          </button>

          {/* Secondary row */}
          <div className="grid grid-cols-3 gap-2">
            {/* LinkedIn */}
            <button
              onClick={handleLinkedIn}
              className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors"
              style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#94a3b8' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </button>

            {/* Formal certificate */}
            <button
              onClick={handleDownloadCertificate}
              className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors"
              style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#94a3b8' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Certificate
            </button>

            {/* Dashboard */}
            <button
              onClick={() => router.push('/dashboard')}
              className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors"
              style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#94a3b8' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Preview state (not yet completed) ───────────────────────────────────────
  return (
    <div className="py-4 animate-fade-in">
      <div className="text-center mb-6">
        <p className="text-xs font-bold tracking-[0.35em] uppercase mb-3" style={{ color: '#7BC109' }}>
          ✦ &nbsp; RaiDAR Certified &nbsp; ✦
        </p>
        <h2 className="text-2xl font-bold text-tx-primary mb-2">You&apos;re almost there.</h2>
        <p className="text-tx-secondary text-sm max-w-lg mx-auto leading-relaxed">
          Complete all three sections of the RaiDAR training to earn your certificate.
          Once you graduate, you can download and share it with your team leader.
        </p>
      </div>

      {/* Certificate preview — dimmed */}
      <div
        className="relative rounded-2xl overflow-hidden mx-auto mb-6 opacity-50"
        style={{ background: '#0D1320', border: '1.5px solid #c8a96e33' }}
      >
        <div className="m-3 rounded-xl border p-8 text-center" style={{ borderColor: '#c8a96e22' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(123,193,9,0.1)', border: '1.5px solid rgba(123,193,9,0.4)' }}>
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path d="M24 12L27.09 19.26L35 20.27L29.5 25.64L30.89 33.5L24 29.77L17.11 33.5L18.5 25.64L13 20.27L20.91 19.26L24 12Z" fill="#7BC109"/>
            </svg>
          </div>
          <p className="text-xs font-bold tracking-[0.35em] uppercase mb-4" style={{ color: '#c8a96e' }}>Certificate of Completion</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e44)' }} />
            <div className="w-1 h-1 rotate-45" style={{ background: '#7BC109' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8a96e44)' }} />
          </div>
          <p className="text-xs italic mb-2" style={{ color: '#64748b', fontFamily: 'Georgia, serif' }}>This certifies that</p>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {userName || 'Your Name'}
          </h3>
          <p className="text-xs mb-3" style={{ color: '#64748b' }}>has successfully completed</p>
          <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {content.courseName}: {content.courseSubtitle}
          </p>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#7BC109' }}>
            {content.modules.join('  ·  ')}
          </p>
        </div>
      </div>

      {/* Graduate CTA */}
      <div className="text-center">
        <button
          onClick={onComplete}
          disabled={completing}
          className="px-10 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          style={{ background: '#7BC109', boxShadow: '0 4px 20px rgba(123,193,9,0.35)' }}
        >
          {completing ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Graduating…
            </>
          ) : (
            <>
              Graduate &amp; Claim Certificate
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
