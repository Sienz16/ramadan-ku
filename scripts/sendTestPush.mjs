import { Pool } from "pg";
import webpush from "web-push";
import { parsePushTestArgs } from "./pushTestArgs.mjs";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function readVapidPublicKey() {
  return process.env.PUSH_VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
}

async function loadSubscriptions(client, target) {
  if (target.type === "all") {
    const result = await client.query(
      `
      SELECT endpoint, p256dh, auth, zone
      FROM push_subscriptions
      WHERE enabled = TRUE
      ORDER BY zone ASC
    `
    );
    return result.rows;
  }

  if (target.type === "zone") {
    const result = await client.query(
      `
      SELECT endpoint, p256dh, auth, zone
      FROM push_subscriptions
      WHERE enabled = TRUE AND zone = $1
      ORDER BY endpoint ASC
    `,
      [target.zone]
    );
    return result.rows;
  }

  const result = await client.query(
    `
      SELECT endpoint, p256dh, auth, zone
      FROM push_subscriptions
      WHERE enabled = TRUE AND endpoint = $1
      LIMIT 1
    `,
    [target.endpoint]
  );
  return result.rows;
}

async function main() {
  const args = parsePushTestArgs(process.argv.slice(2));
  const databaseUrl = requiredEnv("DATABASE_URL");
  const vapidSubject = requiredEnv("PUSH_VAPID_SUBJECT");
  const vapidPrivate = requiredEnv("PUSH_VAPID_PRIVATE_KEY");
  const vapidPublic = readVapidPublicKey();

  if (!vapidPublic) {
    throw new Error("Missing required env: PUSH_VAPID_PUBLIC_KEY (or NEXT_PUBLIC_VAPID_PUBLIC_KEY)");
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  const payload = JSON.stringify({
    title: args.title,
    body: args.body,
    url: "/",
    type: "MANUAL_TEST",
  });

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const subscriptions = await loadSubscriptions(client, args.target);

    if (subscriptions.length === 0) {
      console.log("[push-test] no matching active subscriptions");
      return;
    }

    let sent = 0;
    let disabled = 0;

    for (const row of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoint,
            keys: {
              p256dh: row.p256dh,
              auth: row.auth,
            },
          },
          payload
        );
        sent += 1;
      } catch (error) {
        const statusCode = Number(error?.statusCode ?? 0);
        if (statusCode === 404 || statusCode === 410) {
          await client.query(
            `
            UPDATE push_subscriptions
            SET enabled = FALSE,
                updated_at = NOW()
            WHERE endpoint = $1
          `,
            [row.endpoint]
          );
          disabled += 1;
        }
      }
    }

    console.log(`[push-test] sent=${sent} disabled=${disabled} target=${args.target.type}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[push-test] failed", error);
  process.exit(1);
});
