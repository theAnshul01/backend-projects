import { describe, it, expect } from "vitest";
import { convertWeight } from "../src/convertors/weight";

describe("convertWeight", () => {
    it("convert kg to g", () => {
        expect(convertWeight(1, "kg", "g")).toBeCloseTo(1000);
    });

    it("convert g to kg", () => {
        expect(convertWeight(500, "g", "kg")).toBeCloseTo(0.5, 3);
    });

    it("convert oz to kg", () => {
        expect(convertWeight(1, "oz", "kg")).toBeCloseTo(0.0283, 3);
    })

    it("returns the same value when converting a unit to itself", () => {
        expect(convertWeight(10, "lb", "lb")).toBe(10);
    });

    it("returns 0 when converting 0 of any unit", () => {
        expect(convertWeight(0, "kg", "lb")).toBe(0);
    });

})