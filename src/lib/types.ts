export type RequestStatus = "pending" | "complete" | "failed";

export type VerdictLabel = "Opportunity" | "Wait" | "Crowded";

export type ConfidenceLevel = "high" | "medium" | "low";

export type SourceName = "exa" | "trends" | "meta_ads" | "claude";

export interface SourceAvailability {
  name: SourceName;
  available: boolean;
  note?: string;
}

export interface RedditSignal {
  summary: string;
  sentiment: "positive" | "mixed" | "negative" | "unclear";
  mentionCount: number;
  sampleQuotes: string[];
}

export interface AdActivitySignal {
  summary: string;
  advertiserCount: number | null;
  activityLevel: "low" | "moderate" | "high" | "unknown";
  entrantVelocity: "slow" | "steady" | "fast" | "unknown";
}

export interface TrendSignal {
  summary: string;
  direction: "rising" | "stable" | "declining" | "unknown";
  regionalInterest: { country: string; score: number }[];
}

export interface WebMentionsSignal {
  summary: string;
  mentionCount: number;
  themes: string[];
}

export interface RoadmapSection {
  headline: string;
  nextStep: string;
  details: string[];
}

export interface ValidationReport {
  verdict: VerdictLabel;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  bestFitMarket: string;
  summary: string;
  reddit: RedditSignal;
  ads: AdActivitySignal;
  trends: TrendSignal;
  web: WebMentionsSignal;
  roadmap: RoadmapSection;
  sources: SourceAvailability[];
  generatedAt: string;
}

export interface ValidationRequest {
  id: string;
  email: string;
  productUrl: string | null;
  productDescription: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  report: ValidationReport | null;
  usedFreeCredit: boolean;
  isDemo: boolean;
}

export interface UserCredits {
  email: string;
  freeValidationsUsed: number;
  paidCredits: number;
  createdAt: string;
  updatedAt: string;
}

export const FREE_VALIDATION_LIMIT = 3;
export const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000;
