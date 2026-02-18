import { NextResponse } from "next/server";
import { getDbPool } from "@/app/lib/server/database";
import { getActivePushSubscriptionByEndpoint } from "@/app/lib/server/pushStore";
import { sendWebPushNotification } from "@/app/lib/server/webPush";

export const runtime = "nodejs";

interface TestPushPayload {
  endpoint?: unknown;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TestPushPayload;
    const endpoint = typeof payload.endpoint === "string" ? payload.endpoint.trim() : "";

    if (!endpoint) {
      return NextResponse.json({ ok: false, error: "endpoint is required" }, { status: 400 });
    }

    const subscription = await getActivePushSubscriptionByEndpoint(getDbPool(), endpoint);
    if (!subscription) {
      return NextResponse.json({ ok: false, error: "subscription not found" }, { status: 404 });
    }

    await sendWebPushNotification(
      {
        endpoint: subscription.endpoint,
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
      JSON.stringify({
        title: "RamadanKu test notification",
        body: "Notifikasi latar belakang berjaya diaktifkan.",
        url: "/",
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
