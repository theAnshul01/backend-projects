import { getCoordinates, getCurrentWeather } from "../clients/openweather.client.js";

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

export async function getWeatherForCity(city: string): Promise<WeatherData>{
    const locations = await getCoordinates(city);

    if(locations.length === 0){
        throw new CityNotFoundError();
    }

    const location = locations[0];

    if(!location){
        throw new CityNotFoundError();
    }

    const weather = await getCurrentWeather(location.lat, location.lon);

    return {
        city: weather.name,
        country: weather.sys.country,
        temperature: weather.main.temp,
        feelsLike: weather.main.feelsLike,
        humidity: weather.main.humidity,
        description: weather.weather[0]?.description ?? "Unknown",
        windSpeed: weather.wind.speed,
    }
}