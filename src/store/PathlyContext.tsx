import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { ADMIN_EMAIL, DEMO_PASSWORD, STORAGE_KEY } from '../lib/constants'
import { createId } from '../lib/id'
import { loadDB, resetDB, saveDB } from '../lib/storage'
import type {
  AppNotification,
  BusinessProfile,
  Campaign,
  CampaignStatus,
  Connection,
  CreatorProfile,
  DeliverableType,
  FollowerRange,
  Message,
  Niche,
  PathlyDB,
  Platform,
  Role,
  User,
} from '../types'

type Listener = () => void

let memoryDB = loadDB()
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

function commit(next: PathlyDB) {
  memoryDB = next
  saveDB(next)
  emit()
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return memoryDB
}

function update(mutator: (draft: PathlyDB) => PathlyDB) {
  commit(mutator(structuredClone(memoryDB)))
}

function pushNotification(
  db: PathlyDB,
  partial: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'emailSimulated'>,
) {
  db.notifications.unshift({
    id: createId('notif'),
    createdAt: new Date().toISOString(),
    read: false,
    emailSimulated: true,
    ...partial,
  })
}

export interface AuthResult {
  ok: boolean
  error?: string
}

export interface PathlyAPI {
  db: PathlyDB
  currentUser: User | null
  businessProfile: BusinessProfile | null
  creatorProfile: CreatorProfile | null
  signUp: (input: {
    email: string
    password: string
    name: string
    acceptedTerms: boolean
  }) => AuthResult
  signIn: (email: string, password: string) => AuthResult
  signInWithGoogleDemo: () => AuthResult
  signOut: () => void
  setRole: (role: Exclude<Role, 'admin'>) => AuthResult
  saveBusinessProfile: (profile: Omit<BusinessProfile, 'userId'>) => AuthResult
  saveCreatorProfile: (profile: Omit<CreatorProfile, 'userId'>) => AuthResult
  createCampaign: (input: {
    goal: string
    niche: Niche
    preferredPlatform: Platform
    deliverableType: DeliverableType
    budget: number
    deadline: string
    description: string
  }) => { ok: true; campaign: Campaign } | AuthResult
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => AuthResult
  joinCampaign: (campaignId: string) => { ok: true; connection: Connection } | AuthResult
  sendMessage: (connectionId: string, text: string) => AuthResult
  markMessagesRead: (connectionId: string) => void
  markNotificationsRead: () => void
  blockUser: (userId: string) => AuthResult
  reportUser: (input: {
    reportedUserId: string
    connectionId: string
    reason: string
  }) => AuthResult
  adminRemoveUser: (userId: string) => AuthResult
  adminCloseCampaign: (campaignId: string) => AuthResult
  resetDemoData: () => void
  getBusinessName: (userId: string) => string
  getCreatorLabel: (userId: string) => string
  isBlockedBetween: (a: string, b: string) => boolean
  unreadNotificationCount: number
  demoPassword: string
  adminEmail: string
}

const PathlyContext = createContext<PathlyAPI | null>(null)

