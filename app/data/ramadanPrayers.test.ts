import { describe, expect, test } from "bun:test";
import { ramadanPrayers } from "./ramadanPrayers";

describe("ramadanPrayers", () => {
  test("contains the four requested Ramadan niat/doa entries", () => {
    expect(ramadanPrayers).toHaveLength(4);
    expect(ramadanPrayers.map((item) => item.title)).toEqual([
      "Niat Puasa Ramadan Sebulan",
      "Niat Puasa Harian",
      "Niat Solat Tarawih",
      "Doa Berbuka Puasa",
    ]);
  });
});
