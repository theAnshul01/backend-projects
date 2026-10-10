import { createClient } from "redis";
import { env } from "./env.js";

const redisUrl = env.REDIS_URL ?? "redis://127.0.0.1:6379";

export const redisClient = createClient({
    url: redisUrl,
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error: ", error);
});

export async function connectRedis(): Promise<void> {
    if(!redisClient.isOpen) {
        await redisClient.connect();
    }
}