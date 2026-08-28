// Deno stub — GET /request-status/:id
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  return Response.json(
    { message: "Implement status lookup against validation_requests." },
    { status: 501 },
  );
});
