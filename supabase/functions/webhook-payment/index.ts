// Deno stub — POST /webhook/payment
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // TODO: verify PayPal / Payoneer / Razorpay signatures, then credit profiles.paid_credits
  return Response.json(
    { message: "Implement provider-specific webhook verification before granting credits." },
    { status: 501 },
  );
});
