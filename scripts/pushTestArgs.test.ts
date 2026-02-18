import { describe, expect, test } from "bun:test";
import { parsePushTestArgs } from "./pushTestArgs.mjs";

describe("parsePushTestArgs", () => {
  test("parses all target", () => {
    const parsed = parsePushTestArgs(["--all"]);

    expect(parsed.target).toEqual({ type: "all" });
  });

  test("parses zone target", () => {
    const parsed = parsePushTestArgs(["--zone=WLY01"]);

    expect(parsed.target).toEqual({ type: "zone", zone: "WLY01" });
  });

  test("parses endpoint target", () => {
    const parsed = parsePushTestArgs(["--endpoint=https://example.push/abc"]);

    expect(parsed.target).toEqual({ type: "endpoint", endpoint: "https://example.push/abc" });
  });

  test("parses custom title/body", () => {
    const parsed = parsePushTestArgs(["--all", "--title=Hi", "--body=Test body"]);

    expect(parsed.title).toBe("Hi");
    expect(parsed.body).toBe("Test body");
  });

  test("throws when no target is provided", () => {
    expect(() => parsePushTestArgs([])).toThrow("Provide one target");
  });
});
