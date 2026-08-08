import { describe, it, expect } from "vitest";
import { convertLength } from "../src/convertors/length";

describe("convertLength", () => {
    it("converts meters to centimeters", () => {
        expect(convertLength(1, "m", "cm")).toBeCloseTo(100);
    });

    it("converts kilometers to miles", () => {
        expect(convertLength(1, "km", "mile")).toBeCloseTo(0.6214, 3);
    });

    it("returns the same value when converting a unit to itself", () => {
        expect(convertLength(5, "m", "m")).toBe(5);
    })
})