import type {
  GeneratedPath,
  LearningPathForm,
  PathVideo,
  Timeline,
} from '../types/learningPath'

const TIMELINE_WEEKS: Record<Timeline, number> = {
  '1 week': 1,
  '2 weeks': 2,
  '1 month': 4,
  '2-3 months': 10,
  'No rush': 8,
}

function weeksFromTimeline(timeline: Timeline | ''): number {
  if (!timeline) return 4
  return TIMELINE_WEEKS[timeline]
}

function pickDuration(form: LearningPathForm): string {
  if (form.videoLengths.includes('Any length') || form.videoLengths.length === 0) {
    return '22:14'
  }
  if (form.videoLengths.includes('Short (5-15 min)')) return '11:32'
  if (form.videoLengths.includes('Medium (15-45 min)')) return '28:47'
  return '1:12:05'
}

function channelFor(form: LearningPathForm, index: number): string {
  const prefs = form.creatorPreferences
  if (prefs.includes('University lectures')) {
    return ['MIT OpenCourseWare', 'Stanford Online', 'HarvardX'][index % 3]
  }
  if (prefs.includes('Professional instructors')) {
    return ['Pro Skill Lab', 'Academy Daily', 'Masterclass Channel'][index % 3]
  }
  if (prefs.includes('Self-taught creators')) {
    return ['Build With Sam', 'Learn By Doing', 'Garage Studio'][index % 3]
  }
  return ['Trusted Tutorials', 'Clear Path Media', 'Skill Signal'][index % 3]
}

function videoType(
  form: LearningPathForm,
  index: number,
): PathVideo['type'] {
  if (form.includeFilters.includes('Project tutorials') && index % 4 === 3) {
    return 'project'
  }
  if (
    form.includeFilters.includes('Practice exercises/assignments') &&
    index % 3 === 2
  ) {
    return 'practice'
  }
  if (form.videoLengths.includes('Long (45+ min)') && index % 5 === 4) {
    return 'deep-dive'
  }
  return 'core'
}

export function generateLearningPath(form: LearningPathForm): GeneratedPath {
  const topic = form.topic.trim() || 'your topic'
  const weeks = weeksFromTimeline(form.timeline)
  const level = form.skillLevel || 'Complete Beginner'
  const duration = pickDuration(form)
  const styles = form.teachingStyles
  const styleHint =
    styles[0]?.replace(/ \(.*\)/, '') || 'clear, practical teaching'

  const templates = [
    {
      title: `${topic} Foundations — Start Here`,
      reason: `Matches your ${level.toLowerCase()} level and sets vocabulary you’ll reuse all path.`,
    },
    {
      title: `Core Concepts in ${topic}`,
      reason: `Uses a ${styleHint.toLowerCase()} approach aligned with your preferences.`,
    },
    {
      title: `${topic} Walkthrough: First Real Application`,
      reason: form.learningGoal
        ? `Points toward your goal: “${form.learningGoal.slice(0, 72)}${form.learningGoal.length > 72 ? '…' : ''}”`
        : 'Builds transferable skill through a concrete example.',
    },
    {
      title: `Common Mistakes When Learning ${topic}`,
      reason: 'Filters fluff and clickbait-style rabbit holes so you stay on track.',
    },
    {
      title: `${topic} Practice Session`,
      reason: form.includeFilters.includes('Practice exercises/assignments')
        ? 'Includes exercises you can pause and complete.'
        : 'Reinforces earlier lessons with guided reps.',
    },
    {
      title: `Project: Apply ${topic}`,
      reason: form.includeFilters.includes('Project tutorials')
        ? 'Project-based build-along matched to your creator preferences.'
        : 'Turns theory into something you can show.',
    },
    {
      title: `${topic} Deep Dive`,
      reason: 'Longer cut for nuance once basics are stable.',
    },
    {
      title: `Next-Level ${topic} Techniques`,
      reason: 'Fills intermediate gaps without restarting from zero.',
    },
  ]

  const videosNeeded = Math.min(Math.max(weeks * 2, 4), templates.length)
  const videos: PathVideo[] = templates.slice(0, videosNeeded).map((t, i) => ({
    id: `v-${i + 1}`,
    title: t.title,
    channel: channelFor(form, i),
    duration,
    week: Math.min(weeks, Math.floor(i / 2) + 1),
    reason: t.reason,
    type: videoType(form, i),
  }))

  const excludeNotes: string[] = []
  if (form.excludeFilters.includes('Videos over X years old')) {
    excludeNotes.push(`prefer content newer than ${form.maxVideoAgeYears} years`)
  }
  if (form.excludeFilters.includes('Clickbait titles')) {
    excludeNotes.push('skip clickbait titles')
  }
  if (form.excludeFilters.includes('Low production quality')) {
    excludeNotes.push('favor clearer production')
  }
  if (form.excludeFilters.includes('Non-English')) {
    excludeNotes.push(
      form.preferredLanguage
        ? `prefer ${form.preferredLanguage}`
        : 'English-first',
    )
  }

  const filterLine =
    excludeNotes.length > 0
      ? ` Filtered to ${excludeNotes.join(', ')}.`
      : ''

  return {
    title: `Your ${topic} path`,
    summary: `A ${weeks}-week route for a ${level.toLowerCase()}, paced at ${form.timePerWeek || 'a flexible'} weekly commitment.${filterLine}`,
    weeks,
    hoursPerWeek: form.timePerWeek || 'Flexible',
    videos,
  }
}

export const GOAL_EXAMPLES = [
  'Build a personal website',
  'Have basic conversations in Spanish',
  'Produce electronic music',
] as const

export const VIDEO_LENGTH_OPTIONS = [
  { value: 'Short (5-15 min)', hint: 'quick concepts' },
  { value: 'Medium (15-45 min)', hint: 'standard tutorials' },
  { value: 'Long (45+ min)', hint: 'deep dives' },
  { value: 'Any length', hint: 'no preference' },
] as const

export const TEACHING_STYLE_OPTIONS = [
  'Straight to the point (no fluff)',
  'Detailed explanations',
  'Project-based (build along)',
  'Theory-focused',
  'Visual/animated',
  'Code-along / hands-on',
] as const

export const CREATOR_OPTIONS = [
  'Professional instructors',
  'Self-taught creators',
  'University lectures',
  'Any credible source',
] as const

export const EXCLUDE_OPTIONS = [
  'Videos over X years old',
  'Clickbait titles',
  'Low production quality',
  'Non-English',
] as const

export const INCLUDE_OPTIONS = [
  'Practice exercises/assignments',
  'Project tutorials',
  'Quizzes/assessments',
  'Downloadable resources',
] as const
