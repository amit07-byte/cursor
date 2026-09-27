import type { DeliverableType, FollowerRange, Niche, Platform } from '../types'

export const NICHES: Niche[] = [
  'Food & drink',
  'Fashion',
  'Beauty',
  'Fitness',
  'Lifestyle',
  'Tech',
  'Local / events',
  'Travel',
  'Other',
]

export const PLATFORMS: Platform[] = ['Instagram', 'TikTok', 'YouTube', 'X', 'Other']

export const DELIVERABLE_TYPES: DeliverableType[] = [
  'Reel / short video',
  'Story set',
  'Static post',
  'Long-form video',
  'Event coverage',
  'Other',
]

export const FOLLOWER_RANGES: FollowerRange[] = [
  'Under 1k',
  '1k–5k',
  '5k–15k',
  '15k–50k',
  '50k–100k',
  '100k+',
]

export const STORAGE_KEY = 'pathly.mvp.v1'
export const DB_VERSION = 1

export const DEMO_PASSWORD = 'pathly123'

export const ADMIN_EMAIL = 'admin@pathly.app'
