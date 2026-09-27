export type Role = 'business' | 'creator' | 'admin'

export type CampaignStatus = 'active' | 'closed'

export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'X' | 'Other'

export type DeliverableType =
  | 'Reel / short video'
  | 'Story set'
  | 'Static post'
  | 'Long-form video'
  | 'Event coverage'
  | 'Other'

export type FollowerRange =
  | 'Under 1k'
  | '1k–5k'
  | '5k–15k'
  | '15k–50k'
  | '50k–100k'
  | '100k+'

export type Niche =
  | 'Food & drink'
  | 'Fashion'
  | 'Beauty'
  | 'Fitness'
  | 'Lifestyle'
  | 'Tech'
  | 'Local / events'
  | 'Travel'
  | 'Other'

export interface User {
  id: string
  email: string
  password: string
  role: Role | null
  name: string
  acceptedTermsAt: string
  createdAt: string
  blockedUserIds: string[]
  isSeeded?: boolean
  isRemoved?: boolean
}

export interface BusinessProfile {
  userId: string
  businessName: string
  industry: Niche
  logoUrl?: string
}

export interface CreatorProfile {
  userId: string
  handle: string
  niche: Niche
  platform: Platform
  followerRange: FollowerRange
  portfolioLink: string
  startingRate: number
}

export interface Campaign {
  id: string
  businessId: string
  goal: string
  niche: Niche
  preferredPlatform: Platform
  deliverableType: DeliverableType
  budget: number
  deadline: string
  description: string
  status: CampaignStatus
  createdAt: string
}

export interface Connection {
  id: string
  campaignId: string
  creatorId: string
  createdAt: string
}

export interface Message {
  id: string
  connectionId: string
  senderId: string
  text: string
  timestamp: string
  readBy: string[]
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId: string
  connectionId: string
  reason: string
  createdAt: string
}

export type NotificationKind =
  | 'creator_joined'
  | 'new_message'
  | 'welcome'

export interface AppNotification {
  id: string
  userId: string
  kind: NotificationKind
  title: string
  body: string
  href?: string
  createdAt: string
  read: boolean
  emailSimulated: boolean
}

export interface PathlyDB {
  version: number
  users: User[]
  businessProfiles: BusinessProfile[]
  creatorProfiles: CreatorProfile[]
  campaigns: Campaign[]
  connections: Connection[]
  messages: Message[]
  reports: Report[]
  notifications: AppNotification[]
  sessionUserId: string | null
}
