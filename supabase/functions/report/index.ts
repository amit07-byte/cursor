// Deno stub — GET /report/:id
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  return Response.json(
    { message: "Implement report fetch against validation_reports.report_json." },
    { status: 501 },
  );
});
