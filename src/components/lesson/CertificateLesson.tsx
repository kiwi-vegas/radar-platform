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
  const [instagramCopied, setInstagramCopied] = useState(false)
  const router = useRouter()

  const shareCaption = `Guess what? I'm super excited to keep leveling up my real estate skills 🎉 I just graduated from the RaiDAR: Getting More Sellers program by Ylopo! This training covered seller mindset, tactical prospecting, and scripting — everything I need to identify, engage, and convert seller leads. Can't wait to put it all into action. 🏡 #RaiDAR #YlopoUniversity #RealEstate #SellerLeads #LevelingUp`

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

  // ─── Share handlers ──────────────────────────────────────────────────────────
  function handleLinkedIn() {
    const url = encodeURIComponent('https://www.ylopo.com')
    const summary = encodeURIComponent(shareCaption)
    const title = encodeURIComponent('RaiDAR Certified — Getting More Sellers')
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank')
  }

  function handleFacebook() {
    const url = encodeURIComponent('https://www.ylopo.com')
    const quote = encodeURIComponent(shareCaption)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank')
  }

  function handleInstagram() {
    navigator.clipboard.writeText(shareCaption).catch(() => {})
    setInstagramCopied(true)
    setTimeout(() => setInstagramCopied(false), 3000)
    window.open('https://www.instagram.com/', '_blank')
  }

  // ─── Print certificate (formal) ─────────────────────────────────────────────
  function handleDownloadCertificate() {
    const win = window.open('', '_blank')
    if (!win) return
    const name = userName || 'Graduate'
    const modulesLine = content.modules.join(' &nbsp;&middot;&nbsp; ')
    const ribbonUrl = `${window.location.origin}/images/graduate-ribbon.png`
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>University of Ylopo &mdash; ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&family=Dancing+Script:wght@600;700&display=swap');
    :root {
      --green: #7BC109; --green-dark: #508200;
      --navy: #172F44; --slate: #696F8B;
      --gold: #ba9a2c; --white: #fff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: #eef1f4;
      font-family: 'Nunito', Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body { padding: 32px; }
    .wrap { width: 800px; margin: 0 auto; }
    .cert {
      position: relative;
      background: linear-gradient(170deg, #fff 0%, #f9fbfc 100%);
      border: 2px solid rgba(23,47,68,0.16);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(23,47,68,0.12);
      padding: 48px 56px 42px;
    }
    .cert::before {
      content: "";
      position: absolute;
      inset: 13px;
      border: 1px solid rgba(23,47,68,0.1);
      border-radius: 16px;
      pointer-events: none;
    }
    .accent-tr {
      position: absolute; top: 0; right: 0;
      width: 130px; height: 130px;
      background: linear-gradient(225deg, var(--green) 0%, var(--green) 28%, transparent 58%);
      border-radius: 0 24px 0 0; opacity: 0.13;
    }
    .accent-bl {
      position: absolute; bottom: 0; left: 0;
      width: 110px; height: 110px;
      background: linear-gradient(45deg, var(--navy) 0%, var(--navy) 28%, transparent 58%);
      border-radius: 0 0 0 24px; opacity: 0.07;
    }
    .university {
      font-family: 'Raleway', sans-serif; color: var(--navy);
      font-size: 13.5px; font-weight: 700; letter-spacing: 0.26em;
      text-transform: uppercase; text-align: center; margin-top: 12px;
    }
    .dept { text-align: center; color: var(--slate); font-size: 12px; margin-top: 5px; }
    .title {
      font-family: 'Raleway', sans-serif; color: var(--navy);
      font-size: 36px; font-weight: 800; letter-spacing: 0.04em;
      text-transform: uppercase; text-align: center; margin-top: 22px;
    }
    .rule {
      width: 155px; height: 3px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      border-radius: 999px; margin: 13px auto 18px;
    }
    .certifies { text-align: center; font-size: 16px; color: #666; font-weight: 500; }
    .name {
      text-align: center; font-family: 'Raleway', sans-serif;
      color: var(--gold); font-size: 44px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.02em;
      line-height: 1.1; margin: 10px 0 12px;
    }
    .body {
      text-align: center; max-width: 580px; margin: 0 auto;
      color: #4E4E4E; font-size: 14px; line-height: 1.6;
    }
    .course-block { text-align: center; margin-top: 26px; }
    .course-label {
      color: var(--slate); font-size: 11px; letter-spacing: 0.22em;
      text-transform: uppercase; font-weight: 700; margin-bottom: 7px;
    }
    .course-name {
      font-family: 'Raleway', sans-serif; color: var(--navy);
      font-size: 24px; font-weight: 800; line-height: 1.2;
    }
    .course-sub {
      margin-top: 6px; color: var(--slate);
      font-size: 12px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 600;
    }
    .date-line { text-align: center; margin-top: 20px; color: #4E4E4E; font-size: 13px; }
    .sig-row {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
      margin-top: 30px; padding-top: 22px;
      border-top: 1px solid rgba(23,47,68,0.14);
    }
    .sig { text-align: center; }
    .sig-mark {
      height: 44px; display: flex; align-items: flex-end; justify-content: center;
      margin-bottom: 6px; font-size: 26px; color: var(--navy);
      font-family: 'Dancing Script', cursive; font-weight: 700;
      letter-spacing: -0.01em;
    }
    .sig-1 .sig-mark { transform: rotate(-3deg); font-size: 24px; }
    .sig-2 .sig-mark { transform: rotate(-1.5deg); font-size: 22px; }
    .sig-3 .sig-mark { transform: rotate(-2.5deg); font-size: 23px; }
    .sig-line { width: 85%; margin: 0 auto 7px; border-top: 1px solid rgba(23,47,68,0.25); }
    .sig-name { font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 700; color: var(--navy); }
    .sig-title { margin-top: 3px; font-size: 11px; color: var(--slate); font-weight: 600; }
    @media print {
      html, body { background: #fff; padding: 0; }
      .cert { box-shadow: none; margin: 0 auto; }
      @page { size: auto; margin: 0.3in; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="cert">
      <div class="accent-tr"></div>
      <div class="accent-bl"></div>
      <img src="${ribbonUrl}" alt="Graduate 2026" style="width:120px;height:auto;display:block;margin:0 auto 4px;filter:drop-shadow(0 4px 12px rgba(123,193,9,0.2))" />
      <div class="university">University of Ylopo</div>
      <div class="dept">Faculty of Digital Prospecting, Client Conversion &amp; Real Estate Growth</div>
      <div class="title">Diploma of Graduation</div>
      <div class="rule"></div>
      <div class="certifies">This certifies that</div>
      <div class="name">${name}</div>
      <div class="body">has successfully completed the program requirements for graduation from the University of Ylopo and has demonstrated achievement in modern real-estate marketing, seller conversion, and business growth systems.</div>
      <div class="course-block">
        <div class="course-label">Program completed</div>
        <div class="course-name">${content.courseName}: ${content.courseSubtitle}</div>
        <div class="course-sub">${modulesLine}</div>
      </div>
      <div class="date-line"><strong>${completionDate}</strong> &nbsp;&bull;&nbsp; Official Date of Completion</div>
      <div class="sig-row">
        <div class="sig sig-1">
          <div class="sig-mark">Barry Jenkins</div>
          <div class="sig-line"></div>
          <div class="sig-name">Barry Jenkins</div>
          <div class="sig-title">Head Realtor In Residence</div>
        </div>
        <div class="sig sig-2">
          <div class="sig-mark">Howard Tager</div>
          <div class="sig-line"></div>
          <div class="sig-name">Howard Tager</div>
          <div class="sig-title">CEO &amp; Co-Founder, Ylopo</div>
        </div>
        <div class="sig sig-3">
          <div class="sig-mark">Juefeng Ge</div>
          <div class="sig-line"></div>
          <div class="sig-name">Juefeng Ge</div>
          <div class="sig-title">President &amp; Co-Founder, Ylopo</div>
        </div>
      </div>
    </div>
  </div>
  <script>window.onload = () => { window.print() }<\/script>
</body>
</html>`)
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
              background: 'linear-gradient(170deg, #0f1829 0%, #0D1320 100%)',
              border: '1.5px solid #c8a96e33',
              boxShadow: '0 0 80px rgba(200,169,110,0.06), 0 24px 48px rgba(0,0,0,0.4)',
            }}
          >
            {/* Green corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-tr-2xl opacity-10" style={{ background: 'linear-gradient(225deg, #7BC109 0%, #7BC109 30%, transparent 60%)' }} />
            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-bl-2xl opacity-6" style={{ background: 'linear-gradient(45deg, #172F44 0%, #172F44 30%, transparent 60%)' }} />

            <div className="relative m-3 rounded-xl border" style={{ borderColor: '#c8a96e18', padding: '1.75rem 1.75rem 1.5rem' }}>

              {/* Corner flourishes */}
              {(['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'] as const).map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 ${cls} m-3`} style={{ borderColor: '#c8a96e55' }} />
              ))}

              {/* Ribbon badge */}
              <div className="flex justify-center mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/graduate-ribbon.png" alt="Graduate 2026" style={{ width: '110px', height: 'auto', filter: 'drop-shadow(0 4px 12px rgba(123,193,9,0.25))' }} />
              </div>

              {/* University header */}
              <p className="text-center text-xs font-bold tracking-[0.28em] uppercase mb-1" style={{ color: '#94a3b8' }}>
                University of Ylopo
              </p>
              <p className="text-center text-xs mb-3" style={{ color: '#475569', fontSize: '10px' }}>
                Faculty of Digital Prospecting &amp; Real Estate Growth
              </p>

              {/* Diploma title */}
              <p className="text-center font-bold tracking-[0.06em] uppercase mb-3" style={{ color: '#c8a96e', fontFamily: 'Raleway, sans-serif', fontSize: '1.1rem' }}>
                Diploma of Graduation
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e44)' }} />
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#7BC109' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8a96e44)' }} />
              </div>

              {/* Certifies text */}
              <p className="text-center text-xs italic mb-2" style={{ color: '#64748b', fontFamily: 'Georgia, serif' }}>
                This certifies that
              </p>

              {/* Name */}
              <h3
                className="text-center font-bold mb-1 leading-tight tracking-wide uppercase"
                style={{
                  fontSize: userName && userName.length > 20 ? '1.5rem' : '1.85rem',
                  color: '#c8a96e',
                  fontFamily: 'Raleway, sans-serif',
                  textShadow: '0 0 30px rgba(200,169,110,0.2)',
                }}
              >
                {userName || 'Graduate'}
              </h3>

              <p className="text-center text-xs mb-4" style={{ color: '#475569' }}>
                has successfully completed the full training program
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e44)' }} />
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#7BC109' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8a96e44)' }} />
              </div>

              {/* Course name */}
              <p className="text-center font-bold mb-1" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '1.1rem', color: '#e2e8f0' }}>
                {content.courseName}: {content.courseSubtitle}
              </p>
              <p className="text-center text-xs tracking-[0.22em] uppercase mb-5" style={{ color: '#7BC109' }}>
                {content.modules.join('  ·  ')}
              </p>

              {/* Three signatories */}
              <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: '1px solid #1E2A3B' }}>
                {[
                  { sig: 'Barry Jenkins', name: 'Barry Jenkins', title: 'Head Realtor In Residence', rotate: '-3deg', size: '22px' },
                  { sig: 'Howard Tager', name: 'Howard Tager', title: 'CEO & Co-Founder, Ylopo', rotate: '-1.5deg', size: '20px' },
                  { sig: 'Juefeng Ge', name: 'Juefeng Ge', title: 'President & Co-Founder', rotate: '-2.5deg', size: '21px' },
                ].map((s) => (
                  <div key={s.name} className="text-center">
                    <div className="h-10 flex items-end justify-center mb-1 overflow-hidden">
                      <span style={{
                        fontFamily: '"Dancing Script", cursive',
                        fontSize: s.size,
                        fontWeight: 700,
                        color: '#94a3b8',
                        transform: `rotate(${s.rotate})`,
                        display: 'inline-block',
                        lineHeight: 1,
                        paddingBottom: '2px',
                        letterSpacing: '-0.01em',
                      }}>
                        {s.sig}
                      </span>
                    </div>
                    <div className="h-px mb-2 mx-1" style={{ background: 'rgba(148,163,184,0.2)' }} />
                    <p style={{ color: '#e2e8f0', fontFamily: 'Raleway, sans-serif', fontSize: '10px', fontWeight: 700 }}>{s.name}</p>
                    <p style={{ color: '#475569', fontSize: '9px', marginTop: '2px' }}>{s.title}</p>
                  </div>
                ))}
              </div>

              {/* Date */}
              <p className="text-center text-xs mt-4" style={{ color: '#475569' }}>
                <span className="font-semibold" style={{ color: '#94a3b8' }}>{completionDate}</span>
                &nbsp;&bull;&nbsp;Official Date of Completion
              </p>
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

          {/* Social share row */}
          <div>
            <p className="text-xs text-tx-muted text-center mb-2">Share your achievement</p>
            <div className="grid grid-cols-3 gap-2">
              {/* LinkedIn */}
              <button
                onClick={handleLinkedIn}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-colors"
                style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#0A66C2' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-colors"
                style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#1877F2' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
              </button>

              {/* Instagram */}
              <button
                onClick={handleInstagram}
                className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-colors relative"
                style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: instagramCopied ? '#7BC109' : '#E1306C' }}
              >
                {instagramCopied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Caption copied!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    Instagram
                  </>
                )}
              </button>
            </div>
            {instagramCopied && (
              <p className="text-xs text-center mt-2" style={{ color: '#7BC109' }}>
                Caption copied — paste it when you create your Instagram post.
              </p>
            )}
          </div>

          {/* Utility row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadCertificate}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-colors"
              style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#94a3b8' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Download Certificate
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-colors"
              style={{ background: '#131A2B', border: '1px solid #1E2A3B', color: '#94a3b8' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        className="relative rounded-2xl overflow-hidden mx-auto mb-6 opacity-40"
        style={{ background: 'linear-gradient(170deg, #0f1829 0%, #0D1320 100%)', border: '1.5px solid #c8a96e33' }}
      >
        <div className="relative m-3 rounded-xl border p-6 text-center" style={{ borderColor: '#c8a96e18' }}>
          {/* Ribbon badge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/graduate-ribbon.png" alt="Graduate" style={{ width: '80px', height: 'auto', margin: '0 auto 8px', display: 'block' }} />
          <p className="text-xs font-bold tracking-[0.26em] uppercase mb-0.5" style={{ color: '#94a3b8' }}>University of Ylopo</p>
          <p className="text-xs mb-3" style={{ color: '#475569', fontSize: '10px' }}>Diploma of Graduation</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c8a96e44)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#7BC109' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c8a96e44)' }} />
          </div>
          <p className="text-xs italic mb-2" style={{ color: '#64748b', fontFamily: 'Georgia, serif' }}>This certifies that</p>
          <h3 className="font-bold mb-2 uppercase tracking-wide" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '1.6rem', color: '#c8a96e' }}>
            {userName || 'Your Name'}
          </h3>
          <p className="text-xs mb-3" style={{ color: '#475569' }}>has successfully completed</p>
          <p className="font-bold mb-1" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '1rem', color: '#e2e8f0' }}>
            {content.courseName}: {content.courseSubtitle}
          </p>
          <p className="text-xs tracking-[0.22em] uppercase" style={{ color: '#7BC109' }}>
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
