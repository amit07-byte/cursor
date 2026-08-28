import { hashSeed } from "./store";
import type {
  ConfidenceLevel,
  SourceAvailability,
  ValidationReport,
  VerdictLabel,
} from "./types";

const MARKETS = [
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
  "India",
  "Brazil",
  "United Arab Emirates",
];

function pick<T>(seed: number, items: T[]): T {
  const idx = Math.abs(seed | 0) % items.length;
  return items[idx];
}

function confidenceFromSources(
  sources: SourceAvailability[],
  base: number,
): { level: ConfidenceLevel; score: number } {
  const unavailable = sources.filter((s) => !s.available).length;
  const score = Math.max(42, Math.min(94, base - unavailable * 12));
  const level: ConfidenceLevel = score >= 78 ? "high" : score >= 60 ? "medium" : "low";
  return { level, score };
}

function productLabel(url: string | null, description: string | null): string {
  if (description?.trim()) return description.trim().slice(0, 80);
  if (url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return `product from ${host}`;
    } catch {
      return "submitted product";
    }
  }
  return "submitted product";
}

/**
 * Demo orchestration used when Claude/Exa/Trends/Meta keys are not configured.
 * Produces deterministic, PRD-shaped reports so the full UX can be tested end-to-end.
 */
export async function runDemoResearch(input: {
  productUrl: string | null;
  productDescription: string | null;
}): Promise<ValidationReport> {
  const label = productLabel(input.productUrl, input.productDescription);
  const seed = hashSeed(`${input.productUrl ?? ""}|${input.productDescription ?? ""}`);

  // Simulate parallel source latency (short for demo UX)
  await new Promise((resolve) => setTimeout(resolve, 1800 + (seed % 1200)));

  const sources: SourceAvailability[] = [
    { name: "exa", available: true },
    { name: "trends", available: seed % 7 !== 0, note: seed % 7 === 0 ? "Google Trends timed out" : undefined },
    { name: "meta_ads", available: seed % 5 !== 0, note: seed % 5 === 0 ? "Meta Ad Library unavailable" : undefined },
    { name: "claude", available: true },
  ];

  const verdicts: VerdictLabel[] = ["Opportunity", "Wait", "Crowded"];
  const verdict = pick(seed, verdicts);
  const { level, score } = confidenceFromSources(sources, 70 + (seed % 25));
  const market = pick(seed >>> 3, MARKETS);

  const roadmapByVerdict: Record<
    VerdictLabel,
    { headline: string; nextStep: string; details: string[] }
  > = {
    Opportunity: {
      headline: "Move while the window is open",
      nextStep: `Test a small ad budget in ${market} within the next 7 days.`,
      details: [
        "Validate your landing page offer with a 3–5 creative A/B set.",
        "Source 2 suppliers and compare landed cost vs. target margin.",
        "Re-run this validation after first 50–100 clicks to confirm signal strength.",
      ],
    },
    Wait: {
      headline: "Hold spend — watch the signal",
      nextStep: "Re-check this product in 10–14 days before committing ad budget.",
      details: [
        "Save 2–3 alternate angles or bundles that could strengthen demand.",
        "Monitor search interest weekly; act only if the trend turns clearly up.",
        "Use remaining free credits to validate a stronger alternate product now.",
      ],
    },
    Crowded: {
      headline: "Protect your budget — pivot the offer",
      nextStep: "Do not launch this exact offer; validate a differentiated variant instead.",
      details: [
        "Look for a niche angle (bundle, audience, or use-case) competitors are missing.",
        "Compare 2 adjacent products before spending on ads.",
        "If you still like the category, wait for advertiser fatigue and re-test later.",
      ],
    },
  };

  const summaryByVerdict: Record<VerdictLabel, string> = {
    Opportunity: `Signals around “${label}” look favorable: discussion sentiment is constructive, competitive ad pressure is manageable, and demand interest supports a careful launch in ${market}.`,
    Wait: `“${label}” shows early or mixed signals. There is interest, but confidence is not high enough to justify aggressive spend yet — best fit to watch is ${market}.`,
    Crowded: `“${label}” appears saturated or fatigued in active channels. Ad density and community chatter suggest tough unit economics unless you differentiate sharply. ${market} still shows the strongest relative interest.`,
  };

  return {
    verdict,
    confidence: level,
    confidenceScore: score,
    bestFitMarket: market,
    summary: summaryByVerdict[verdict],
    reddit: {
      summary:
        verdict === "Crowded"
          ? "Buyers mention fatigue, clone listings, and price wars more often than excitement."
          : verdict === "Wait"
            ? "Conversations show curiosity but limited purchase intent so far."
            : "Community threads show recurring pain points this product appears to solve.",
      sentiment: verdict === "Crowded" ? "negative" : verdict === "Wait" ? "mixed" : "positive",
      mentionCount: 12 + (seed % 40),
      sampleQuotes:
        verdict === "Opportunity"
          ? [
              "Looking for something like this that actually works…",
              "Would buy if shipping to the US wasn’t painful.",
            ]
          : verdict === "Wait"
            ? [
                "Interesting idea but not sure I’d pay for it yet.",
                "Seen a few versions — still waiting for a clear winner.",
              ]
            : [
                "Market is flooded with these already.",
                "Every store is running the same creative.",
              ],
    },
    ads: {
      summary: sources.find((s) => s.name === "meta_ads")?.available
        ? verdict === "Crowded"
          ? "Many active advertisers with overlapping creatives."
          : verdict === "Wait"
            ? "A few recent entrants; activity is not explosive yet."
            : "Relatively few durable advertisers for the category size."
        : "Ad Library data was unavailable for this run — confidence reduced.",
      advertiserCount: sources.find((s) => s.name === "meta_ads")?.available
        ? verdict === "Crowded"
          ? 40 + (seed % 60)
          : verdict === "Wait"
            ? 8 + (seed % 12)
            : 3 + (seed % 8)
        : null,
      activityLevel: sources.find((s) => s.name === "meta_ads")?.available
        ? verdict === "Crowded"
          ? "high"
          : verdict === "Wait"
            ? "moderate"
            : "low"
        : "unknown",
      entrantVelocity: sources.find((s) => s.name === "meta_ads")?.available
        ? verdict === "Crowded"
          ? "fast"
          : "steady"
        : "unknown",
    },
    trends: {
      summary: sources.find((s) => s.name === "trends")?.available
        ? verdict === "Opportunity"
          ? "Search interest is rising over the last 90 days."
          : verdict === "Wait"
            ? "Search interest is early/flat with occasional spikes."
            : "Search interest is flat-to-down versus the prior period."
        : "Trend data was unavailable — regional ranking uses fallback heuristics.",
      direction: sources.find((s) => s.name === "trends")?.available
        ? verdict === "Opportunity"
          ? "rising"
          : verdict === "Wait"
            ? "stable"
            : "declining"
        : "unknown",
      regionalInterest: [
        { country: market, score: 78 + (seed % 18) },
        { country: pick(seed >>> 5, MARKETS.filter((m) => m !== market)), score: 55 + (seed % 20) },
        { country: pick(seed >>> 7, MARKETS), score: 35 + (seed % 25) },
      ],
    },
    web: {
      summary:
        "General web mentions include review blogs, Quora threads, and marketplace listings that corroborate the community signal.",
      mentionCount: 20 + (seed % 55),
      themes:
        verdict === "Opportunity"
          ? ["problem-solution fit", "gift potential", "shipping concerns"]
          : verdict === "Wait"
            ? ["early hype", "unclear differentiation", "price sensitivity"]
            : ["saturation", "clone products", "ad fatigue"],
    },
    roadmap: roadmapByVerdict[verdict],
    sources,
    generatedAt: new Date().toISOString(),
  };
}

export function hasLiveAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY && process.env.EXA_API_KEY);
}
