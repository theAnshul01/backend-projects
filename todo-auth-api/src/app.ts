import express from "express";
import healthRouter from "./routes/health.router.js";
import todosRouter from "./routes/todos.router.js";
import authRouter from "./routes/auth.router.js";
// import { basicAuth } from "./auth/basicAuth.js";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);

app.use("/todos", todosRouter)
app.use("/auth", authRouter)

export default app;