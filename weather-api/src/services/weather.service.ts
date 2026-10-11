import { redisClient } from "../config/redis.js";
import { getCoordinates, getCurrentWeather } from "../clients/openweather.client.js";

const CACHE_TTL_SECONDS = 600;

export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    description: string;
    windSpeed: number;
}

export class CityNotFoundError extends Error {
    constructor() {
        super("CITY NOT FOUND");
        this.name = "CityNotFoundError";
    }
}

export async function getWeatherForCity(
    city: string
): Promise<WeatherData> {
    const normalizedCity = city.trim().toLowerCase();
    const cacheKey = `weather:${normalizedCity}`;

    try {
        const cachedWeather = await redisClient.get(cacheKey);

        if (cachedWeather !== null) {
            try {
                return JSON.parse(cachedWeather) as WeatherData;
            } catch {
                console.warn("Invalid weather cache entry:", cacheKey);
            }
        }
    } catch (error) {
        console.error("Redis cache read failed:", error);
    }

    const locations = await getCoordinates(city);

    if (locations.length === 0 || !locations[0]) {
        throw new CityNotFoundError();
    }

    const location = locations[0];

    const weather = await getCurrentWeather(
        location.lat,
        location.lon
    );

    const result: WeatherData = {
        city: weather.name,
        country: weather.sys.country,
        temperature: weather.main.temp,
        feelsLike: weather.main.feelsLike,
        humidity: weather.main.humidity,
        description: weather.weather[0]?.description ?? "Unknown",
        windSpeed: weather.wind.speed,
    };

    try {
        await redisClient.set(
            cacheKey,
            JSON.stringify(result),
            { EX: CACHE_TTL_SECONDS }
        );
    } catch (error) {
        console.error("Redis cache write failed:", error);
    }

    return result;
}
