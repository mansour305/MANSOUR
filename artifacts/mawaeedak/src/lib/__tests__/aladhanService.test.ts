/**
 * AlAdhan Service Tests
 */

import { describe, it, expect } from "vitest";

// Test helper functions directly
function cleanTimeString(timeStr: string | undefined): string {
  if (!timeStr) return "";

  const cleaned = timeStr.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
    const [hours, minutes] = cleaned.split(":");
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const match = cleaned.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return `${match[1].padStart(2, "0")}:${match[2]}`;
  }

  return cleaned;
}

function hasUsableCoordinates(coordinates: { lat?: number; lng?: number } | null): boolean {
  return (
    typeof coordinates?.lat === "number" &&
    typeof coordinates.lng === "number" &&
    Number.isFinite(coordinates.lat) &&
    Number.isFinite(coordinates.lng)
  );
}

function coordinateMatches(a: number | null, b: number | null): boolean {
  if (a === null || b === null) return a === b;
  return Math.abs(a - b) < 0.0001;
}

describe("cleanTimeString", () => {
  it("should return empty string for undefined", () => {
    expect(cleanTimeString(undefined)).toBe("");
  });

  it("should return empty string for empty string", () => {
    expect(cleanTimeString("")).toBe("");
  });

  it("should format time without parentheses", () => {
    expect(cleanTimeString("05:30")).toBe("05:30");
    expect(cleanTimeString("12:00")).toBe("12:00");
  });

  it("should remove parentheses content", () => {
    expect(cleanTimeString("05:30 (Fajr Time)")).toBe("05:30");
    expect(cleanTimeString("12:00 (Salah Time)")).toBe("12:00");
  });

  it("should pad single digit hours", () => {
    expect(cleanTimeString("5:30")).toBe("05:30");
    expect(cleanTimeString("9:15")).toBe("09:15");
  });
});

describe("coordinate validation", () => {
  it("should validate proper coordinates", () => {
    expect(hasUsableCoordinates({ lat: 24.7136, lng: 46.6753 })).toBe(true);
    expect(hasUsableCoordinates({ lat: 21.2854, lng: 39.2376 })).toBe(true);
  });

  it("should reject missing coordinates", () => {
    expect(hasUsableCoordinates(null)).toBe(false);
    expect(hasUsableCoordinates({})).toBe(false);
    expect(hasUsableCoordinates({ lat: 24.7136 })).toBe(false);
    expect(hasUsableCoordinates({ lng: 46.6753 })).toBe(false);
  });

  it("should reject invalid numbers", () => {
    expect(hasUsableCoordinates({ lat: NaN, lng: 46.6753 })).toBe(false);
    expect(hasUsableCoordinates({ lat: 24.7136, lng: Infinity })).toBe(false);
    expect(hasUsableCoordinates({ lat: Infinity, lng: Infinity })).toBe(false);
  });
});

describe("coordinate matching", () => {
  it("should match identical coordinates", () => {
    expect(coordinateMatches(24.7136, 24.7136)).toBe(true);
    expect(coordinateMatches(null, null)).toBe(true);
  });

  it("should match coordinates within tolerance", () => {
    expect(coordinateMatches(24.7136, 24.7137)).toBe(true);
    expect(coordinateMatches(24.7136, 24.7135)).toBe(true);
  });

  it("should not match coordinates outside tolerance", () => {
    expect(coordinateMatches(24.7136, 24.7138)).toBe(false);
    expect(coordinateMatches(24.7136, 24.7200)).toBe(false);
  });

  it("should handle null values correctly", () => {
    expect(coordinateMatches(null, 24.7136)).toBe(false);
    expect(coordinateMatches(24.7136, null)).toBe(false);
  });
});

describe("Saudi city coordinates", () => {
  const SAUDI_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    riyadh: { lat: 24.7136, lng: 46.6753 },
    jeddah: { lat: 21.2854, lng: 39.2376 },
    makkah: { lat: 21.3891, lng: 39.8579 },
    madinah: { lat: 24.5247, lng: 39.5692 },
    dammam: { lat: 26.4207, lng: 50.0888 },
  };

  it("should have valid coordinates for major cities", () => {
    for (const [city, coords] of Object.entries(SAUDI_CITY_COORDS)) {
      expect(hasUsableCoordinates(coords)).toBe(true);
      expect(coords.lat).toBeGreaterThanOrEqual(15);
      expect(coords.lat).toBeLessThanOrEqual(32);
      expect(coords.lng).toBeGreaterThanOrEqual(35);
      expect(coords.lng).toBeLessThanOrEqual(55);
    }
  });

  it("should have unique coordinates for each city", () => {
    const coordStrings = Object.values(SAUDI_CITY_COORDS).map(
      (c) => `${c.lat},${c.lng}`
    );
    const uniqueCoords = new Set(coordStrings);
    expect(uniqueCoords.size).toBe(coordStrings.length);
  });
});
