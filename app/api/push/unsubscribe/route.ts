import { NextResponse } from "next/server";
import { getDbPool } from "@/app/lib/server/database";
import { deletePushSubscription } from "@/app/lib/server/pushStore";

export const runtime = "nodejs";

interface UnsubscribePayload {
  endpoint?: unknown;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as UnsubscribePayload;
    const endpoint = typeof payload.endpoint === "string" ? payload.endpoint.trim() : "";

    if (!endpoint) {
      return NextResponse.json({ ok: false, error: "endpoint is required" }, { status: 400 });
    }

    await deletePushSubscription(getDbPool(), endpoint);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
