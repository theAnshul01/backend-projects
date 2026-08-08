import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pagesRouter from "./routes/pages.js"
import apiRouter from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

// parse form submission
app.use(express.urlencoded({extended: true}));
// parse json bodies
app.use(express.json());

// serve static frontend files
app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use(pagesRouter);
app.use(apiRouter);

app.get("/", (req, res) => {
    res.send("Unit convertor - try /length, /weight, /temperature, or /api-demo");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});