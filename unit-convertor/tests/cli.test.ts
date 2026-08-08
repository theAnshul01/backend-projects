import { describe, expect, it } from "vitest";
import { execa } from "execa";

describe("CLI: length", () => {
    it("converts meters to centimeters", async () => {
        const { stdout } = await execa("npx", [
            "tsx",
            "src/cli.ts",
            "length",
            "-v", "5",
            "-f", "m",
            "-t", "cm",
        ]);

        expect(stdout).toContain("500");
    })

    it("errors on invalid unit", async () => {
        const result = await execa("npx", [
            "tsx",
            "src/cli.ts",
            "length",
            "-v", "5",
            "-f", "meter",
            "-t", "cm",
        ], { reject: false }); // the last reject is to prevent throwing in case non-zero exit code encountered

        expect(result.exitCode).toBe(1);
        expect(result.stderr).toContain("Invalid unit");
    })
})

describe("CLI: Weight", () => {

    it("converts kg to g", async () => {
        const { stdout } = await execa("npx", [
            "tsx",
            "src/cli.ts",
            "weight",
            "-v", "10",
            "-f", "kg",
            "-t", "g"
        ]);

        expect(stdout).toContain("10000")
    })

    it("error on invalid input", async () => {
        const result = await execa("npx", [
            "tsx",
            "src/cli.ts",
            "weight",
            "-v", "10",
            "-f", "cels",
            "-t", "g"
        ], {reject: false});

        expect(result.exitCode).toBe(1);
        expect(result.stderr).toContain("Invalid unit");
    })

})


describe("CLI: Temperature", () => {

    it("converts celsius to kelvin", async () => {
        const { stdout } = await execa("npx", [
            "tsx",
            "src/cli.ts",
            "temperature",
            "-v", "0",
            "-f", "celsius",
            "-t", "kelvin"
        ]);

        expect(stdout).toContain("273.15")
    })

    it("error on invalid input", async () => {
        const result = await execa("npx", [
            "tsx",
            "src/cli.ts",
            "temperature",
            "-v", "0",
            "-f", "cels",
            "-t", "kelvin"
        ], {reject: false});

        expect(result.exitCode).toBe(1);
        expect(result.stderr).toContain("Invalid unit");
    })

})