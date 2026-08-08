import { describe, it, expect } from "vitest";
import { convertTemperature } from "../src/convertors/temperature";

describe("convertTemperature", () => {
    it("celsius to fahrenheit", () => {
        expect(convertTemperature(0, "celsius", "fahrenheit")).toBeCloseTo(32);
    });

    it("fahrenheit to celsius", () => {
        expect(convertTemperature(212, "fahrenheit", "celsius")).toBeCloseTo(100);
    });

    it("celsius to kelvin", () => {
        expect(convertTemperature(0, "celsius", "kelvin")).toBeCloseTo(273.15);
    });

    it("celsius to celsius", () => {
        expect(convertTemperature(37, "celsius", "celsius")).toBeCloseTo(37);
    });

    it("-40C and -40F", () => {
        expect(convertTemperature(-40, "celsius", "fahrenheit")).toBeCloseTo(-40);
    });
})