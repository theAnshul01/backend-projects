const PORT = Number(process.env.PORT) || 3000;

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const REDIS_URL = process.env.REDIS_URL;

if(!OPENWEATHER_API_KEY){
    throw new Error("OPENWEATHER_API_KEY is not defined");
}

if(!REDIS_URL){
    throw new Error("REDIS_URL is not defined");
}

export const env = {
    PORT,
    OPENWEATHER_API_KEY,
    REDIS_URL,
};