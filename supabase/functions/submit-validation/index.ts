// Deno Supabase Edge Function stub — POST /submit-validation
// Deploy with: supabase functions deploy submit-validation
// Mirror of Next.js /api/submit-validation for production hosting on Supabase.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // TODO: validate body, enforce free credits + rate limits via Postgres,
  // enqueue orchestration job (Exa + Trends + Meta Ads → Claude).
  return Response.json(
    {
      message:
        "Deployed stub. Use the Next.js /api/submit-validation route for local MVP, or implement Supabase orchestration here.",
    },
    { status: 501 },
  );
});
