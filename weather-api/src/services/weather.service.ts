export interface WeatherData {
    city: string;
    country: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    description: string;
    windSpeed: number;
}

export function getWeatherForCity(city: string): WeatherData {
    return {
        city,
        country: "IN",
        temperature: 28,
        feelsLike: 29,
        humidity: 65,
        description: "clear sky",
        windSpeed: 3.5,
    }
}