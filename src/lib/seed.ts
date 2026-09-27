import { ADMIN_EMAIL, DEMO_PASSWORD, DB_VERSION } from './constants'
import { createId } from './id'
import type {
  BusinessProfile,
  Campaign,
  CreatorProfile,
  PathlyDB,
  User,
} from '../types'

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const creatorSeeds: Array<{
  name: string
  email: string
  profile: Omit<CreatorProfile, 'userId'>
}> = [
  {
    name: 'Jordan Lee',
    email: 'jordan@pathly.demo',
    profile: {
      handle: '@jordan.eats',
      niche: 'Food & drink',
      platform: 'Instagram',
      followerRange: '5k–15k',
      portfolioLink: 'https://instagram.com/jordan.eats',
      startingRate: 150,
    },
  },
  {
    name: 'Ava Chen',
    email: 'ava@pathly.demo',
    profile: {
      handle: '@ava.fits',
      niche: 'Fashion',
      platform: 'TikTok',
      followerRange: '15k–50k',
      portfolioLink: 'https://tiktok.com/@ava.fits',
      startingRate: 250,
    },
  },
  {
    name: 'Marcus Cole',
    email: 'marcus@pathly.demo',
    profile: {
      handle: '@marcusmoves',
      niche: 'Fitness',
      platform: 'YouTube',
      followerRange: '15k–50k',
      portfolioLink: 'https://youtube.com/@marcusmoves',
      startingRate: 400,
    },
  },
  {
    name: 'Priya Shah',
    email: 'priya@pathly.demo',
    profile: {
      handle: '@priyaglow',
      niche: 'Beauty',
      platform: 'Instagram',
      followerRange: '5k–15k',
      portfolioLink: 'https://instagram.com/priyaglow',
      startingRate: 180,
    },
  },
  {
    name: 'Diego Ruiz',
    email: 'diego@pathly.demo',
    profile: {
      handle: '@diegolocal',
      niche: 'Local / events',
      platform: 'Instagram',
      followerRange: '1k–5k',
      portfolioLink: 'https://instagram.com/diegolocal',
      startingRate: 100,
    },
  },
  {
    name: 'Sam Okonkwo',
    email: 'sam@pathly.demo',
    profile: {
      handle: '@samtechbits',
      niche: 'Tech',
      platform: 'X',
      followerRange: '5k–15k',
      portfolioLink: 'https://x.com/samtechbits',
      startingRate: 200,
    },
  },
  {
    name: 'Nora Blake',
    email: 'nora@pathly.demo',
    profile: {
      handle: '@noratravels',
      niche: 'Travel',
      platform: 'YouTube',
      followerRange: '50k–100k',
      portfolioLink: 'https://youtube.com/@noratravels',
      startingRate: 800,
    },
  },
  {
    name: 'Eli Park',
    email: 'eli@pathly.demo',
    profile: {
      handle: '@elidays',
      niche: 'Lifestyle',
      platform: 'TikTok',
      followerRange: '15k–50k',
      portfolioLink: 'https://tiktok.com/@elidays',
      startingRate: 220,
    },
  },
  {
    name: 'Riley Quinn',
    email: 'riley@pathly.demo',
    profile: {
      handle: '@rileyruns',
      niche: 'Fitness',
      platform: 'Instagram',
      followerRange: '1k–5k',
      portfolioLink: 'https://instagram.com/rileyruns',
      startingRate: 90,
    },
  },
  {
    name: 'Mina Torres',
    email: 'mina@pathly.demo',
    profile: {
      handle: '@minaeats',
      niche: 'Food & drink',
      platform: 'TikTok',
      followerRange: '15k–50k',
      portfolioLink: 'https://tiktok.com/@minaeats',
      startingRate: 275,
    },
  },
  {
    name: 'Chris Vogel',
    email: 'chris@pathly.demo',
    profile: {
      handle: '@chrisstyle',
      niche: 'Fashion',
      platform: 'Instagram',
      followerRange: '5k–15k',
      portfolioLink: 'https://instagram.com/chrisstyle',
      startingRate: 160,
    },
  },
  {
    name: 'Harper Lin',
    email: 'harper@pathly.demo',
    profile: {
      handle: '@harperbeauty',
      niche: 'Beauty',
      platform: 'YouTube',
      followerRange: '15k–50k',
      portfolioLink: 'https://youtube.com/@harperbeauty',
      startingRate: 350,
    },
  },
  {
    name: 'Jonah West',
    email: 'jonah@pathly.demo',
    profile: {
      handle: '@jonahcity',
      niche: 'Local / events',
      platform: 'TikTok',
      followerRange: '5k–15k',
      portfolioLink: 'https://tiktok.com/@jonahcity',
      startingRate: 140,
    },
  },
  {
    name: 'Tess Nguyen',
    email: 'tess@pathly.demo',
    profile: {
      handle: '@tesslife',
      niche: 'Lifestyle',
      platform: 'Instagram',
      followerRange: 'Under 1k',
      portfolioLink: 'https://instagram.com/tesslife',
      startingRate: 75,
    },
  },
  {
    name: 'Omar Hassan',
    email: 'omar@pathly.demo',
    profile: {
      handle: '@omarframes',
      niche: 'Travel',
      platform: 'Instagram',
      followerRange: '15k–50k',
      portfolioLink: 'https://instagram.com/omarframes',
      startingRate: 300,
    },
  },
]

