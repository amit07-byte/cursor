export type SkillLevel =
  | 'Complete Beginner'
  | 'Some Basics'
  | 'Intermediate'
  | 'Advanced (filling gaps)'

export type TimePerWeek = '2-3 hours' | '3-5 hours' | '5-10 hours' | '10+ hours'

export type Timeline =
  | '1 week'
  | '2 weeks'
  | '1 month'
  | '2-3 months'
  | 'No rush'

export type VideoLength =
  | 'Short (5-15 min)'
  | 'Medium (15-45 min)'
  | 'Long (45+ min)'
  | 'Any length'

export type TeachingStyle =
  | 'Straight to the point (no fluff)'
  | 'Detailed explanations'
  | 'Project-based (build along)'
  | 'Theory-focused'
  | 'Visual/animated'
  | 'Code-along / hands-on'

export type CreatorPreference =
  | 'Professional instructors'
  | 'Self-taught creators'
  | 'University lectures'
  | 'Any credible source'

export type ExcludeFilter =
  | 'Videos over X years old'
  | 'Clickbait titles'
  | 'Low production quality'
  | 'Non-English'

export type IncludeFilter =
  | 'Practice exercises/assignments'
  | 'Project tutorials'
  | 'Quizzes/assessments'
  | 'Downloadable resources'

export interface LearningPathForm {
  topic: string
  skillLevel: SkillLevel | ''
  learningGoal: string
  videoLengths: VideoLength[]
  teachingStyles: TeachingStyle[]
  creatorPreferences: CreatorPreference[]
  timePerWeek: TimePerWeek | ''
  timeline: Timeline | ''
  excludeFilters: ExcludeFilter[]
  includeFilters: IncludeFilter[]
  maxVideoAgeYears: number
  preferredLanguage: string
}

export interface PathVideo {
  id: string
  title: string
  channel: string
  duration: string
  week: number
  reason: string
  type: 'core' | 'practice' | 'project' | 'deep-dive'
}

export interface GeneratedPath {
  title: string
  summary: string
  weeks: number
  hoursPerWeek: string
  videos: PathVideo[]
}
