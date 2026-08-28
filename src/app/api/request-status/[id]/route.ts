import { NextResponse } from "next/server";
import { getRequest } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const request = await getRequest(id);
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: request.id,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    completedAt: request.completedAt,
    errorMessage: request.errorMessage,
    productUrl: request.productUrl,
    productDescription: request.productDescription,
    verdict: request.report
      ? {
          label: request.report.verdict,
          confidence: request.report.confidence,
          confidenceScore: request.report.confidenceScore,
          bestFitMarket: request.report.bestFitMarket,
          summary: request.report.summary,
        }
      : null,
  });
}
