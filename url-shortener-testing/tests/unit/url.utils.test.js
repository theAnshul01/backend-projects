import { describe, it, expect } from "vitest";
import { isValidUrl } from "../../src/utils/url.utils";

describe('checks the valid URLs', () => { 
    it("should return true for the valid HTTPS url", () => {
        expect(isValidUrl("https://google.com")).toBe(true);
    })
    it("should return true for the valid HTTP url", () => {
        expect(isValidUrl("http://google.com")).toBe(true);
    })
    it("should return false for invalid url", () => {
        expect(isValidUrl("not-a-url")).toBe(false);
    })
    it("should return false for an empty string", () => {
        expect(isValidUrl("")).toBe(false);
    })
    it("should reject ftp URLs", () => {
        expect(isValidUrl("ftp://google.com")).toBe(false);
    })
 })