export function PathlyProvider({ children }: { children: ReactNode }) {
  const db = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [, setTick] = useState(0)

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          memoryDB = JSON.parse(e.newValue) as PathlyDB
          emit()
          setTick((t) => t + 1)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const currentUser = useMemo(
    () => db.users.find((u) => u.id === db.sessionUserId && !u.isRemoved) ?? null,
    [db],
  )

  const businessProfile = useMemo(
    () =>
      currentUser?.role === 'business'
        ? db.businessProfiles.find((p) => p.userId === currentUser.id) ?? null
        : null,
    [db, currentUser],
  )

  const creatorProfile = useMemo(
    () =>
      currentUser?.role === 'creator'
        ? db.creatorProfiles.find((p) => p.userId === currentUser.id) ?? null
        : null,
    [db, currentUser],
  )

  const unreadNotificationCount = useMemo(() => {
    if (!currentUser) return 0
    return db.notifications.filter((n) => n.userId === currentUser.id && !n.read).length
  }, [db, currentUser])

  const api = useMemo<PathlyAPI>(() => {
    function getBusinessName(userId: string) {
      return db.businessProfiles.find((p) => p.userId === userId)?.businessName ?? 'Business'
    }

    function getCreatorLabel(userId: string) {
      const user = db.users.find((u) => u.id === userId)
      const profile = db.creatorProfiles.find((p) => p.userId === userId)
      return profile?.handle || user?.name || 'Creator'
    }

    function isBlockedBetween(a: string, b: string) {
      const userA = db.users.find((u) => u.id === a)
      const userB = db.users.find((u) => u.id === b)
      return Boolean(
        userA?.blockedUserIds.includes(b) || userB?.blockedUserIds.includes(a),
      )
    }

    return {
      db,
      currentUser,
      businessProfile,
      creatorProfile,
      unreadNotificationCount,
      demoPassword: DEMO_PASSWORD,
      adminEmail: ADMIN_EMAIL,

      signUp({ email, password, name, acceptedTerms }) {
        const normalized = email.trim().toLowerCase()
        if (!normalized || !password || !name.trim()) {
          return { ok: false, error: 'Name, email, and password are required.' }
        }
        if (!acceptedTerms) {
          return { ok: false, error: 'Please accept the Terms to continue.' }
        }
        if (db.users.some((u) => u.email === normalized && !u.isRemoved)) {
          return { ok: false, error: 'An account with that email already exists.' }
        }
        const now = new Date().toISOString()
        const user: User = {
          id: createId('user'),
          email: normalized,
          password,
          role: null,
          name: name.trim(),
          acceptedTermsAt: now,
          createdAt: now,
          blockedUserIds: [],
        }
        update((draft) => {
          draft.users.push(user)
          draft.sessionUserId = user.id
          pushNotification(draft, {
            userId: user.id,
            kind: 'welcome',
            title: 'Welcome to Pathly',
            body: 'Choose your role next — Business or Creator — to finish setup.',
            href: '/onboarding',
          })
          return draft
        })
        return { ok: true }
      },

      signIn(email, password) {
        const normalized = email.trim().toLowerCase()
        const user = db.users.find(
          (u) => u.email === normalized && u.password === password && !u.isRemoved,
        )
        if (!user) return { ok: false, error: 'Invalid email or password.' }
        update((draft) => {
          draft.sessionUserId = user.id
          return draft
        })
        return { ok: true }
      },

      signInWithGoogleDemo() {
        const email = `google.${Date.now().toString(36)}@pathly.demo`
        const now = new Date().toISOString()
        const user: User = {
          id: createId('user'),
          email,
          password: createId('oauth'),
          role: null,
          name: 'Google User',
          acceptedTermsAt: now,
          createdAt: now,
          blockedUserIds: [],
        }
        update((draft) => {
          draft.users.push(user)
          draft.sessionUserId = user.id
          pushNotification(draft, {
            userId: user.id,
            kind: 'welcome',
            title: 'Signed in with Google (demo)',
            body: 'This is a demo Google sign-in. Choose Business or Creator to continue.',
            href: '/onboarding',
          })
          return draft
        })
        return { ok: true }
      },

      signOut() {
        update((draft) => {
          draft.sessionUserId = null
          return draft
        })
      },

      setRole(role) {
        if (!currentUser) return { ok: false, error: 'Not signed in.' }
        if (currentUser.role === 'admin') return { ok: false, error: 'Admin role is fixed.' }
        update((draft) => {
          const user = draft.users.find((u) => u.id === currentUser.id)
          if (user) user.role = role
          return draft
        })
        return { ok: true }
      },

      saveBusinessProfile(profile) {
        if (!currentUser || currentUser.role !== 'business') {
          return { ok: false, error: 'Business account required.' }
        }
        if (!profile.businessName.trim()) {
          return { ok: false, error: 'Business name is required.' }
        }
        update((draft) => {
          const existing = draft.businessProfiles.find((p) => p.userId === currentUser.id)
          if (existing) {
            existing.businessName = profile.businessName.trim()
            existing.industry = profile.industry
            existing.logoUrl = profile.logoUrl
          } else {
            draft.businessProfiles.push({
              userId: currentUser.id,
              businessName: profile.businessName.trim(),
              industry: profile.industry,
              logoUrl: profile.logoUrl,
            })
          }
          return draft
        })
        return { ok: true }
      },

      saveCreatorProfile(profile) {
        if (!currentUser || currentUser.role !== 'creator') {
          return { ok: false, error: 'Creator account required.' }
        }
        if (!profile.handle.trim()) {
          return { ok: false, error: 'Handle is required.' }
        }
        update((draft) => {
          const next: CreatorProfile = {
            userId: currentUser.id,
            handle: profile.handle.trim(),
            niche: profile.niche,
            platform: profile.platform,
            followerRange: profile.followerRange,
            portfolioLink: profile.portfolioLink.trim(),
            startingRate: Number(profile.startingRate) || 0,
          }
          const idx = draft.creatorProfiles.findIndex((p) => p.userId === currentUser.id)
          if (idx >= 0) draft.creatorProfiles[idx] = next
          else draft.creatorProfiles.push(next)
          return draft
        })
        return { ok: true }
      },

      createCampaign(input) {
        if (!currentUser || currentUser.role !== 'business' || !businessProfile) {
          return { ok: false, error: 'Complete your business profile first.' }
        }
        if (!input.goal.trim() || !input.description.trim()) {
          return { ok: false, error: 'Goal and description are required.' }
        }
        const campaign: Campaign = {
          id: createId('camp'),
          businessId: currentUser.id,
          goal: input.goal.trim(),
          niche: input.niche,
          preferredPlatform: input.preferredPlatform,
          deliverableType: input.deliverableType,
          budget: Number(input.budget) || 0,
          deadline: input.deadline,
          description: input.description.trim(),
          status: 'active',
          createdAt: new Date().toISOString(),
        }
        update((draft) => {
          draft.campaigns.unshift(campaign)
          return draft
        })
        return { ok: true, campaign }
      },

      updateCampaignStatus(campaignId, status) {
        if (!currentUser) return { ok: false, error: 'Not signed in.' }
        update((draft) => {
          const campaign = draft.campaigns.find((c) => c.id === campaignId)
          if (!campaign) return draft
          if (currentUser.role !== 'admin' && campaign.businessId !== currentUser.id) {
            return draft
          }
          campaign.status = status
          return draft
        })
        return { ok: true }
      },

      joinCampaign(campaignId) {
        if (!currentUser || currentUser.role !== 'creator' || !creatorProfile) {
          return { ok: false, error: 'Complete your creator profile first.' }
        }
        const campaign = db.campaigns.find((c) => c.id === campaignId && c.status === 'active')
        if (!campaign) return { ok: false, error: 'Campaign not found or closed.' }
        if (isBlockedBetween(currentUser.id, campaign.businessId)) {
          return { ok: false, error: 'You cannot join this campaign.' }
        }
        const existing = db.connections.find(
          (c) => c.campaignId === campaignId && c.creatorId === currentUser.id,
        )
        if (existing) return { ok: true, connection: existing }

        const connection: Connection = {
          id: createId('conn'),
          campaignId,
          creatorId: currentUser.id,
          createdAt: new Date().toISOString(),
        }
        update((draft) => {
          draft.connections.unshift(connection)
          pushNotification(draft, {
            userId: campaign.businessId,
            kind: 'creator_joined',
            title: 'A creator joined your campaign',
            body: `${getCreatorLabel(currentUser.id)} joined “${campaign.goal}”. Open chat to continue.`,
            href: `/app/chat/${connection.id}`,
          })
          return draft
        })
        return { ok: true, connection }
      },

      sendMessage(connectionId, text) {
        if (!currentUser) return { ok: false, error: 'Not signed in.' }
        const trimmed = text.trim()
        if (!trimmed) return { ok: false, error: 'Message cannot be empty.' }
        const connection = db.connections.find((c) => c.id === connectionId)
        if (!connection) return { ok: false, error: 'Conversation not found.' }
        const campaign = db.campaigns.find((c) => c.id === connection.campaignId)
        if (!campaign) return { ok: false, error: 'Campaign missing.' }

        const isParticipant =
          currentUser.id === connection.creatorId || currentUser.id === campaign.businessId
        if (!isParticipant) return { ok: false, error: 'Not part of this conversation.' }
        if (isBlockedBetween(connection.creatorId, campaign.businessId)) {
          return { ok: false, error: 'Messaging is blocked for this conversation.' }
        }

        const recipientId =
          currentUser.id === connection.creatorId ? campaign.businessId : connection.creatorId

        const message: Message = {
          id: createId('msg'),
          connectionId,
          senderId: currentUser.id,
          text: trimmed,
          timestamp: new Date().toISOString(),
          readBy: [currentUser.id],
        }

        update((draft) => {
          draft.messages.push(message)
          pushNotification(draft, {
            userId: recipientId,
            kind: 'new_message',
            title: 'New chat message',
            body: trimmed.slice(0, 120),
            href: `/app/chat/${connectionId}`,
          })
          return draft
        })
        return { ok: true }
      },

      markMessagesRead(connectionId) {
        if (!currentUser) return
        const hasUnread = db.messages.some(
          (msg) =>
            msg.connectionId === connectionId && !msg.readBy.includes(currentUser.id),
        )
        if (!hasUnread) return
        update((draft) => {
          for (const msg of draft.messages) {
            if (msg.connectionId === connectionId && !msg.readBy.includes(currentUser.id)) {
              msg.readBy.push(currentUser.id)
            }
          }
          return draft
        })
      },

      markNotificationsRead() {
        if (!currentUser) return
        const hasUnread = db.notifications.some(
          (n) => n.userId === currentUser.id && !n.read,
        )
        if (!hasUnread) return
        update((draft) => {
          for (const n of draft.notifications) {
            if (n.userId === currentUser.id) n.read = true
          }
          return draft
        })
      },

      blockUser(userId) {
        if (!currentUser) return { ok: false, error: 'Not signed in.' }
        update((draft) => {
          const user = draft.users.find((u) => u.id === currentUser.id)
          if (user && !user.blockedUserIds.includes(userId)) {
            user.blockedUserIds.push(userId)
          }
          return draft
        })
        return { ok: true }
      },

      reportUser({ reportedUserId, connectionId, reason }) {
        if (!currentUser) return { ok: false, error: 'Not signed in.' }
        if (!reason.trim()) return { ok: false, error: 'Please share a short reason.' }
        update((draft) => {
          draft.reports.unshift({
            id: createId('report'),
            reporterId: currentUser.id,
            reportedUserId,
            connectionId,
            reason: reason.trim(),
            createdAt: new Date().toISOString(),
          })
          const admin = draft.users.find((u) => u.role === 'admin')
          if (admin) {
            pushNotification(draft, {
              userId: admin.id,
              kind: 'new_message',
              title: 'New user report',
              body: reason.trim().slice(0, 120),
              href: '/app/admin',
            })
          }
          return draft
        })
        return { ok: true }
      },

      adminRemoveUser(userId) {
        if (!currentUser || currentUser.role !== 'admin') {
          return { ok: false, error: 'Admin only.' }
        }
        update((draft) => {
          const user = draft.users.find((u) => u.id === userId)
          if (user && user.role !== 'admin') {
            user.isRemoved = true
            if (draft.sessionUserId === userId) draft.sessionUserId = null
          }
          for (const campaign of draft.campaigns) {
            if (campaign.businessId === userId) campaign.status = 'closed'
          }
          return draft
        })
        return { ok: true }
      },

      adminCloseCampaign(campaignId) {
        if (!currentUser || currentUser.role !== 'admin') {
          return { ok: false, error: 'Admin only.' }
        }
        update((draft) => {
          const campaign = draft.campaigns.find((c) => c.id === campaignId)
          if (campaign) campaign.status = 'closed'
          return draft
        })
        return { ok: true }
      },

      resetDemoData() {
        commit(resetDB())
      },

      getBusinessName,
      getCreatorLabel,
      isBlockedBetween,
    }
  }, [
    db,
    currentUser,
    businessProfile,
    creatorProfile,
    unreadNotificationCount,
  ])

  return <PathlyContext.Provider value={api}>{children}</PathlyContext.Provider>
}

export function usePathly() {
  const ctx = useContext(PathlyContext)
  if (!ctx) throw new Error('usePathly must be used within PathlyProvider')
  return ctx
}

export type { Platform, Niche, DeliverableType, FollowerRange }
