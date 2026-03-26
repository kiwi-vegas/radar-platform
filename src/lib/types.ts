// ============================================================
// COURSE CONTENT TYPES (static data)
// ============================================================

export type LessonType = 'video' | 'flashcard' | 'reflection' | 'quiz' | 'roleplay'

export interface FlashCard {
  id: string
  question: string
  answer: string
  questionImage?: string  // path relative to /public, e.g. '/images/flashcards/1a.png'
  answerImage?: string    // path relative to /public, e.g. '/images/flashcards/1b.png'
}

export interface ReflectionQuestion {
  id: string
  question: string
  type: 'scale' | 'text'
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface VideoContent {
  vimeoId?: string
  youtubeId?: string
  description: string
  keyPoints?: string[]
}

export interface FlashCardContent {
  intro?: string
  cards: FlashCard[]
}

export interface ReflectionContent {
  intro?: string
  questions: ReflectionQuestion[]
  outro?: string
}

export interface QuizContent {
  intro?: string
  questions: QuizQuestion[]
  passingScore: number // percentage 0–100
}

export interface RoleplayContent {
  intro: string
  script: string
  phoneNumber: string
  callInstructions: string
  minimumScore: number
  remediation?: string
}

export type LessonContent =
  | VideoContent
  | FlashCardContent
  | ReflectionContent
  | QuizContent
  | RoleplayContent

export interface Lesson {
  id: string
  title: string
  type: LessonType
  durationMinutes: number
  image?: string   // path relative to /public, e.g. '/images/mindset.png'
  content: LessonContent
}

export interface Section {
  id: string
  title: string
  description?: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  coverColor: string // hex color for the course card gradient
  coverImage?: string // path relative to /public, e.g. '/images/main-radar-thumb.png'
  sections: Section[]
}

// ============================================================
// PROGRESS TYPES (from Supabase DB)
// ============================================================

export interface LessonProgressRecord {
  lesson_id: string
  course_slug: string
  completed: boolean
  score?: number | null
  completed_at?: string | null
}

export interface CourseProgressSummary {
  courseSlug: string
  completedLessonIds: string[]
  totalLessons: number
  graduatedAt?: string | null
}

// ============================================================
// COMPUTED HELPERS
// ============================================================

export interface LessonWithStatus extends Lesson {
  sectionId: string
  sectionTitle: string
  isCompleted: boolean
  isLocked: boolean
  isCurrent: boolean
}

export interface SectionWithStatus extends Section {
  isCompleted: boolean
  isLocked: boolean
  completedCount: number
}
