import { Router } from "express";
import { getWeather } from "../controllers/weather.controller.js";
import { weatherRateLimiter } from "../middleware/rate-limit.js";
const router = Router();
router.use(weatherRateLimiter);
router.get("/", getWeather);

export default router;