'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [generatingImage, setGeneratingImage] = useState(false)
  const socialCardRef = useRef<HTMLDivElement>(null)
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

  // ─── Print / PDF certificate ────────────────────────────────────────────────
  function handleDownloadCertificate() {
    const win = window.open('', '_blank')
    if (!win) return
    const name = userName || 'Graduate'
    const modulesLine = content.modules.join(' · ')
    const ribbonUrl = `${window.location.origin}/images/graduate-ribbon2.png`
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>University of Ylopo — ${name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Nunito:wght@400;600;700&family=Dancing+Script:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%;
      background: #fff;
      font-family: 'Nunito', Georgia, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color: #1a1a2e;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4in;
      min-height: 100vh;
    }
    .cert {
      width: 720px;
      padding: 52px 60px 44px;
      background: #fff;
      border: 3px solid #172F44;
      position: relative;
      text-align: center;
    }
    /* Inner ornamental border */
    .cert::before {
      content: '';
      position: absolute;
      inset: 10px;
      border: 1px solid #7BC109;
      pointer-events: none;
    }
    /* Corner marks */
    .corner {
      position: absolute;
      width: 22px; height: 22px;
      border-color: #7BC109; border-style: solid;
    }
    .tl { top: 5px; left: 5px; border-width: 2px 0 0 2px; }
    .tr { top: 5px; right: 5px; border-width: 2px 2px 0 0; }
    .bl { bottom: 5px; left: 5px; border-width: 0 0 2px 2px; }
    .br { bottom: 5px; right: 5px; border-width: 0 2px 2px 0; }

    .ribbon { width: 320px; height: auto; display: block; margin: 0 auto 10px; }

    .university {
      font-family: 'Raleway', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.32em; text-transform: uppercase;
      color: #172F44; margin-bottom: 4px;
    }
    .dept { font-size: 10.5px; color: #696F8B; margin-bottom: 22px; }

    .diploma-title {
      font-family: 'Raleway', sans-serif;
      font-size: 32px; font-weight: 800;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: #172F44; margin-bottom: 10px;
    }
    .rule {
      width: 140px; height: 2px; margin: 0 auto 16px;
      background: #7BC109;
    }
    .certifies { font-size: 14px; color: #555; margin-bottom: 8px; font-style: italic; }
    .name {
      font-family: 'Raleway', sans-serif;
      font-size: 40px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.03em;
      color: #172F44; line-height: 1.1; margin-bottom: 10px;
    }
    .completed { font-size: 13px; color: #555; margin-bottom: 20px; }

    .divider {
      display: flex; align-items: center; gap: 12px; margin: 0 auto 20px; width: 80%;
    }
    .div-line { flex: 1; height: 1px; background: #d0c5b0; }
    .div-diamond { width: 6px; height: 6px; background: #7BC109; transform: rotate(45deg); flex-shrink: 0; }

    .course-label {
      font-size: 9.5px; font-weight: 700; letter-spacing: 0.24em;
      text-transform: uppercase; color: #696F8B; margin-bottom: 6px;
    }
    .course-name {
      font-family: 'Raleway', sans-serif;
      font-size: 22px; font-weight: 800; color: #172F44; margin-bottom: 4px;
    }
    .course-sub {
      font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
      text-transform: uppercase; color: #7BC109; margin-bottom: 20px;
    }
    .date { font-size: 12px; color: #555; margin-bottom: 28px; }
    .date strong { color: #172F44; }

    .sig-row {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 16px; padding-top: 18px;
      border-top: 1px solid #d0c5b0;
    }
    .sig-script {
      font-family: 'Dancing Script', cursive; font-weight: 700;
      color: #172F44; margin-bottom: 6px; line-height: 1; display: block;
    }
    .sig-1 .sig-script { font-size: 22px; transform: rotate(-2.5deg); display: inline-block; }
    .sig-2 .sig-script { font-size: 20px; transform: rotate(-1deg); display: inline-block; }
    .sig-3 .sig-script { font-size: 21px; transform: rotate(-2deg); display: inline-block; }
    .sig-line { width: 80%; height: 1px; background: #aaa; margin: 4px auto 6px; }
    .sig-name { font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 700; color: #172F44; }
    .sig-title { font-size: 10px; color: #696F8B; font-weight: 600; margin-top: 2px; }

    @media print {
      @page { size: letter portrait; margin: 0.35in; }
      body { padding: 0; }
      .cert { border-color: #172F44; }
    }
  </style>
</head>
<body>
  <div class="cert">
    <div class="corner tl"></div>
    <div class="corner tr"></div>
    <div class="corner bl"></div>
    <div class="corner br"></div>

    <img class="ribbon" src="${ribbonUrl}" alt="Graduate 2026" id="ribbon" style="width:320px;height:auto;display:block;margin:0 auto 10px" />

    <div class="university">University of Ylopo</div>
    <div class="dept">Faculty of Digital Prospecting, Client Conversion &amp; Real Estate Growth</div>

    <div class="diploma-title">Diploma of Graduation</div>
    <div class="rule"></div>

    <div class="certifies">This certifies that</div>
    <div class="name">${name}</div>
    <div class="completed">has successfully completed all requirements for graduation from the University of Ylopo</div>

    <div class="divider"><div class="div-line"></div><div class="div-diamond"></div><div class="div-line"></div></div>

    <div class="course-label">Program Completed</div>
    <div class="course-name">${content.courseName}: ${content.courseSubtitle}</div>
    <div class="course-sub">${modulesLine}</div>

    <div class="date"><strong>${completionDate}</strong> &nbsp;&bull;&nbsp; Official Date of Completion</div>

    <div class="sig-row">
      <div class="sig sig-1">
        <span class="sig-script">Barry Jenkins</span>
        <div class="sig-line"></div>
        <div class="sig-name">Barry Jenkins</div>
        <div class="sig-title">Head Realtor In Residence</div>
      </div>
      <div class="sig sig-2">
        <span class="sig-script">Howard Tager</span>
        <div class="sig-line"></div>
        <div class="sig-name">Howard Tager</div>
        <div class="sig-title">CEO &amp; Co-Founder, Ylopo</div>
      </div>
      <div class="sig sig-3">
        <span class="sig-script">Juefeng Ge</span>
        <div class="sig-line"></div>
        <div class="sig-name">Juefeng Ge</div>
        <div class="sig-title">President &amp; Co-Founder, Ylopo</div>
      </div>
    </div>
  </div>
  <script>
    function doPrint() { window.print(); }
    var img = document.getElementById('ribbon');
    document.fonts.ready.then(function() {
      if (img.complete) { setTimeout(doPrint, 150); }
      else { img.onload = function() { setTimeout(doPrint, 150); }; }
    });
  <\/script>
</body>
</html>`)
    win.document.close()
  }

  // ─── Social card → real PNG download via html2canvas ────────────────────────
  async function handleDownloadSocialCard() {
    if (!socialCardRef.current || generatingImage) return
    setGeneratingImage(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(socialCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0B0F1A',
        logging: false,
      })
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `RaiDAR-Certified-${(userName || 'Graduate').replace(/\s+/g, '-')}.png`
        a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    } finally {
      setGeneratingImage(false)
    }
  }

  // ─── Completed state ─────────────────────────────────────────────────────────
  if (showCompleted) {
    return (
      <div className="py-2 space-y-8 animate-fade-in">

        {/* Hero */}
        <div className="text-center space-y-3">
          <p className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: '#7BC109' }}>
            RaiDAR Certified
          </p>
          {userName ? (
            <>
              <h2 className="text-4xl font-bold text-white leading-tight">Congratulations,</h2>
              <h2 className="text-4xl font-bold leading-tight" style={{ color: '#7BC109', fontFamily: 'Raleway, sans-serif' }}>
                {userName}.
              </h2>
            </>
          ) : (
            <h2 className="text-3xl font-bold text-white leading-tight">
              Congratulations, you have graduated.
            </h2>
          )}
          <p className="text-tx-secondary text-sm max-w-md mx-auto leading-relaxed pt-1">
            You&apos;ve officially completed the RaiDAR Seller Conversion Program.
            You are ready to work leads, build relationships, and convert sellers.
          </p>
        </div>

        {/* Certificate card — on-screen version */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-tx-muted mb-3 text-center">Your Certificate</p>
          <div
            className="relative rounded-2xl overflow-hidden mx-auto"
            style={{
              background: 'linear-gradient(160deg, #0f1829 0%, #0b1020 100%)',
              border: '1px solid rgba(123,193,9,0.18)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(123,193,9,0.08)',
            }}
          >
            {/* Subtle green glow top-right */}
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(123,193,9,0.07) 0%, transparent 65%)' }} />

            {/* Inner ornamental border */}
            <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(123,193,9,0.1)' }} />

            {/* Corner marks */}
            {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map((pos, i) => (
              <div key={i} className={`absolute w-4 h-4 ${pos}`} style={{
                borderColor: 'rgba(123,193,9,0.5)',
                borderStyle: 'solid',
                borderWidth: i === 0 ? '2px 0 0 2px' : i === 1 ? '2px 2px 0 0' : i === 2 ? '0 0 2px 2px' : '0 2px 2px 0',
              }} />
            ))}

            <div className="relative px-6 pt-4 pb-6">
              {/* Ribbon */}
              <div className="relative mb-[8px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/graduate-ribbon2.png" alt="Graduate 2026" className="block mx-auto" style={{ width: '55%', height: 'auto', filter: 'drop-shadow(0 6px 20px rgba(123,193,9,0.35))' }} />
              </div>

              {/* University */}
              <p className="text-center font-bold tracking-[0.3em] uppercase mt-[8px] mb-0.5" style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.28em' }}>
                University of Ylopo
              </p>
              <p className="text-center mb-3" style={{ fontSize: '9px', color: '#334155' }}>
                Faculty of Digital Prospecting &amp; Real Estate Growth
              </p>

              {/* Diploma title */}
              <p className="text-center font-bold uppercase tracking-widest mb-3" style={{ fontSize: '13px', color: '#7BC109', fontFamily: 'Raleway, sans-serif', letterSpacing: '0.18em' }}>
                Diploma of Graduation
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-3 mx-8">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(123,193,9,0.3))' }} />
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#7BC109' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(123,193,9,0.3))' }} />
              </div>

              <p className="text-center italic mb-1.5" style={{ fontSize: '11px', color: '#475569', fontFamily: 'Georgia, serif' }}>
                This certifies that
              </p>

              {/* Name — hero element */}
              <h3
                className="text-center font-bold leading-tight tracking-wide uppercase mb-1"
                style={{
                  fontSize: userName && userName.length > 18 ? '1.6rem' : '2rem',
                  color: '#7BC109',
                  fontFamily: 'Raleway, sans-serif',
                  textShadow: '0 0 40px rgba(123,193,9,0.25)',
                  lineHeight: 1.1,
                }}
              >
                {userName || 'Graduate'}
              </h3>

              <p className="text-center mb-3" style={{ fontSize: '11px', color: '#475569' }}>
                has successfully completed the full training program
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-3 mx-8">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(123,193,9,0.3))' }} />
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#7BC109' }} />
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(123,193,9,0.3))' }} />
              </div>

              {/* Course */}
              <p className="text-center font-bold mb-1" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '1rem', color: '#e2e8f0' }}>
                {content.courseName}: {content.courseSubtitle}
              </p>
              <p className="text-center uppercase tracking-widest mb-4" style={{ fontSize: '9px', color: '#7BC109', letterSpacing: '0.2em' }}>
                {content.modules.join('  ·  ')}
              </p>

              {/* Signatories */}
              <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid rgba(30,42,59,0.8)' }}>
                {[
                  { sig: 'Barry Jenkins', name: 'Barry Jenkins', title: 'Head Realtor In Residence', rotate: '-3deg', size: '19px' },
                  { sig: 'Howard Tager', name: 'Howard Tager', title: 'CEO & Co-Founder, Ylopo', rotate: '-1.5deg', size: '17px' },
                  { sig: 'Juefeng Ge', name: 'Juefeng Ge', title: 'President & Co-Founder', rotate: '-2.5deg', size: '18px' },
                ].map((s) => (
                  <div key={s.name} className="text-center">
                    <div className="h-8 flex items-end justify-center overflow-hidden" style={{ marginBottom: '4px' }}>
                      <span style={{ fontFamily: '"Dancing Script", cursive', fontSize: s.size, fontWeight: 700, color: '#94a3b8', transform: `rotate(${s.rotate})`, display: 'inline-block', lineHeight: 1 }}>
                        {s.sig}
                      </span>
                    </div>
                    <div className="h-px mx-1 mb-1.5" style={{ background: 'rgba(100,116,139,0.25)' }} />
                    <p style={{ color: '#cbd5e1', fontFamily: 'Raleway, sans-serif', fontSize: '9px', fontWeight: 700 }}>{s.name}</p>
                    <p style={{ color: '#475569', fontSize: '8px', marginTop: '1px' }}>{s.title}</p>
                  </div>
                ))}
              </div>

              <p className="text-center mt-3" style={{ fontSize: '10px', color: '#334155' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>{completionDate}</span>
                &nbsp;&bull;&nbsp;Official Date of Completion
              </p>
            </div>
          </div>
        </div>

        {/* Hidden social card rendered for html2canvas capture */}
        <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1080px', height: '1080px', zIndex: -1 }}>
          <div
            ref={socialCardRef}
            style={{
              width: '1080px', height: '1080px',
              background: '#0B0F1A',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              fontFamily: 'Raleway, sans-serif',
            }}
          >
            {/* Background grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(123,193,9,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(123,193,9,0.04) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
            {/* Glow */}
            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(123,193,9,0.12) 0%, transparent 65%)' }} />
            {/* Corner accents */}
            {[['top:56px;left:56px;border-top:3px solid rgba(123,193,9,0.6);border-left:3px solid rgba(123,193,9,0.6)', '0 0 0 0'],
              ['top:56px;right:56px;border-top:3px solid rgba(123,193,9,0.6);border-right:3px solid rgba(123,193,9,0.6)', '0 0 0 0'],
              ['bottom:56px;left:56px;border-bottom:3px solid rgba(123,193,9,0.6);border-left:3px solid rgba(123,193,9,0.6)', '0 0 0 0'],
              ['bottom:56px;right:56px;border-bottom:3px solid rgba(123,193,9,0.6);border-right:3px solid rgba(123,193,9,0.6)', '0 0 0 0'],
            ].map(([s], i) => (
              <div key={i} style={{ position: 'absolute', width: '80px', height: '80px', ...Object.fromEntries(s.split(';').filter(Boolean).map(r => r.split(':').map(x => x.trim())).map(([k, v]) => [k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v])) }} />
            ))}
            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 100px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '8px', textTransform: 'uppercase', color: 'rgba(123,193,9,0.8)', marginBottom: '32px' }}>✦  Ylopo University  ✦</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/graduate-ribbon2.png" alt="" style={{ width: '260px', marginBottom: '24px' }} />
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '18px', letterSpacing: '10px', color: 'rgba(123,193,9,0.9)', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>RaiDAR Certified</p>
              <h1 style={{ fontFamily: 'Raleway, sans-serif', fontSize: '84px', lineHeight: 1, color: '#fff', letterSpacing: '3px', marginBottom: '6px', fontWeight: 900, textShadow: '0 0 60px rgba(123,193,9,0.35)' }}>RaiDAR</h1>
              <p style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '40px' }}>Seller Conversion Program</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '500px', marginBottom: '36px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(123,193,9,0.5))' }} />
                <div style={{ width: '8px', height: '8px', background: '#7BC109', transform: 'rotate(45deg)', flexShrink: 0 }} />
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(123,193,9,0.5))' }} />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>Awarded to</p>
              <h2 style={{ fontFamily: 'Raleway, sans-serif', fontSize: '58px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>{userName || 'Graduate'}</h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', marginBottom: '6px' }}>Ready to identify, engage, and convert seller leads.</p>
              <p style={{ fontSize: '13px', color: 'rgba(123,193,9,0.6)', letterSpacing: '3px', textTransform: 'uppercase' }}>{completionDate}</p>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(to right, transparent, #7BC109, #7BC109, transparent)' }} />
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
          {/* Primary — download share card as PNG */}
          <button
            onClick={handleDownloadSocialCard}
            disabled={generatingImage}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7BC109, #508200)', boxShadow: '0 4px 24px rgba(123,193,9,0.4)' }}
          >
            {generatingImage ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Generating Image…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Download Share Image (PNG)
              </>
            )}
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
        style={{ background: 'linear-gradient(170deg, #0f1829 0%, #0D1320 100%)', border: '1.5px solid #7BC10922' }}
      >
        <div className="relative m-3 rounded-xl border p-6 text-center" style={{ borderColor: '#7BC10914' }}>
          {/* Ribbon badge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/graduate-ribbon2.png" alt="Graduate" style={{ width: '160px', height: 'auto', margin: '0 auto 8px', display: 'block' }} />
          <p className="text-xs font-bold tracking-[0.26em] uppercase mb-0.5" style={{ color: '#94a3b8' }}>University of Ylopo</p>
          <p className="text-xs mb-3" style={{ color: '#475569', fontSize: '10px' }}>Diploma of Graduation</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #7BC10944)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: '#7BC109' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #7BC10944)' }} />
          </div>
          <p className="text-xs italic mb-2" style={{ color: '#64748b', fontFamily: 'Georgia, serif' }}>This certifies that</p>
          <h3 className="font-bold mb-2 uppercase tracking-wide" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '1.6rem', color: '#7BC109' }}>
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
