import type { DatabaseQueryable } from "./database";

const DEFAULT_ZONE = "WLY01";

export interface StoredPushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  zone: string;
  city: string | null;
}

interface PushSubscriptionKeysInput {
  p256dh?: unknown;
  auth?: unknown;
}

interface PushSubscriptionInput {
  endpoint?: unknown;
  keys?: PushSubscriptionKeysInput;
}

interface SubscribePayloadInput {
  zone?: unknown;
  city?: unknown;
  subscription?: PushSubscriptionInput;
}

export function normalizePushSubscriptionInput(input: unknown): StoredPushSubscription {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid push subscription payload");
  }

  const payload = input as SubscribePayloadInput;
  const subscription = payload.subscription;
  const endpoint = typeof subscription?.endpoint === "string" ? subscription.endpoint.trim() : "";
  const p256dh = typeof subscription?.keys?.p256dh === "string" ? subscription.keys.p256dh.trim() : "";
  const auth = typeof subscription?.keys?.auth === "string" ? subscription.keys.auth.trim() : "";

  if (!endpoint || !p256dh || !auth) {
    throw new Error("Invalid push subscription payload");
  }

  const rawZone = typeof payload.zone === "string" ? payload.zone.trim().toUpperCase() : "";
  const zone = rawZone || DEFAULT_ZONE;
  const city = typeof payload.city === "string" && payload.city.trim().length > 0
    ? payload.city.trim()
    : null;

  return {
    endpoint,
    p256dh,
    auth,
    zone,
    city,
  };
}

export async function upsertPushSubscription(db: DatabaseQueryable, subscription: StoredPushSubscription): Promise<void> {
  await db.query(
    `
    INSERT INTO push_subscriptions (endpoint, p256dh, auth, zone, city, enabled)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    ON CONFLICT (endpoint)
    DO UPDATE
      SET p256dh = EXCLUDED.p256dh,
          auth = EXCLUDED.auth,
          zone = EXCLUDED.zone,
          city = EXCLUDED.city,
          enabled = TRUE,
          updated_at = NOW(),
          last_seen_at = NOW()
  `,
    [subscription.endpoint, subscription.p256dh, subscription.auth, subscription.zone, subscription.city]
  );
}

export async function disablePushSubscription(db: DatabaseQueryable, endpoint: string): Promise<void> {
  await db.query(
    `
    UPDATE push_subscriptions
    SET enabled = FALSE,
        updated_at = NOW()
    WHERE endpoint = $1
  `,
    [endpoint]
  );
}

export async function deletePushSubscription(db: DatabaseQueryable, endpoint: string): Promise<void> {
  await db.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
}

export async function listActivePushSubscriptionsByZone(
  db: DatabaseQueryable,
  zone: string
): Promise<StoredPushSubscription[]> {
  const result = await db.query(
    `
    SELECT endpoint, p256dh, auth, zone, city
    FROM push_subscriptions
    WHERE enabled = TRUE AND zone = $1
  `,
    [zone]
  );

  return result.rows as StoredPushSubscription[];
}

export async function getActivePushSubscriptionByEndpoint(
  db: DatabaseQueryable,
  endpoint: string
): Promise<StoredPushSubscription | null> {
  const result = await db.query(
    `
    SELECT endpoint, p256dh, auth, zone, city
    FROM push_subscriptions
    WHERE enabled = TRUE AND endpoint = $1
    LIMIT 1
  `,
    [endpoint]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as StoredPushSubscription;
}

export async function listActiveZones(db: DatabaseQueryable): Promise<string[]> {
  const result = await db.query(
    `
    SELECT DISTINCT zone
    FROM push_subscriptions
    WHERE enabled = TRUE
    ORDER BY zone ASC
  `
  );

  return result.rows.map((row: { zone: string }) => String(row.zone));
}

export async function markDeliveryIfNew(
  db: DatabaseQueryable,
  endpoint: string,
  deliveryKey: string
): Promise<boolean> {
  const result = await db.query(
    `
    INSERT INTO push_delivery_log (endpoint, delivery_key)
    VALUES ($1, $2)
    ON CONFLICT (endpoint, delivery_key)
    DO NOTHING
    RETURNING endpoint
  `,
    [endpoint, deliveryKey]
  );

  return (result.rowCount ?? 0) > 0;
}
