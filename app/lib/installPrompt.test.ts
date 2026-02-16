import { describe, expect, test } from "bun:test";
import { getInstallAvailability } from "./installPrompt";

describe("getInstallAvailability", () => {
  test("uses browser prompt when available", () => {
    expect(
      getInstallAvailability({
        hasDeferredPrompt: true,
        isIos: false,
        isStandalone: false,
      })
    ).toBe("prompt");
  });

  test("uses iOS manual instruction when on iOS Safari", () => {
    expect(
      getInstallAvailability({
        hasDeferredPrompt: false,
        isIos: true,
        isStandalone: false,
      })
    ).toBe("ios-manual");
  });

  test("returns installed when app already standalone", () => {
    expect(
      getInstallAvailability({
        hasDeferredPrompt: false,
        isIos: false,
        isStandalone: true,
      })
    ).toBe("installed");
  });
});
