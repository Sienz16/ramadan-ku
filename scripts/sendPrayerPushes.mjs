import { Pool } from "pg";
import webpush from "web-push";

const TZ = "Asia/Kuala_Lumpur";
const PRAYER_LABELS = {
  Fajr: "Subuh",
  Dhuhr: "Zohor",
  Asr: "Asar",
  Maghrib: "Maghrib",
  Isha: "Isyak",
};

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function getKualaLumpurDateParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type) => Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function formatDateKey(parts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function formatTimeKey(parts) {
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

function toHourMinute(value) {
  const [hour = "00", minute = "00"] = String(value).split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

function to12Hour(value) {
  const [hourStr, minuteStr] = value.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const converted = hour % 12 || 12;
  return `${converted}:${minuteStr} ${period}`;
}

function mapJakimTimings(prayerTimeItem) {
  return {
    Fajr: toHourMinute(prayerTimeItem.fajr),
    Sunrise: toHourMinute(prayerTimeItem.syuruk),
    Dhuhr: toHourMinute(prayerTimeItem.dhuhr),
    Asr: toHourMinute(prayerTimeItem.asr),
    Maghrib: toHourMinute(prayerTimeItem.maghrib),
    Isha: toHourMinute(prayerTimeItem.isha),
  };
}

function findDuePrayerName(times, currentTime) {
  for (const prayerName of ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]) {
    if (times[prayerName] === currentTime) {
      return prayerName;
    }
  }

  return null;
}

async function fetchZonePrayerTimes(zone) {
  const response = await fetch(
    `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${zone}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times for zone ${zone}`);
  }

  const data = await response.json();
  if (data?.status !== "OK!" || !data?.prayerTime?.[0]) {
    throw new Error(`Invalid prayer API response for zone ${zone}`);
  }

  return mapJakimTimings(data.prayerTime[0]);
}

async function processZone(client, zone, dateKey, timeKey) {
  const timings = await fetchZonePrayerTimes(zone);
  const duePrayer = findDuePrayerName(timings, timeKey);
  if (!duePrayer) {
    return { zone, sent: 0, skipped: 0, duePrayer: null };
  }

  const subscriptionsResult = await client.query(
    `
      SELECT endpoint, p256dh, auth, zone
      FROM push_subscriptions
      WHERE enabled = TRUE AND zone = $1
    `,
    [zone]
  );

  let sent = 0;
  let skipped = 0;
  const prayerLabel = PRAYER_LABELS[duePrayer] ?? duePrayer;
  const prayerTime12h = to12Hour(timings[duePrayer]);

  for (const row of subscriptionsResult.rows) {
    const deliveryKey = `${dateKey}|${zone}|${duePrayer}`;
    const inserted = await client.query(
      `
        INSERT INTO push_delivery_log (endpoint, delivery_key)
        VALUES ($1, $2)
        ON CONFLICT (endpoint, delivery_key)
        DO NOTHING
        RETURNING endpoint
      `,
      [row.endpoint, deliveryKey]
    );

    if ((inserted.rowCount ?? 0) === 0) {
      skipped += 1;
      continue;
    }

    const payload = JSON.stringify({
      title: "Waktu solat telah masuk",
      body: `${prayerLabel} (${prayerTime12h}) - Zon ${zone}`,
      url: "/",
      prayerName: duePrayer,
      zone,
    });

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
      }
    }
  }

  return {
    zone,
    duePrayer,
    sent,
    skipped,
  };
}

async function main() {
  const databaseUrl = requiredEnv("DATABASE_URL");
  const vapidSubject = requiredEnv("PUSH_VAPID_SUBJECT");
  const vapidPublic = requiredEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  const vapidPrivate = requiredEnv("PUSH_VAPID_PRIVATE_KEY");

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  const parts = getKualaLumpurDateParts();
  const dateKey = formatDateKey(parts);
  const timeKey = formatTimeKey(parts);
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const zonesResult = await client.query(
      `
        SELECT DISTINCT zone
        FROM push_subscriptions
        WHERE enabled = TRUE
        ORDER BY zone ASC
      `
    );

    for (const row of zonesResult.rows) {
      const zone = String(row.zone);
      const stats = await processZone(client, zone, dateKey, timeKey);
      if (stats.duePrayer) {
        console.log(
          `[push] ${dateKey} ${timeKey} zone=${zone} prayer=${stats.duePrayer} sent=${stats.sent} skipped=${stats.skipped}`
        );
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("[push] worker failed", error);
  process.exit(1);
});
