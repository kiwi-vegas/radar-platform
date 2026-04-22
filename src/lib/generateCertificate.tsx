import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

const COURSE_NAME = 'Radar: Getting More Sellers'
const MODULES = ['Mindset', 'Scripts', 'Nurture & Ops']
const WIDTH = 900
const HEIGHT = 620

function loadImg(filename: string): string | null {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'images', filename))
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

export async function generateCertificatePng(
  userName: string,
  graduatedAt: string | null,
): Promise<Buffer> {
  const completionDate = new Date(graduatedAt ?? Date.now())
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const ribbon   = loadImg('graduate-ribbon2.png')
  const sigBarry = loadImg('barry-signature-wht.png')
  const sigHoward = loadImg('howard-signature-wht.png')
  const sigJuefeng = loadImg('juefueng-signature-wht.png')

  // Try loading Raleway 800 for nicer display — fall back to sans-serif silently
  let ralewayData: ArrayBuffer | null = null
  try {
    const res = await fetch(
      'https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrE.woff2',
      { signal: AbortSignal.timeout(4000) },
    )
    if (res.ok) ralewayData = await res.arrayBuffer()
  } catch { /* use system sans-serif */ }

  const nameSize = userName.length > 22 ? 36 : userName.length > 16 ? 44 : 52
  const fontFamily = ralewayData ? 'Raleway' : 'sans-serif'

  const sigs = [
    { name: 'Barry Jenkins',  title: 'Head Realtor In Residence',  img: sigBarry   },
    { name: 'Howard Tager',   title: 'CEO & Co-Founder, Ylopo',    img: sigHoward  },
    { name: 'Juefeng Ge',     title: 'President & Co-Founder',     img: sigJuefeng },
  ]

  const response = new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          background: '#0B1020',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '26px 52px 22px',
          position: 'relative',
          fontFamily,
        }}
      >
        {/* Outer border */}
        <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(123,193,9,0.35)', display: 'flex' }} />
        {/* Inner border */}
        <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(123,193,9,0.12)', display: 'flex' }} />

        {/* Corner marks */}
        <div style={{ position: 'absolute', top: 4, left: 4, width: 18, height: 18, borderTop: '2px solid rgba(123,193,9,0.5)', borderLeft: '2px solid rgba(123,193,9,0.5)', display: 'flex' }} />
        <div style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderTop: '2px solid rgba(123,193,9,0.5)', borderRight: '2px solid rgba(123,193,9,0.5)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 4, width: 18, height: 18, borderBottom: '2px solid rgba(123,193,9,0.5)', borderLeft: '2px solid rgba(123,193,9,0.5)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderBottom: '2px solid rgba(123,193,9,0.5)', borderRight: '2px solid rgba(123,193,9,0.5)', display: 'flex' }} />

        {/* Ribbon badge */}
        {ribbon && (
          <img src={ribbon} width={190} height={124} style={{ objectFit: 'contain', marginBottom: 4 }} />
        )}

        {/* University */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#64748b', display: 'flex', marginBottom: 2 }}>
          University of Ylopo
        </div>
        <div style={{ fontSize: 9, color: '#334155', display: 'flex', marginBottom: 12 }}>
          Faculty of Digital Prospecting {'&'} Real Estate Growth
        </div>

        {/* Diploma title */}
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7BC109', display: 'flex', marginBottom: 9 }}>
          Diploma of Graduation
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '62%', marginBottom: 7 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(123,193,9,0.25)' }} />
          <div style={{ width: 5, height: 5, background: '#7BC109', transform: 'rotate(45deg)', display: 'flex' }} />
          <div style={{ flex: 1, height: 1, background: 'rgba(123,193,9,0.25)' }} />
        </div>

        <div style={{ fontSize: 11, color: '#475569', fontStyle: 'italic', display: 'flex', marginBottom: 4 }}>
          This certifies that
        </div>

        {/* Name — hero element */}
        <div
          style={{
            fontSize: nameSize,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            color: '#7BC109',
            display: 'flex',
            lineHeight: 1.1,
            marginBottom: 5,
          }}
        >
          {userName}
        </div>

        <div style={{ fontSize: 11, color: '#475569', display: 'flex', marginBottom: 9 }}>
          has successfully completed the full training program
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '62%', marginBottom: 9 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(123,193,9,0.25)' }} />
          <div style={{ width: 5, height: 5, background: '#7BC109', transform: 'rotate(45deg)', display: 'flex' }} />
          <div style={{ flex: 1, height: 1, background: 'rgba(123,193,9,0.25)' }} />
        </div>

        {/* Course */}
        <div style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', display: 'flex', marginBottom: 3 }}>
          {COURSE_NAME}
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7BC109', display: 'flex', marginBottom: 10 }}>
          {MODULES.join('  ·  ')}
        </div>

        {/* Date */}
        <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 6, marginBottom: 14 }}>
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>{completionDate}</span>
          <span>·</span>
          <span>Official Date of Completion</span>
        </div>

        {/* Signature row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '88%',
            borderTop: '1px solid rgba(30,42,59,0.8)',
            paddingTop: 12,
            gap: 12,
          }}
        >
          {sigs.map((s) => (
            <div key={s.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {s.img
                ? <img src={s.img} width={100} height={42} style={{ objectFit: 'contain', marginBottom: 4, opacity: 0.85 }} />
                : <div style={{ width: 100, height: 42, marginBottom: 4, display: 'flex' }} />
              }
              <div style={{ width: '80%', height: 1, background: 'rgba(100,116,139,0.2)', marginBottom: 4 }} />
              <div style={{ fontSize: 9, fontWeight: 700, color: '#cbd5e1', display: 'flex' }}>{s.name}</div>
              <div style={{ fontSize: 8, color: '#475569', marginTop: 1, display: 'flex' }}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: ralewayData
        ? [{ name: 'Raleway', data: ralewayData, weight: 800, style: 'normal' as const }]
        : [],
    },
  )

  return Buffer.from(await response.arrayBuffer())
}
