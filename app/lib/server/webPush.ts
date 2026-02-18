import webpush from "web-push";
import type { PushPrayerName } from "../pushScheduler";

interface NotificationPayloadInput {
  prayerName: PushPrayerName;
  prayerLabel: string;
  prayerTime12h: string;
  zone: string;
}

export function buildPrayerPushPayload(input: NotificationPayloadInput): string {
  return JSON.stringify({
    title: "Waktu solat telah masuk",
    body: `${input.prayerLabel} (${input.prayerTime12h}) - Zon ${input.zone}`,
    url: "/",
    prayerName: input.prayerName,
    zone: input.zone,
  });
}

function loadVapidConfig() {
  const subject = process.env.PUSH_VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.PUSH_VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    throw new Error("Missing VAPID env vars");
  }

  return { subject, publicKey, privateKey };
}

let isConfigured = false;

export function configureWebPush(): void {
  if (isConfigured) {
    return;
  }

  const vapid = loadVapidConfig();
  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);
  isConfigured = true;
}

export async function sendWebPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string
): Promise<void> {
  configureWebPush();
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
    payload
  );
}
