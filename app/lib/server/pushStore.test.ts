import { describe, expect, test } from "bun:test";
import { normalizePushSubscriptionInput } from "./pushStore";

describe("normalizePushSubscriptionInput", () => {
  test("normalizes valid subscription payload", () => {
    const normalized = normalizePushSubscriptionInput({
      zone: "WLY01",
      city: "Kuala Lumpur",
      subscription: {
        endpoint: "https://example.push/abc",
        keys: {
          p256dh: "pub-key",
          auth: "auth-key",
        },
      },
    });

    expect(normalized.zone).toBe("WLY01");
    expect(normalized.city).toBe("Kuala Lumpur");
    expect(normalized.endpoint).toBe("https://example.push/abc");
    expect(normalized.p256dh).toBe("pub-key");
    expect(normalized.auth).toBe("auth-key");
  });

  test("uses default zone when missing", () => {
    const normalized = normalizePushSubscriptionInput({
      subscription: {
        endpoint: "https://example.push/abc",
        keys: {
          p256dh: "pub-key",
          auth: "auth-key",
        },
      },
    });

    expect(normalized.zone).toBe("WLY01");
  });

  test("throws on invalid payload", () => {
    expect(() => normalizePushSubscriptionInput({ subscription: { endpoint: "" } })).toThrow();
  });
});
