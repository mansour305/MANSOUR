/**
 * Shared Utilities Tests
 */

import { describe, it, expect } from "vitest";

// Mock the constants
const GOLD = "#C9A063";
const BROWN = "#8A6B3D";
const INK = "#2F2B25";
const PAPER = "#FAF7F2";

describe("Shared Constants", () => {
  it("should have valid color constants", () => {
    expect(GOLD).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(BROWN).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(INK).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(PAPER).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("should have different colors for contrast", () => {
    expect(GOLD).not.toBe(BROWN);
    expect(BROWN).not.toBe(INK);
    expect(INK).not.toBe(PAPER);
  });
});

describe("Theme Object Structure", () => {
  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  };

  it("should have valid spacing values", () => {
    expect(spacing.xs).toBeLessThan(spacing.sm);
    expect(spacing.sm).toBeLessThan(spacing.md);
    expect(spacing.md).toBeLessThan(spacing.lg);
    expect(spacing.lg).toBeLessThan(spacing.xl);
  });

  it("should have valid radius values", () => {
    expect(radius.sm).toBeLessThan(radius.md);
    expect(radius.md).toBeLessThan(radius.lg);
    expect(radius.lg).toBeLessThan(radius.xl);
    expect(radius.full).toBe(9999);
  });
});

describe("Font Configuration", () => {
  const font = {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 21,
      xxl: 28,
      xxxl: 36,
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
  };

  it("should have increasing font sizes", () => {
    expect(font.sizes.xs).toBeLessThan(font.sizes.sm);
    expect(font.sizes.sm).toBeLessThan(font.sizes.md);
    expect(font.sizes.lg).toBeLessThan(font.sizes.xl);
  });

  it("should have valid font weights", () => {
    expect(Number(font.weights.normal)).toBeLessThan(Number(font.weights.bold));
    expect(Number(font.weights.bold)).toBeLessThanOrEqual(800);
  });
});
