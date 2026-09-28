import "dotenv/config"

import app from "./app.js";

import { env } from "./config/env.js";

app.listen(env.PORT, () => {
    console.log(`server running at http://localhost:${env.PORT}`);
});