const businessSeeds: Array<{
  name: string
  email: string
  profile: Omit<BusinessProfile, 'userId'>
  campaigns: Array<Omit<Campaign, 'id' | 'businessId' | 'createdAt'>>
}> = [
  {
    name: 'Maya Chen',
    email: 'maya@harbor.demo',
    profile: {
      businessName: 'Harbor Roasters',
      industry: 'Food & drink',
    },
    campaigns: [
      {
        goal: 'Drive weekend foot traffic for new cold brew launch',
        niche: 'Food & drink',
        preferredPlatform: 'Instagram',
        deliverableType: 'Reel / short video',
        budget: 150,
        deadline: daysFromNow(14),
        description:
          'Looking for a 30–45s reel showing morning rush vibe, tasting the new cold brew, and a clear CTA to visit this Saturday.',
        status: 'active',
      },
    ],
  },
  {
    name: 'Leo Martins',
    email: 'leo@northfit.demo',
    profile: {
      businessName: 'Northside Fitness',
      industry: 'Fitness',
    },
    campaigns: [
      {
        goal: 'Promote free trial week for new members',
        niche: 'Fitness',
        preferredPlatform: 'Instagram',
        deliverableType: 'Story set',
        budget: 120,
        deadline: daysFromNow(10),
        description:
          'Need 4–6 Instagram stories covering a workout class + free trial signup. On-site shoot preferred.',
        status: 'active',
      },
    ],
  },
]

export function createSeedDB(): PathlyDB {
  const now = new Date().toISOString()
  const users: User[] = []
  const creatorProfiles: CreatorProfile[] = []
  const businessProfiles: BusinessProfile[] = []
  const campaigns: Campaign[] = []

  users.push({
    id: createId('user'),
    email: ADMIN_EMAIL,
    password: DEMO_PASSWORD,
    role: 'admin',
    name: 'Pathly Admin',
    acceptedTermsAt: now,
    createdAt: now,
    blockedUserIds: [],
    isSeeded: true,
  })

  for (const seed of creatorSeeds) {
    const id = createId('user')
    users.push({
      id,
      email: seed.email,
      password: DEMO_PASSWORD,
      role: 'creator',
      name: seed.name,
      acceptedTermsAt: now,
      createdAt: now,
      blockedUserIds: [],
      isSeeded: true,
    })
    creatorProfiles.push({ userId: id, ...seed.profile })
  }

  for (const seed of businessSeeds) {
    const id = createId('user')
    users.push({
      id,
      email: seed.email,
      password: DEMO_PASSWORD,
      role: 'business',
      name: seed.name,
      acceptedTermsAt: now,
      createdAt: now,
      blockedUserIds: [],
      isSeeded: true,
    })
    businessProfiles.push({ userId: id, ...seed.profile })
    for (const campaign of seed.campaigns) {
      campaigns.push({
        id: createId('camp'),
        businessId: id,
        createdAt: now,
        ...campaign,
      })
    }
  }

  return {
    version: DB_VERSION,
    users,
    businessProfiles,
    creatorProfiles,
    campaigns,
    connections: [],
    messages: [],
    reports: [],
    notifications: [],
    sessionUserId: null,
  }
}
