const DEFAULT_ZONE = "WLY01";

function toUint8Array(base64Value: string): Uint8Array {
  const base64 = base64Value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob(base64 + padding);
  const bytes = new Uint8Array(raw.length);

  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }

  return bytes;
}

function canUsePushApis(): boolean {
  return typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window
    && "Notification" in window;
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  if (!canUsePushApis()) {
    throw new Error("Push is not supported on this device/browser");
  }

  const registration = await navigator.serviceWorker.ready;
  return registration;
}

export async function subscribeDeviceToPush(input: { zone?: string; city?: string }): Promise<void> {
  const registration = await getRegistration();
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  }

  const existing = await registration.pushManager.getSubscription();
  const subscription = existing
    ?? await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: toUint8Array(vapidPublicKey) as BufferSource,
    });

  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      zone: input.zone ?? DEFAULT_ZONE,
      city: input.city,
      subscription,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save push subscription");
  }
}

export async function unsubscribeDeviceFromPush(): Promise<void> {
  const registration = await getRegistration();
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return;
  }

  await fetch("/api/push/unsubscribe", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });

  await subscription.unsubscribe();
}

export async function sendTestPushToCurrentDevice(): Promise<void> {
  const registration = await getRegistration();
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    throw new Error("No active push subscription found");
  }

  const response = await fetch("/api/push/test", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });

  if (!response.ok) {
    throw new Error("Failed to send test push");
  }
}

export function isPushSupported(): boolean {
  return canUsePushApis();
}
