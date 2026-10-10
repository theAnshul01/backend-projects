import { describe, expect, it, vi} from "vitest";
import request from "supertest";

import app from "../src/app.js";

import * as openWeatherClient from "../src/clients/openweather.client.js"

vi.mock("../src/clients/openweather.client.js");

describe("GET /weather", () => {
    it("should return weather data for a valid city", async() => {
        vi.mocked(openWeatherClient.getCoordinates).mockResolvedValue([
            {
                name: "Pune",
                lat: 18.5204,
                lon: 73.8567,
                country: "IN",
            },
        ]);

        vi.mocked(openWeatherClient.getCurrentWeather).mockResolvedValue({
            name: "Pune",
            sys: {
                country: "IN",
            },
            main: {
                temp: 28,
                feelsLike: 29,
                humidity: 65,
            },
            weather: [
                {
                    description: "clear sky",
                },
            ],
            wind: {
                speed: 3.5,
            },
        })


        const response = await request(app)
                            .get("/v1/weather")
                            .query({city: "Pune"});
        
        expect(response.status).toBe(200);

        expect(openWeatherClient.getCoordinates).toHaveBeenCalledWith("Pune");

        expect(openWeatherClient.getCurrentWeather).toHaveBeenCalledWith(18.5204, 73.8567);

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

    it("should return 404 when city is not found", async () => {
        vi.mocked(openWeatherClient.getCoordinates).mockResolvedValue([])

        const response = await request(app).get("/v1/weather").query({city: "NotARealCity"});

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error: "City not found",
        });
    })

    it("should return 502 when the weather provider fails", async () => {
        vi.mocked(openWeatherClient.getCoordinates).mockRejectedValue(
            new Error("OpenWeather unavailable")
        );

        const response = await request(app)
                            .get("/v1/weather")
                            .query({city: "Pune"})
        
        expect(response.status).toBe(502);
        expect(response.body).toEqual({
            error: "Weather provider unavailable",
        });
    });

    it("should return 500 when an unexpected error occurs", async () => {
        vi.mocked(openWeatherClient.getCoordinates).mockRejectedValue(
            new Error("Unexpected internal error")
        );

        const response = await request(app)
                            .get("/v1/weather")
                            .query({ city: "Pune" })

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Internal server error",
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