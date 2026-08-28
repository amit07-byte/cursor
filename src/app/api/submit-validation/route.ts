import { NextResponse } from "next/server";
import { runDemoResearch } from "@/lib/orchestration";
import {
  checkRateLimit,
  consumeValidationCredit,
  createRequestId,
  normalizeEmail,
  refundValidationCredit,
  remainingFreeValidations,
  saveRequest,
  getCredits,
} from "@/lib/store";
import { FREE_VALIDATION_LIMIT, RATE_LIMIT_WINDOW_MS } from "@/lib/types";
import type { ValidationRequest } from "@/lib/types";
import { submitValidationSchema } from "@/lib/validators";

export const runtime = "nodejs";

async function processRequest(request: ValidationRequest) {
  try {
    const report = await runDemoResearch({
      productUrl: request.productUrl,
      productDescription: request.productDescription,
    });
    await saveRequest({
      ...request,
      status: "complete",
      report,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      errorMessage: null,
    });
  } catch {
    await refundValidationCredit(request.email, request.usedFreeCredit);
    await saveRequest({
      ...request,
      status: "failed",
      errorMessage:
        "We couldn’t finish this research run. Your credit was restored — you can resubmit at no cost.",
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submitValidationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fields: parsed.error.flatten().fieldErrors,
        message: parsed.error.issues[0]?.message ?? "Invalid input",
      },
      { status: 400 },
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const productUrl = parsed.data.productUrl?.trim() || null;
  const productDescription = parsed.data.productDescription?.trim() || null;

  const rate = await checkRateLimit(email, RATE_LIMIT_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "RATE_LIMITED",
        message: "Please wait a few minutes before submitting another product.",
        retryAfterMs: rate.retryAfterMs,
      },
      { status: 429 },
    );
  }

  const credits = await getCredits(email);
  if (remainingFreeValidations(credits) <= 0 && credits.paidCredits <= 0) {
    return NextResponse.json(
      {
        error: "NO_CREDITS",
        message: `You've used your ${FREE_VALIDATION_LIMIT} free validations`,
        freeLimit: FREE_VALIDATION_LIMIT,
        upgradePath: "/pricing",
      },
      { status: 402 },
    );
  }

  let usedFreeCredit = true;
  try {
    const consumed = await consumeValidationCredit(email);
    usedFreeCredit = consumed.usedFreeCredit;
  } catch {
    return NextResponse.json(
      {
        error: "NO_CREDITS",
        message: `You've used your ${FREE_VALIDATION_LIMIT} free validations`,
        upgradePath: "/pricing",
      },
      { status: 402 },
    );
  }

  const now = new Date().toISOString();
  const request: ValidationRequest = {
    id: createRequestId(),
    email,
    productUrl,
    productDescription,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    errorMessage: null,
    report: null,
    usedFreeCredit,
    isDemo: true,
  };

  await saveRequest(request);

  // Fire-and-forget orchestration (demo path). In production this moves to a queue / Edge Function.
  void processRequest(request);

  const updatedCredits = await getCredits(email);

  return NextResponse.json(
    {
      id: request.id,
      status: request.status,
      creditsRemaining: {
        free: remainingFreeValidations(updatedCredits),
        paid: updatedCredits.paidCredits,
      },
    },
    { status: 201 },
  );
}
