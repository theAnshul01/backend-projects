import type {Request, Response} from "express";
import { getWeatherForCity } from "../services/weather.service.js";

export function getWeather(req: Request, res: Response){
    const { city } = req.query;

    if(typeof city !== "string" || city.trim() === ""){
        res.status(400).json({
            error: "City is required"
        });
        return; 
    }

    const weather = getWeatherForCity(city);

    res.status(200).json(weather);

}