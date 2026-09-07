import express from "express";
import healthRouter from "./routes/health.router.js";
import todosRouter from "./routes/todos.router.js";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);

app.use("/todos", todosRouter)

export default app;