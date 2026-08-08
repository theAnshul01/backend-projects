export type TemperatureUnit = 
    | "celsius"
    | "fahrenheit"
    | "kelvin";

export const temperatureUnits: TemperatureUnit[] = ["celsius", "fahrenheit", "kelvin"]

function toCelsius(value: number, from: TemperatureUnit): number {
    switch(from) {
        case "celsius":
            return value;
        case "fahrenheit":
            return (value - 32) * (5 / 9);
        case "kelvin":
            return value - 273.15
    }
}

function fromCelsius(value: number, to: TemperatureUnit): number {
    switch(to) {
        case "celsius":
            return value;
        case "fahrenheit":
            return value * (9/5) + 32;
        case "kelvin":
            return value + 273.15;
    }
}



export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
    const celsius = toCelsius(value, from);
    return fromCelsius(celsius, to);
} 