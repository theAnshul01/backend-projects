import type {Request, Response} from "express";
import { CityNotFoundError, getWeatherForCity } from "../services/weather.service.js";

export async function getWeather(req: Request, res: Response){
    const { city } = req.query;

    if(typeof city !== "string" || city.trim() === ""){
        res.status(400).json({
            error: "City is required",
        });
        return; 
    }

    try {
        const weather = await getWeatherForCity(city);
        res.status(200).json(weather);
    } catch (error: unknown) {
        if (error instanceof CityNotFoundError) {
            res.status(404).json({
                error: "City not found",
            });
            return;
        }

        if(error instanceof Error && error.message === "OpenWeather unavailable") {
            res.status(502).json({
                error: "Weather provider unavailable",
            });
            return;
        }

        res.status(500).json({
            error: "Internal server error",
        });
    }

    

}