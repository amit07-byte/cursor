import { createHash, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { UserCredits, ValidationRequest } from "./types";
import { FREE_VALIDATION_LIMIT } from "./types";

const DATA_DIR = process.env.NEXORA_DATA_DIR || path.join(process.cwd(), ".data");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const CREDITS_FILE = path.join(DATA_DIR, "credits.json");
const RATE_FILE = path.join(DATA_DIR, "rate-limits.json");

type RateBucket = Record<string, number[]>;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createRequestId(): string {
  return randomUUID();
}

export async function getRequest(id: string): Promise<ValidationRequest | null> {
  const all = await readJson<Record<string, ValidationRequest>>(REQUESTS_FILE, {});
  return all[id] ?? null;
}

export async function saveRequest(request: ValidationRequest): Promise<ValidationRequest> {
  const all = await readJson<Record<string, ValidationRequest>>(REQUESTS_FILE, {});
  all[request.id] = request;
  await writeJson(REQUESTS_FILE, all);
  return request;
}

export async function getCredits(email: string): Promise<UserCredits> {
  const key = normalizeEmail(email);
  const all = await readJson<Record<string, UserCredits>>(CREDITS_FILE, {});
  if (all[key]) return all[key];
  const now = new Date().toISOString();
  const created: UserCredits = {
    email: key,
    freeValidationsUsed: 0,
    paidCredits: 0,
    createdAt: now,
    updatedAt: now,
  };
  all[key] = created;
  await writeJson(CREDITS_FILE, all);
  return created;
}

export async function saveCredits(credits: UserCredits): Promise<UserCredits> {
  const all = await readJson<Record<string, UserCredits>>(CREDITS_FILE, {});
  all[normalizeEmail(credits.email)] = {
    ...credits,
    email: normalizeEmail(credits.email),
    updatedAt: new Date().toISOString(),
  };
  await writeJson(CREDITS_FILE, all);
  return all[normalizeEmail(credits.email)];
}

export function remainingFreeValidations(credits: UserCredits): number {
  return Math.max(0, FREE_VALIDATION_LIMIT - credits.freeValidationsUsed);
}

export function hasValidationCredit(credits: UserCredits): boolean {
  return remainingFreeValidations(credits) > 0 || credits.paidCredits > 0;
}

export async function consumeValidationCredit(email: string): Promise<{
  credits: UserCredits;
  usedFreeCredit: boolean;
}> {
  const credits = await getCredits(email);
  if (remainingFreeValidations(credits) > 0) {
    credits.freeValidationsUsed += 1;
    const saved = await saveCredits(credits);
    return { credits: saved, usedFreeCredit: true };
  }
  if (credits.paidCredits > 0) {
    credits.paidCredits -= 1;
    const saved = await saveCredits(credits);
    return { credits: saved, usedFreeCredit: false };
  }
  throw new Error("NO_CREDITS");
}

export async function refundValidationCredit(
  email: string,
  usedFreeCredit: boolean,
): Promise<void> {
  const credits = await getCredits(email);
  if (usedFreeCredit) {
    credits.freeValidationsUsed = Math.max(0, credits.freeValidationsUsed - 1);
  } else {
    credits.paidCredits += 1;
  }
  await saveCredits(credits);
}

export async function addPaidCredits(email: string, amount: number): Promise<UserCredits> {
  const credits = await getCredits(email);
  credits.paidCredits += amount;
  return saveCredits(credits);
}

export async function checkRateLimit(
  email: string,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const key = normalizeEmail(email);
  const now = Date.now();
  const buckets = await readJson<RateBucket>(RATE_FILE, {});
  const recent = (buckets[key] ?? []).filter((ts) => now - ts < windowMs);
  if (recent.length > 0) {
    const retryAfterMs = windowMs - (now - recent[0]);
    buckets[key] = recent;
    await writeJson(RATE_FILE, buckets);
    return { allowed: false, retryAfterMs };
  }
  recent.push(now);
  buckets[key] = recent;
  await writeJson(RATE_FILE, buckets);
  return { allowed: true, retryAfterMs: 0 };
}

export function hashSeed(input: string): number {
  const digest = createHash("sha256").update(input).digest();
  return digest.readUInt32BE(0);
}
