import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { allCourses, getAllLessonIds, getCurrentLesson } from '@/data/courses'
import WaitlistButton from '@/components/dashboard/WaitlistButton'

async function getProgressForCourses(userId: string, courseSlugs: string[]) {
  const supabase = await createClient()

  const results: Record<string, string[]> = {}

  for (const slug of courseSlugs) {
    const { data } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_slug', slug)
      .eq('completed', true)

    results[slug] = (data ?? []).map((r) => r.lesson_id)
  }

  return results
}

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get display name
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'there'
  const firstName = displayName.split(' ')[0]

  // Load progress for all courses
  const progressMap = await getProgressForCourses(
    user.id,
    allCourses.map((c) => c.slug)
  )

  // Check waitlist status
  const { data: waitlistEntry } = await supabase
    .from('ppc_waitlist')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  const isOnWaitlist = !!waitlistEntry

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-sidebar">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="white"/>
                <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
                <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
              </svg>
            </div>
            <span className="font-bold text-tx-primary tracking-tight">RADAR</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-tx-secondary text-sm hidden sm:block">{displayName}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-tx-muted hover:text-tx-secondary text-sm transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-tx-primary mb-2">
            Welcome back, {firstName}.
          </h1>
          <p className="text-tx-secondary">
            Pick up where you left off.
          </p>
        </div>

        {/* Courses grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course) => {
            const completedIds = progressMap[course.slug] ?? []
            const totalLessons = getAllLessonIds(course).length
            const completedCount = completedIds.length
            const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
            const isGraduated = completedCount === totalLessons && totalLessons > 0
            const currentLesson = getCurrentLesson(course, completedIds)
            const continueUrl = currentLesson
              ? `/courses/${course.slug}/lessons/${currentLesson.lesson.id}`
              : `/courses/${course.slug}`

            return (
              <div
                key={course.id}
                className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-surface-hover transition-colors group"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden bg-surface">
                  {course.coverImage ? (
                    <Image
                      src={course.coverImage}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${course.coverColor}22, ${course.coverColor}08)` }}
                    >
                      <span className="text-4xl font-black tracking-tight opacity-30" style={{ color: course.coverColor }}>
                        {course.title}
                      </span>
                    </div>
                  )}
                  {/* Progress overlay bar at bottom of image */}
                  {pct > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                      <div
                        className="h-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: course.coverColor }}
                      />
                    </div>
                  )}
                  {/* Graduated badge overlay */}
                  {isGraduated && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-green-500 rounded-full px-2.5 py-1 shadow-lg">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Graduated
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-base font-bold text-tx-primary mb-0.5">{course.title}</h2>
                  <p className="text-tx-secondary text-xs mb-1 font-medium">{course.subtitle}</p>
                  <p className="text-tx-muted text-xs mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

                  {/* Progress count */}
                  <div className="flex items-center justify-between text-xs text-tx-muted mb-4">
                    <span>{completedCount} / {totalLessons} lessons complete</span>
                    <span className="font-semibold" style={{ color: course.coverColor }}>{pct}%</span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={continueUrl}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{
                      background: isGraduated
                        ? 'transparent'
                        : course.coverColor,
                      color: isGraduated ? course.coverColor : 'white',
                      border: isGraduated ? `1px solid ${course.coverColor}` : 'none',
                    }}
                  >
                    {completedCount === 0
                      ? 'Start Course'
                      : isGraduated
                      ? 'Review Course'
                      : 'Continue'}
                  </Link>
                </div>
              </div>
            )
          })}

          {/* PPC Plus — coming soon with waitlist */}
          <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden hover:border-surface-hover transition-colors">
            <div className="relative w-full aspect-video overflow-hidden bg-surface">
              <Image
                src="/images/coming-summer-2026.png"
                alt="PPC Plus — Coming Summer 2026"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-3"
                style={{ background: '#6366f115', color: '#6366f1', border: '1px solid #6366f130' }}>
                Coming Summer 2026
              </div>
              <h2 className="text-base font-bold text-tx-primary mb-0.5">PPC Plus</h2>
              <p className="text-tx-secondary text-xs mb-1 font-medium">Getting More Buyers</p>
              <p className="text-tx-muted text-xs mb-4 leading-relaxed">
                Master paid search and digital advertising to build a consistent buyer pipeline.
              </p>
              <WaitlistButton initialJoined={isOnWaitlist} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
