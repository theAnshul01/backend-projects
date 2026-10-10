import "dotenv/config"

import app from "./app.js";

import { env } from "./config/env.js";
import { connectRedis } from "./config/redis.js";

async function startServer(): Promise<void> {
    try {
        await connectRedis();

        app.listen(env.PORT, () => {
            console.log(`server running at http://localhost:${env.PORT}`);
            console.log("Redis connected successfully");
        });

    } catch (error) {
        console.error("Failed to start server: ", error);
        process.exit(1);
    }
}

startServer();



