import axios from "axios";
import { env } from "../config/env.js";

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org";

export interface OpenWeatherLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export interface OpenWeatherResponse {
    name: string;

    sys: {
        country: string;
    }

    main: {
        temp: number;
        feelsLike: number;
        humidity: number;
    }

    weather: {
        description: string;
    }[];

    wind: {
        speed: number;
    }
}

export async function getCoordinates(city: string): Promise<OpenWeatherLocation[]> {
    const response = await axios.get<OpenWeatherLocation[]>(
        `${OPENWEATHER_BASE_URL}/geo/1.0/direct`,
        {
            params: {
                q: city,
                limit: 1,
                appid: env.OPENWEATHER_API_KEY,
            }
        }
    )

    return response.data;
}

export async function getCurrentWeather(latitude: number, longitude: number): Promise<OpenWeatherResponse> {
    const response = await axios.get<OpenWeatherResponse>(
        `${OPENWEATHER_BASE_URL}/data/2.5/weather`,
        {
            params: {
                lat: latitude,
                lon: longitude,
                appid: env.OPENWEATHER_API_KEY,
                units: "metric",
            }
        }
    );

    return response.data;
}