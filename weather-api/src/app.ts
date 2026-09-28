import express from "express";
import weatherRouter from "./routes/weather.routes.js";
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "Weather API is running",
    });
});

app.use("/v1/weather", weatherRouter);

export default app;
