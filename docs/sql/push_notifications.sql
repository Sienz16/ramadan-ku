CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  zone VARCHAR(16) NOT NULL DEFAULT 'WLY01',
  city TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_zone_enabled
  ON push_subscriptions (zone, enabled);

CREATE TABLE IF NOT EXISTS push_delivery_log (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  delivery_key TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (endpoint, delivery_key)
);

CREATE INDEX IF NOT EXISTS idx_push_delivery_log_delivery_key
  ON push_delivery_log (delivery_key);
