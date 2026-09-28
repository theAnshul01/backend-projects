import { describe, expect, it } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("GET /weather", () => {
    it("should return weather data for a valid city", async() => {
        const response = await request(app)
                            .get("/v1/weather")
                            .query({city: "Pune"});
        
        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            city: "Pune",
            country: "IN",
            temperature: 28,
            feelsLike: 29,
            humidity: 65,
            description: "clear sky",
            windSpeed: 3.5,
        });
    });

    it("should return 400 when city is missing", async () => {
        const response = await request(app)
                            .get("/v1/weather");
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "City is required",
        });
    });

    it("should return 400 on when city is empty", async () => {
        const response = await request(app)
                            .get("/v1/weather")
                            .query({city: ""});
        
        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            error: "City is required",
        })
    })
});