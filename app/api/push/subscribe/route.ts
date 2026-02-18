import { NextResponse } from "next/server";
import { getDbPool } from "@/app/lib/server/database";
import { normalizePushSubscriptionInput, upsertPushSubscription } from "@/app/lib/server/pushStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = normalizePushSubscriptionInput(await request.json());
    await upsertPushSubscription(getDbPool(), payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    const status = message.includes("Invalid push subscription payload") ? 400 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
