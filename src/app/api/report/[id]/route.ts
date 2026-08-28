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

  if (request.status === "pending") {
    return NextResponse.json(
      { error: "Report not ready", status: "pending" },
      { status: 202 },
    );
  }

  if (request.status === "failed") {
    return NextResponse.json(
      {
        error: "Research failed",
        status: "failed",
        message: request.errorMessage,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    id: request.id,
    status: request.status,
    email: request.email,
    productUrl: request.productUrl,
    productDescription: request.productDescription,
    completedAt: request.completedAt,
    report: request.report,
  });
}
