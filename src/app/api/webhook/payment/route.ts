import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { addPaidCredits, normalizeEmail } from "@/lib/store";

export const runtime = "nodejs";

function verifyDemoSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET || "nexora-dev-webhook-secret";
  if (!signature) return false;
  const expected = createHash("sha256").update(`${secret}.${rawBody}`).digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Payment webhook stub (PayPal / Payoneer / Razorpay).
 * Verifies a shared signature header and credits the payer's email.
 * Real provider signature verification should replace verifyDemoSignature in production.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nexora-signature");

  if (!verifyDemoSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { email?: string; credits?: number; event?: string; paymentId?: string };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event !== "payment.succeeded" || !payload.email) {
    return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
  }

  const creditsToAdd = Math.max(1, Number(payload.credits ?? 10));
  const updated = await addPaidCredits(normalizeEmail(payload.email), creditsToAdd);

  return NextResponse.json({
    ok: true,
    email: updated.email,
    paidCredits: updated.paidCredits,
    paymentId: payload.paymentId ?? null,
  });
}
